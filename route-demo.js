(() => {
  "use strict";
  const experience = document.querySelector("#route-experience");
  if (!experience) return;
  const map = document.querySelector("#atlas-map");
  const paths = [...map.querySelectorAll("[data-path]")];
  const buttons = [...experience.querySelectorAll("[data-route]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const examples = {
    balanced: {
      label: "균형 있게",
      distance: "14.8",
      minutes: "17",
      difference: "경치 예시보다 2.0km 덜, 약 3분 덜.",
      explanation: "경치와 한적함, 편안함의 비중을 고르게 둔 예시예요.",
    },
    scenic: {
      label: "경치에 더 비중을",
      distance: "16.8",
      minutes: "20",
      difference: "균형 경로보다 2.0km 더, 약 3분 더.",
      explanation: "경치와 한적함의 비중을 높여 같은 목적지로 찾은 예시예요.",
    },
  };
  let selected = "scenic";
  let animation;
  function select(id, animate = true) {
    if (!examples[id]) return;
    selected = id;
    const example = examples[id];
    animation?.cancel();
    for (const button of buttons) {
      const active = button.dataset.route === id;
      button.setAttribute("aria-pressed", String(active));
      button.querySelector(".choice-state").textContent = active
        ? "선택됨"
        : "선택";
    }
    for (const path of paths)
      path.classList.toggle("selected", path.dataset.path === id);
    const active = paths.find((path) => path.dataset.path === id);
    // Paint the active road last, maintaining exact coordinates and fixed camera.
    active.parentElement.insertBefore(
      active,
      active.parentElement.querySelector(".route-end"),
    );
    if (animate && !reduced.matches && active.animate) {
      animation = active.animate([{ opacity: 0.25 }, { opacity: 1 }], {
        duration: 320,
        easing: "ease-out",
      });
    }
    document.querySelector("#map-key").textContent = example.label;
    document.querySelector("#route-difference").textContent =
      example.difference;
    document.querySelector("#route-explanation").textContent =
      example.explanation;
    map.setAttribute(
      "aria-label",
      `미포에서 일광까지. ${example.label} 실제 탐색 예시, ${example.distance}km, 약 ${example.minutes}분.`,
    );
    document.querySelector("#dialog-route-label").textContent =
      `${example.label} · ${example.distance}km · 약 ${example.minutes}분`;
  }
  for (const button of buttons) {
    button.disabled = false;
    button.addEventListener("click", () => {
      if (button.dataset.route !== selected) select(button.dataset.route);
    });
  }
  const compare = document.querySelector("#compare-routes");
  compare.addEventListener("change", () => {
    map.toggleAttribute("data-compare", compare.checked);
    document.querySelector("#compare-legend").hidden = !compare.checked;
  });
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      animation?.cancel();
      settle?.cancel();
    }
  });

  const dialog = document.querySelector("#map-dialog");
  const expand = document.querySelector(".map-expand");
  const home = document.querySelector("#map-home");
  let previousOverflow;
  const viewport = document.querySelector("#dialog-map-host");
  const zoomIn = document.querySelector("#map-zoom-in");
  const zoomOut = document.querySelector("#map-zoom-out");
  let zoom = 1;
  let drag;
  let settle;
  function setZoom(next, center = false) {
    settle?.cancel();
    const before = zoom;
    zoom = Math.max(1, Math.min(3, next));
    const x = (viewport.scrollLeft + viewport.clientWidth / 2) / before;
    const y = (viewport.scrollTop + viewport.clientHeight / 2) / before;
    map.style.width = `${zoom * 100}%`;
    viewport.scrollTo({
      left: center
        ? (viewport.scrollWidth - viewport.clientWidth) / 2
        : x * zoom - viewport.clientWidth / 2,
      top: center
        ? (viewport.scrollHeight - viewport.clientHeight) / 2
        : y * zoom - viewport.clientHeight / 2,
      behavior: "instant",
    });
    document.querySelector("#map-zoom-level").textContent =
      `${Math.round(zoom * 100)}%`;
    zoomOut.disabled = zoom === 1;
    zoomIn.disabled = zoom === 3;
  }
  zoomIn.addEventListener("click", () => setZoom(zoom + 0.5));
  zoomOut.addEventListener("click", () => setZoom(zoom - 0.5));
  viewport.addEventListener("keydown", (event) => {
    if (
      event.target !== viewport ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey
    )
      return;
    const steps = {
      ArrowLeft: [-48, 0],
      ArrowRight: [48, 0],
      ArrowUp: [0, -48],
      ArrowDown: [0, 48],
    };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    viewport.scrollBy({ left: step[0], top: step[1], behavior: "instant" });
  });
  viewport.addEventListener("pointerdown", (event) => {
    // Touch keeps the browser's native, accessible two-axis scrolling.
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    settle?.cancel();
    drag = {
      x: event.clientX,
      y: event.clientY,
      left: viewport.scrollLeft,
      top: viewport.scrollTop,
    };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("dragging");
    event.preventDefault();
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const left = drag.left + drag.x - event.clientX;
    const top = drag.top + drag.y - event.clientY;
    viewport.scrollLeft = left;
    viewport.scrollTop = top;
    const rubber = (value) =>
      Math.sign(value) * 24 * (1 - Math.exp(-Math.abs(value) / 120));
    map.style.translate = `${rubber(viewport.scrollLeft - left)}px ${rubber(viewport.scrollTop - top)}px`;
  });
  function endDrag() {
    if (!drag) return;
    drag = null;
    viewport.classList.remove("dragging");
    const from = map.style.translate || "0px 0px";
    map.style.translate = "";
    if (!reduced.matches && map.animate)
      settle = map.animate([{ translate: from }, { translate: "0px 0px" }], {
        duration: 350,
        easing: "cubic-bezier(.2,.9,.3,1.1)",
      });
  }
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("lostpointercapture", endDrag);
  window.addEventListener("blur", endDrag);
  expand.addEventListener("click", () => {
    if (dialog.open) return;
    previousOverflow = document.documentElement.style.overflow;
    viewport.append(map);
    dialog.showModal();
    setZoom(innerWidth <= 540 ? 2 : 1.25, true);
    document.documentElement.style.overflow = "hidden";
    dialog.querySelector(".dialog-close").focus();
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    endDrag();
    settle?.cancel();
    map.style.width = "";
    map.style.translate = "";
    home.append(map);
    document.documentElement.style.overflow = previousOverflow || "";
    expand.focus({ preventScroll: true });
  });

  const images = [...map.querySelectorAll("img")];
  const error = document.querySelector(".map-error");
  const syncImageState = () => {
    const failed = images.some(
      (image) =>
        getComputedStyle(image).display !== "none" &&
        image.complete &&
        image.naturalWidth === 0,
    );
    error.hidden = !failed;
    expand.disabled = failed;
  };
  for (const image of images) {
    image.addEventListener("load", syncImageState);
    image.addEventListener("error", syncImageState);
  }
  new MutationObserver(syncImageState).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener(
    "change",
    syncImageState,
  );
  document.querySelector("#map-retry").addEventListener("click", () => {
    error.hidden = true;
    for (const image of images)
      if (!image.naturalWidth) {
        const url = new URL(image.src);
        url.searchParams.set("retry", Date.now());
        image.src = url.href;
      }
  });
  select(selected, false);
  syncImageState();
})();
