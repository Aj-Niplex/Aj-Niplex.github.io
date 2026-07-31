"""
Niplex visitor counter - Python stdlib only, zero bot protection.

Every hit - human or crawler - is counted. There is intentionally no
anti-bot logic anywhere in this project: crawlers are welcome to index
and research everything.

Storage strategy (in order):
  1. If COUNTER_KV_URL is set (production), use it as a remote KV REST
     endpoint that atomically increments a value and returns JSON like
     {"views": N} (e.g. an Upstash/Cloudflare-backed counter). When
     COUNTER_KV_TOKEN is set it is sent as a Bearer token.
  2. Otherwise fall back to a local JSON file (visits.json) - perfect
     for the preview/dev server, best-effort on ephemeral hosting FS.
"""
import json
import os
import threading
import urllib.request

_FILE = os.environ.get("COUNTER_FILE", "visits.json")
_KV_URL = os.environ.get("COUNTER_KV_URL", "").strip()
_KV_TOKEN = os.environ.get("COUNTER_KV_TOKEN", "").strip()

_lock = threading.Lock()


def _read_local() -> int:
    try:
        with open(_FILE, "r", encoding="utf-8") as fh:
            return int(json.load(fh).get("views", 0))
    except (OSError, ValueError, TypeError):
        return 0


def _write_local(views: int) -> None:
    tmp = _FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump({"views": views}, fh)
    os.replace(tmp, _FILE)


def _kv_request(method: str) -> dict:
    req = urllib.request.Request(_KV_URL, method=method)
    if _KV_TOKEN:
        req.add_header("Authorization", "Bearer " + _KV_TOKEN)
    with urllib.request.urlopen(req, timeout=5) as resp:
        raw = resp.read().decode("utf-8") or "{}"
        data = json.loads(raw)
    if isinstance(data, dict) and "views" not in data:
        data = {"views": int(data.get("count", data.get("value", 0)))}
    return data


def get_views() -> dict:
    """Return the current total without incrementing."""
    with _lock:
        if _KV_URL:
            try:
                return _kv_request("GET")
            except Exception:
                pass  # fall back to local storage
        return {"views": _read_local()}


def increment_views() -> dict:
    """Increment the counter and return the new total."""
    with _lock:
        if _KV_URL:
            try:
                return _kv_request("POST")
            except Exception:
                pass  # fall back to local storage
        views = _read_local() + 1
        try:
            _write_local(views)
        except OSError:
            pass  # ephemeral FS - keep going with the in-memory value
        return {"views": views}


def handler(event=None, context=None) -> dict:
    """Serverless-style handler (Vercel-compatible shape).

    Freebuff hosting runs Python in api/*.py; this gives production a
    simple HTTP entrypoint. The same logic powers the preview via server.py.
    """
    event = event or {}
    path = event.get("path") or event.get("rawPath") or ""
    method = event.get("httpMethod") or event.get("method") or "GET"
    if path.endswith("/api/visit") and method == "POST":
        payload = increment_views()
    else:
        payload = get_views()
    body = json.dumps(payload)
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
        },
        "body": body,
    }
