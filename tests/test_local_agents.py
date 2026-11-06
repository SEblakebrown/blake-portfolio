import importlib.util
import pathlib
import unittest
from unittest.mock import patch

SERVER = pathlib.Path(__file__).resolve().parents[1] / "local-agents" / "server.py"
spec = importlib.util.spec_from_file_location("portfolio_local_agents", SERVER)
service = importlib.util.module_from_spec(spec)
spec.loader.exec_module(service)

class WorkshopTests(unittest.TestCase):
    def setUp(self):
        with service.LOCK:
            service.STATE.update(status="idle", events=[], plan="", draft="", review="", saved="")

    def test_run_generates_draft_and_human_review_required(self):
        examples = [
            "Plan a project card",
            '<section class="glass"><h2>Portfolio Project</h2></section>',
            "Review: use accessible focus indicators"
        ]
        with patch.object(service, "ask", side_effect=examples) as llm:
            service.run("Build a component", "llama3.2")
        self.assertEqual(llm.call_count, 3)
        self.assertEqual(service.STATE["status"], "review")
        self.assertIn("<section", service.STATE["draft"])
        self.assertFalse(service.STATE["saved"])
        self.assertEqual([x["agent"] for x in service.STATE["events"]][-1], "REVIEW")

    def test_reject_unusable_markup(self):
        with patch.object(service, "ask", side_effect=["Plan", "Not HTML", "Still just an explanation"]):
            service.run("Build a component", "llama3.2")
        self.assertEqual(service.STATE["status"], "error")
        self.assertFalse(service.STATE["saved"])

    def test_accepts_fenced_div_html_and_wraps_in_section(self):
        examples = [
            "Plan a project card",
            "```html\n<div class='glass'><h2>Cloud Portfolio</h2></div>\n```",
            "Review: contrast looks good",
        ]
        with patch.object(service, "ask", side_effect=examples) as llm:
            service.run("Build a cloud component", "llama3.2")
        self.assertEqual(llm.call_count, 3)
        self.assertEqual(service.STATE["status"], "review")
        self.assertTrue(service.STATE["draft"].startswith("<section"))
        self.assertIn("Cloud Portfolio", service.STATE["draft"])

    def test_retries_when_first_code_response_is_only_prose(self):
        examples = [
            "Plan a project card",
            "Here is how I would create your portfolio.",
            "<section><h2>Working sample</h2></section>",
            "Review: include accessible text",
        ]
        with patch.object(service, "ask", side_effect=examples) as llm:
            service.run("Build a component", "llama3.2")
        self.assertEqual(llm.call_count, 4)
        self.assertEqual(service.STATE["status"], "review")
        self.assertTrue(any("retrying" in e["message"].lower() for e in service.STATE["events"]))

    def test_rejects_empty_model_response(self):
        with self.assertRaises(ValueError):
            service.normalize_component("")
    
    def test_server_is_loopback_only(self):
        source = SERVER.read_text(encoding="utf-8")
        self.assertIn('("127.0.0.1",8765)', source)
        self.assertIn('X-Workshop-Token', source)

if __name__ == "__main__":
    unittest.main()
