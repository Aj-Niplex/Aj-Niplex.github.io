/* Niplex shared site script.
 * Visitor counter: one increment per page load via the Python backend
 * (server.py in dev, api/counter.py in production). No bot protection -
 * crawlers are counted too, by design. */
(function () {
    "use strict";

    function fmt(n) {
        return Number(n).toLocaleString("en-US");
    }

    function animateCount(el, target) {
        var start = parseInt((el.textContent || "0").replace(/[^0-9]/g, ""), 10) || 0;
        if (target <= start) {
            el.textContent = fmt(target);
            return;
        }
        var duration = 900;
        var t0 = performance.now();
        function tick(now) {
            var p = Math.min((now - t0) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(Math.round(start + (target - start) * eased));
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function updateCounters() {
        var els = document.querySelectorAll(".view-counter");
        if (!els.length) return;
        fetch("/api/visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then(function (res) {
                if (!res.ok) throw new Error("counter api " + res.status);
                return res.json();
            })
            .then(function (data) {
                if (typeof data.views !== "number") return;
                els.forEach(function (el) { animateCount(el, data.views); });
            })
            .catch(function () {
                /* Backend unreachable (e.g. opened as file://) - leave placeholder. */
            });
    }

    updateCounters();
})();
