(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new Set();
  function arrive(element) {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(
      [{ transform: "translateY(12px)" }, { transform: "translateY(0)" }],
      { duration: 360, easing: "cubic-bezier(0.2,0.7,0.2,1)" },
    );
    animations.add(animation);
    animation.finished
      .catch(() => {})
      .finally(() => animations.delete(animation));
    return animation;
  }
  reduced.addEventListener("change", () => {
    if (reduced.matches) for (const animation of animations) animation.cancel();
  });
  for (const group of document.querySelectorAll("[data-switcher]")) {
    const list = group.querySelector("[data-switch-list]");
    const tabs = [...list.querySelectorAll("[data-panel]")];
    list.setAttribute("role", "tablist");
    let transition;
    function select(tab, focus = false) {
      transition?.cancel();
      for (const item of tabs) {
        const active = item === tab;
        const panel = document.getElementById(item.dataset.panel);
        item.setAttribute("role", "tab");
        item.setAttribute("aria-controls", panel.id);
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", item.id);
        panel.tabIndex = 0;
        panel.hidden = !active;
      }
      if (focus) tab.focus();
      transition = arrive(document.getElementById(tab.dataset.panel));
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        if (tab.getAttribute("aria-selected") !== "true") select(tab);
      });
      tab.addEventListener("keydown", (event) => {
        const next = {
          ArrowRight: (index + 1) % tabs.length,
          ArrowLeft: (index + tabs.length - 1) % tabs.length,
          Home: 0,
          End: tabs.length - 1,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select(tabs[next], true);
      });
    });
    select(tabs[0]);
  }
  const links = [...document.querySelectorAll("[data-chapter]")];
  const chapters = links.map((link) => document.querySelector(link.hash));
  const progress = document.querySelector(".chapter-progress");
  let frame;
  function update() {
    frame = null;
    const threshold = Math.min(innerHeight * 0.4, 300);
    let current = 0;
    chapters.forEach((chapter, index) => {
      if (chapter.getBoundingClientRect().top <= threshold) current = index;
    });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 1})`;
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  if (links.length) {
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("pageshow", schedule);
    update();
    if ("ResizeObserver" in window)
      new ResizeObserver(schedule).observe(document.body);
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          arrive(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(
        ".entry-intro, .section-intro, .screen-tour-copy, .start-section > div",
      )
      .forEach((element) => observer.observe(element));
  }
})();
