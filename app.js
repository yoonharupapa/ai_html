/* ============================================================
   성장판 종합 가이드 — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- scroll progress ---------- */
  var progress = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- TOC active state ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc__link"));
  var map = {};
  links.forEach(function (l) {
    var id = l.getAttribute("href").slice(1);
    map[id] = l;
  });
  var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) { l.classList.remove("is-active"); });
        var active = map[e.target.id];
        if (active) active.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------- mobile TOC toggle ---------- */
  var toc = document.getElementById("toc");
  var toggle = document.getElementById("tocToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = toc.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    toc.addEventListener("click", function (e) {
      if (e.target.closest(".toc__link")) {
        toc.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faqitem__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var panel = item.querySelector(".faqitem__a");
      var open = item.classList.toggle("is-open");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    });
  });

  /* ---------- checklist ---------- */
  document.querySelectorAll(".checkitem").forEach(function (item) {
    item.addEventListener("click", function () {
      item.classList.toggle("is-checked");
    });
  });

  /* ---------- myth evidence filter ---------- */
  var mythFilter = document.getElementById("mythFilter");
  var mythCards = Array.prototype.slice.call(document.querySelectorAll("#mythList .mythcard"));
  if (mythFilter) {
    mythFilter.addEventListener("click", function (e) {
      var btn = e.target.closest(".mythfilter__btn");
      if (!btn) return;
      mythFilter.querySelectorAll(".mythfilter__btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      mythCards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-verdict") === f;
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); revObs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    document.querySelectorAll(".reveal").forEach(function (el) { revObs.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }
})();
