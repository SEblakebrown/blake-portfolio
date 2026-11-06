import json, re, secrets, threading, time, urllib.request
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKEN = secrets.token_urlsafe(24)
LOCK = threading.RLock()
STATE = {"status": "idle", "events": [], "plan": "", "draft": "", "review": "", "saved": ""}
PORT = 8765

def log(agent, message):
    with LOCK:
        STATE["events"].append({"agent": agent, "message": message, "time": time.strftime("%H:%M:%S")})

def ask(model, role, text):
    payload = json.dumps({"model": model, "messages": [
        {"role": "system", "content": role},
        {"role": "user", "content": text}
    ], "stream": False, "options": {"num_predict": 1700}}).encode()
    req = urllib.request.Request("http://127.0.0.1:11434/api/chat", data=payload,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=240) as resp:
        return json.load(resp)["message"]["content"]

def run(prompt, model):
    try:
        log("NOVA", "Planning a portfolio component using Ollama")
        plan = ask(model, "You are NOVA, a web architect. Write a concise plan. No false execution claims.", prompt)
        with LOCK: STATE["plan"] = plan[:6000]
        log("NOVA", "Plan completed")
        log("CODEX", "Generating an HTML/CSS portfolio component")
        draft = ask(model, "You are CODEX. Output only a standalone semantic HTML section with inline CSS in a style tag. No JS, remote dependencies, forms, links, iframes, or markdown fences. Light frosted-glass style.", plan[:5000])
        draft = re.sub(r"^\s*\x60\x60\x60(?:html)?|\x60\x60\x60\s*$", "", draft.strip(), flags=re.I)
        if len(draft) > 70000 or not re.search(r"<section\b", draft, re.I):
            raise ValueError("Model did not produce a usable section")
        draft = re.sub(r"<script\b[^>]*>[\s\S]*?</script\s*>", "", draft, flags=re.I)
        draft = re.sub(r"<(?:iframe|form|object|embed|link|base)\b[^>]*>", "", draft, flags=re.I)
        draft = re.sub(r"\s+on[a-z]+\s*=\s*(?:\"[^\"]*\"|'[^']*'|[^\s>]+)", "", draft, flags=re.I)
        with LOCK: STATE["draft"] = draft
        log("CODEX", "Draft component produced (not applied)")
        log("REVIEW", "Reviewing the generated component")
        review = ask(model, "You are REVIEW. Give a concise critique for accessibility, responsiveness and security. Do not claim anything was tested.", draft[:10000])
        with LOCK:
            STATE["review"] = review[:6000]
            STATE["status"] = "review"
        log("REVIEW", "Review ready; user approval required to save")
    except Exception as e:
        log("SYSTEM", "Agent run failed: " + str(e)[:280])
        with LOCK: STATE["status"] = "error"

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kw):
        super().__init__(*args, directory=str(ROOT), **kw)

    def permitted(self):
        return self.headers.get("Host") in ("127.0.0.1:8765", "localhost:8765") and self.headers.get("Origin", "http://127.0.0.1:8765") in ("http://127.0.0.1:8765", "http://localhost:8765")

    def respond(self, value, status=200):
        data=json.dumps(value).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if not self.permitted(): return self.respond({"error":"forbidden"},403)
        path = self.path.split("?")[0]
        if path == "/api/health": return self.respond({"mode":"local-ollama","token":TOKEN})
        if path == "/api/state":
            with LOCK: return self.respond(dict(STATE,events=list(STATE["events"])))
        if path.startswith("/agent-output/") or path.startswith("/local-agents/"):
            return self.respond({"error":"forbidden"},403)
        if path == "/": self.path="/agent-workshop.html"
        return super().do_GET()

    def do_POST(self):
        if not self.permitted() or self.headers.get("X-Workshop-Token") != TOKEN:
            return self.respond({"error":"forbidden"},403)
        length=int(self.headers.get("Content-Length","0"))
        if not 0 < length <= 5000: return self.respond({"error":"invalid size"},400)
        try: payload=json.loads(self.rfile.read(length))
        except ValueError: return self.respond({"error":"invalid JSON"},400)
        if self.path == "/api/start":
            prompt=payload.get("prompt","")
            model=payload.get("model","llama3.2")
            if not isinstance(prompt,str) or not 5 <= len(prompt) <= 2000: return self.respond({"error":"Enter a prompt (5–2000 characters)"},400)
            if not isinstance(model,str) or not re.fullmatch(r"[\w./:-]{1,80}",model): return self.respond({"error":"invalid model"},400)
            with LOCK:
                if STATE["status"] == "running": return self.respond({"error":"Already running"},409)
                STATE.update(status="running",events=[],plan="",draft="",review="",saved="")
            threading.Thread(target=run,args=(prompt,model),daemon=True).start()
            return self.respond({"started":True})
        if self.path == "/api/approve":
            with LOCK:
                if STATE["status"]!="review": return self.respond({"error":"no draft to approve"},409)
                output=ROOT/"agent-output"
                output.mkdir(exist_ok=True)
                path=output/("approved-"+secrets.token_hex(6)+".html")
                path.write_text(STATE["draft"],encoding="utf-8")
                STATE["saved"]=str(path.relative_to(ROOT))
                STATE["status"]="approved"
            log("SYSTEM","User approved draft; saved as "+STATE["saved"])
            return self.respond({"saved":STATE["saved"]})
        if self.path == "/api/reject":
            with LOCK:
                if STATE["status"]!="review": return self.respond({"error":"no draft"},409)
                STATE["draft"]=""
                STATE["status"]="rejected"
            log("NOVA","Draft rejected — no file saved")
            return self.respond({"rejected":True})
        self.respond({"error":"unknown operation"},404)

if __name__ == "__main__":
    print("Open http://127.0.0.1:8765/ (requires local Ollama with llama3.2)")
    ThreadingHTTPServer(("127.0.0.1",8765),Handler).serve_forever()
