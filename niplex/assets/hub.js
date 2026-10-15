/* NiPlex Hub extras — fluid cursor (desktop-only, motion-safe).
   Phones/tablets (pointer: coarse) and prefers-reduced-motion users
   get the untouched native experience; this script exits immediately. */
(function () {
    'use strict';
    var fine = window.matchMedia('(pointer: fine)').matches;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    var dot = document.createElement('div');
    dot.id = 'cursor-dot';
    var ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('fluid-cursor');

    var x = window.innerWidth / 2, y = window.innerHeight / 2;
    var rx = x, ry = y;

    window.addEventListener('mousemove', function (e) {
        x = e.clientX; y = e.clientY;
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
    }, { passive: true });

    window.addEventListener('mousedown', function () { ring.classList.add('down'); });
    window.addEventListener('mouseup', function () { ring.classList.remove('down'); });
    document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; ring.style.opacity = '1'; });

    function attachHover() {
        var els = document.querySelectorAll('a, button, .btn, .stack-card, .project-card, .sidebar-card');
        for (var i = 0; i < els.length; i++) {
            (function (el) {
                el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
                el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
            })(els[i]);
        }
    }
    attachHover();

    (function loop() {
        rx += (x - rx) * 0.16;
        ry += (y - ry) * 0.16;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        window.requestAnimationFrame(loop);
    })();
})();
