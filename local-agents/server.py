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

def normalize_component(raw):
    """Extract usable HTML from typical local LLM responses without inventing markup."""
    if not isinstance(raw, str) or not raw.strip():
        raise ValueError("Ollama returned an empty response")
    raw = raw.strip()
    blocks = re.findall(r"\x60{3}(?:html|htm)?[ \t]*\r?\n([\s\S]*?)\x60{3}", raw, flags=re.I)
    if blocks:
        candidates = [block for block in blocks if re.search(r"<(?:section|article|div|main|header|h[1-6])\b", block, re.I)]
        if candidates:
            raw = "\n".join(candidates)
    # Reject copies of this site's diagnostic UI or a whole existing page.
    # This workshop generates an isolated portfolio component, not a homepage clone.
    if re.search(r"(swarm startup diagnostics|diagnostics build 2026|swarm-log|swarm-copy|id=[\\\"']app[\\\"'])", raw, re.I):
        raise ValueError("CODEX copied the swarm diagnostic screen instead of generating a component")
    if re.search(r"<(?:!doctype|html|head|body)\\b", raw, re.I):
        raise ValueError("CODEX returned a full webpage instead of a standalone component")
    # Accept complete HTML documents, standalone sections, and div-based components.
    if not re.search(r"<(?:section|article|div|main|header|h[1-6])\b", raw, re.I):
        raise ValueError("Ollama returned text rather than an HTML component")
    if len(raw) > 70000:
        raise ValueError("Generated component exceeded the size limit")
    # Remove active content from the preview; it also loads in a script-disabled iframe.
    raw = re.sub(r"<script\b[^>]*>[\s\S]*?</script\s*>", "", raw, flags=re.I)
    raw = re.sub(r"<(?:iframe|form|object|embed|link|base|meta)\b[^>]*>", "", raw, flags=re.I)
    raw = re.sub(r"\s+on[a-z]+\s*=\s*(?:\"[^\"]*\"|'[^']*'|[^\s>]+)", "", raw, flags=re.I)
    raw = re.sub(r"""(?:href|src)\s*=\s*(?:"(?:javascript:|data:|https?://)[^"]*"|'(?:javascript:|data:|https?://)[^']*')""", "", raw, flags=re.I)
    if not re.search(r"<section\b", raw, re.I):
        # A div/article HTML component is useful even if the model omitted <section>.
        raw = '<section class="generated-component">\n' + raw + '\n</section>'
    return raw

def run(prompt, model):
    try:
        log("NOVA", "Planning a portfolio component using Ollama")
        plan = ask(model, "You are NOVA, a web architect. Write a concise plan. No false execution claims.", prompt)
        with LOCK: STATE["plan"] = plan[:6000]
        log("NOVA", "Plan completed")
        log("CODEX", "Generating an HTML/CSS portfolio component")
        code_role = ("You are CODEX. Produce ONLY valid, standalone HTML for a responsive "
                     "portfolio component. Begin with <section> and end with </section>. "
                     "Include a <style> block for light frosted-glass styling. "
                     "Do not reproduce any existing homepage, the swarm diagnostics overlay, or browser error screens. "
                     "Create new content specifically addressing the user request. "
                     "No markdown, explanations, scripts, remote assets, forms, or iframes.")
        draft = None
        for attempt in range(2):
            if attempt:
                log("CODEX", "First response was not valid HTML; retrying with stricter instructions")
            response = ask(
                model, code_role,
                ("Create HTML for the following plan:\n" + plan[:5000]) if not attempt else
                ("Your prior response did not contain an original, usable portfolio component. Avoid diagnostics or full-page HTML. "
                 "Return HTML only, starting exactly with <section> and ending with "
                 "</section>. No prose, no markdown fences. Plan:\n" + plan[:4000])
            )
            try:
                draft = normalize_component(response)
                break
            except ValueError as issue:
                if attempt:
                    raise ValueError(
                        "CODEX returned no usable HTML after two attempts. "
                        "Try a more specific request or a stronger Ollama coding model."
                    ) from issue
        if not draft:
            raise ValueError("No usable CODEX output")
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
