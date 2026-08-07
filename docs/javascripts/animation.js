document.addEventListener("DOMContentLoaded", function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll-reveal: add .reveal-visible as elements enter the viewport */
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if (!("IntersectionObserver" in window) || reduced) {
    revealEls.forEach(function (el) { el.classList.add("reveal-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach(function (el) { observer.observe(el); });

  /* Animate counters (e.g. star counts) when they scroll into view */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    observer.observe(el);
  });
});
