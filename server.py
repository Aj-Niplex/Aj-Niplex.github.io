#!/usr/bin/env python3
"""
Niplex site server - Python stdlib only, this is the project's main
backend. Serves the static site AND the visitor-counter API.

Routes:
    GET  /api/counter   -> {"views": N}          (no increment)
    POST /api/visit     -> {"views": N}          (increment + return)
    *    everything else -> static files (index.html, style.css, assets/)

Bind: 0.0.0.0, Port: $PORT (Freebuff injects PORT for isolated workspaces).
"""
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "8000"))

# Share the counter logic with the production api/*.py entrypoint.
sys.path.insert(0, os.path.join(ROOT, "api"))
import counter  # noqa: E402


class SiteHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ("/api/visit", "/api/counter"):
            self._send_json(counter.get_views())
            return
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/visit":
            self._send_json(counter.increment_views())
            return
        self.send_error(404, "Not Found")

    def _send_json(self, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        sys.stderr.write("[niplex] %s\n" % (fmt % args))


if __name__ == "__main__":
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), SiteHandler)
    sys.stderr.write(
        "Niplex backend running on 0.0.0.0:%d (python %s)\n"
        % (PORT, sys.version.split()[0])
    )
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
