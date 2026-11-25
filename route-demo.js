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
    },
    scenic: {
      label: "경치에 더 비중을",
      distance: "16.8",
      minutes: "20",
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
      active.parentElement.querySelector(".ride-trail"),
    );
    if (animate && !reduced.matches && active.animate) {
      animation = active.animate([{ opacity: 0.25 }, { opacity: 1 }], {
        duration: 320,
        easing: "ease-out",
      });
    }
    document.querySelector("#map-key").textContent = example.label;
    map.setAttribute(
      "aria-label",
      `미포에서 일광까지. ${example.label} 경로, ${example.distance}km, 약 ${example.minutes}분.`,
    );
    pauseRide();
    paintRide();
    document.querySelector("#dialog-route-label").textContent =
      `${example.label} · ${example.distance}km · 약 ${example.minutes}분`;
  }
  let ride;
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
    pauseRide();
    previousOverflow = document.documentElement.style.overflow;
    viewport.append(map);
    dialog.showModal();
    syncCreditTimer();
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
    syncCreditTimer();
    settle?.cancel();
    map.style.width = "";
    map.style.translate = "";
    home.append(map);
    document.documentElement.style.overflow = previousOverflow || "";
    expand.focus({ preventScroll: true });
  });

  // One readable foreground exposure per page load, not per map or dialog.
  const credits = [...document.querySelectorAll("[data-map-credit]")];
  const visibleCredits = new Set();
  let creditsCollapsed = false;
  let creditTimer;
  function syncCreditTimer() {
    const readable =
      !document.hidden &&
      [...visibleCredits].some(
        (node) => !dialog.open || node.closest("dialog") === dialog,
      );
    if (!readable || creditsCollapsed) {
      clearTimeout(creditTimer);
      creditTimer = null;
      return;
    }
    creditTimer ??= setTimeout(() => {
      creditsCollapsed = true;
      credits.forEach((node) => {
        node.hidden = true;
      });
      creditTimer = null;
    }, 5000);
  }
  const creditObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 1) visibleCredits.add(entry.target);
        else visibleCredits.delete(entry.target);
      });
      syncCreditTimer();
    },
    { threshold: 1 },
  );
  credits.forEach((node) => creditObserver.observe(node));
  document.addEventListener("visibilitychange", syncCreditTimer);

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
    play.disabled = failed || Boolean(loading);
    if (failed) pauseRide();
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
  const play = document.querySelector("#ride-play");
  const progress = document.querySelector("#ride-progress");
  const previous = document.querySelector("#ride-previous");
  const next = document.querySelector("#ride-next");
  const reset = document.querySelector("#ride-reset");
  const status = document.querySelector("#ride-status");
  const instruction = document.querySelector("#ride-instruction");
  const remaining = document.querySelector("#ride-remaining");
  const feedback = document.querySelector("#ride-feedback");
  const direction = document.querySelector(".ride-direction");
  const enter = document.querySelector("#ride-enter");
  const exit = document.querySelector("#ride-exit");
  const consolePanel = experience.querySelector(".route-console");
  const endpoints = experience.querySelector(".route-endpoints");
  const rideControls = experience.querySelector(".ride-controls");
  const trail = map.querySelector(".ride-trail");
  const marker = map.querySelector(".ride-position");
  const positions = { balanced: 0, scenic: 0 };
  let playing = false;
  let loading;
  let frame;
  let lastTick;
  let visible = false;
  function setMode(mode, focus = true) {
    pauseRide();
    experience.dataset.mode = mode;
    const guiding = mode === "guidance";
    consolePanel.hidden = guiding;
    endpoints.hidden = guiding;
    rideControls.hidden = !guiding;
    exit.hidden = !guiding;
    updateMapInsets();
    if (focus) (guiding ? exit : enter).focus({ preventScroll: true });
  }
  function updateMapInsets() {
    const panel =
      experience.dataset.mode === "guidance"
        ? experience.querySelector(".ride-bottom")
        : consolePanel;
    experience.style.setProperty(
      "--sheet-space",
      `${Math.ceil(panel.getBoundingClientRect().height) + 24}px`,
    );
    const heading = experience.querySelector(".ride-heading");
    const mapTop =
      experience.dataset.mode === "guidance"
        ? heading.offsetTop + heading.getBoundingClientRect().height + 16
        : endpoints.offsetTop + endpoints.getBoundingClientRect().height + 16;
    experience.style.setProperty("--map-top", `${Math.ceil(mapTop)}px`);
  }
  const sheetObserver = new ResizeObserver(updateMapInsets);
  sheetObserver.observe(consolePanel);
  sheetObserver.observe(experience.querySelector(".ride-bottom"));
  sheetObserver.observe(experience.querySelector(".ride-heading"));
  sheetObserver.observe(endpoints);
  enter.addEventListener("click", async () => {
    setMode("guidance");
    await loadRide();
    if (experience.dataset.mode === "guidance" && !play.disabled)
      play.focus({ preventScroll: true });
  });
  exit.addEventListener("click", () => setMode("choose"));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !dialog.open &&
      (experience.contains(document.activeElement) ||
        document.activeElement === document.body) &&
      experience.dataset.mode === "guidance"
    ) {
      event.preventDefault();
      setMode("choose");
    }
  });

  const metres = (value) =>
    value < 1000 ? `${Math.round(value)} m` : `${(value / 1000).toFixed(1)} km`;
  const radians = (degrees) => (degrees * Math.PI) / 180;
  function geographicDistance(a, b) {
    const dlat = radians(b[1] - a[1]);
    const dlon = radians(b[0] - a[0]);
    const h =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(radians(a[1])) *
        Math.cos(radians(b[1])) *
        Math.sin(dlon / 2) ** 2;
    return 12742000 * Math.asin(Math.sqrt(Math.min(1, h)));
  }
  async function loadRide() {
    if (ride) return true;
    if (loading) return loading;
    play.disabled = true;
    play.textContent = "안내 불러오는 중";
    loading = (async () => {
      try {
        const response = await fetch("assets/maps/comparison/source.json", {
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("route unavailable");
        const source = await response.json();
        const prepared = {};
        for (const id of Object.keys(examples)) {
          const route = source.find((item) => item.id === id)?.response
            .routes[0];
          const coordinates = route?.geometry?.coordinates;
          const path = paths.find((path) => path.dataset.path === id);
          const points = path
            .getAttribute("d")
            .match(/-?\d+(?:\.\d+)?/g)
            .map(Number);
          if (
            !coordinates?.length ||
            points.length !== coordinates.length * 2 ||
            points.some((point) => !Number.isFinite(point)) ||
            coordinates.some(
              (point) =>
                point.length !== 2 || point.some((v) => !Number.isFinite(v)),
            ) ||
            !(route.distance_m > 0) ||
            !route.instructions?.length
          ) {
            throw new Error("route incomplete");
          }
          const distances = [0];
          coordinates.slice(1).forEach((point, i) => {
            distances.push(
              distances[i] + geographicDistance(coordinates[i], point),
            );
          });
          const total = distances.at(-1);
          if (!(total > 0)) throw new Error("empty route");
          const steps = route.instructions.map((step) => {
            const start = step.interval[0];
            if (
              !Number.isInteger(start) ||
              start < 0 ||
              start >= coordinates.length ||
              typeof step.text !== "string"
            )
              throw new Error("invalid instruction");
            return { ...step, fraction: distances[start] / total };
          });
          prepared[id] = { route, points, distances, total, steps };
        }
        ride = prepared;
        paintRide();
        return true;
      } catch {
        ride = undefined;
        status.textContent = "안내를 불러오지 못했어요";
        instruction.textContent = "다시 눌러 불러올 수 있어요.";
        feedback.textContent = "안내를 불러오지 못했어요. 다시 시도해 주세요.";
        play.textContent = "안내 다시 불러오기";
        return false;
      } finally {
        loading = null;
        play.disabled = !error.hidden;
      }
    })();
    return loading;
  }
  function currentStep() {
    const model = ride[selected];
    let index = 0;
    model.steps.forEach((step, i) => {
      if (step.fraction <= positions[selected] + 0.000001) index = i;
    });
    return index;
  }
  function paintRide() {
    const fraction = positions[selected];
    const arrived = fraction >= 1;
    remaining.textContent = metres(
      (ride?.[selected].route.distance_m ||
        Number(examples[selected].distance) * 1000) *
        (1 - fraction),
    );
    const seconds =
      (ride?.[selected].route.duration_s ||
        Number(examples[selected].minutes) * 60) *
      (1 - fraction);
    document.querySelector("#ride-duration").textContent = arrived
      ? "도착"
      : `약 ${Math.max(1, Math.round(seconds / 60))}분`;
    progress.value = String(Math.round(fraction * 1000));
    play.textContent = reduced.matches
      ? "안내 살펴보기"
      : playing
        ? "일시정지"
        : arrived
          ? "다시 재생"
          : fraction > 0
            ? "이어서 재생"
            : "안내 재생";
    if (!ride) return;
    const model = ride[selected];
    const step =
      model.steps[Math.min(currentStep() + 1, model.steps.length - 1)];
    status.textContent = arrived
      ? "일광해수욕장 도착"
      : playing
        ? "안내 재생 중"
        : "주행 미리보기";
    instruction.textContent = arrived ? "안내를 마쳤어요." : step.text;
    document.querySelector("#ride-turn-distance").textContent = metres(
      Math.max(0, (step.fraction - fraction) * model.route.distance_m),
    );
    const sign = Math.abs(step.sign);
    const turnPaths = {
      0: "M12 20V4m-6 6 6-6 6 6",
      1: "M7 20v-6a5 5 0 0 1 2-4l9-7m-7 0h7v7",
      2: "M6 20V9a3 3 0 0 1 3-3h11m-5-5 5 5-5 5",
      3: "M6 20V7a3 3 0 0 1 5-2l8 8m-7 0h7V6",
      4: "M5 21V3m0 0h13l-3 4 3 4H5",
      6: "M8 19a7 7 0 1 1 10-9m-4-1h5V4M8 19v-5",
      7: "M12 21v-9m0 0 7-8m-6 0h6v6M12 12 5 4",
    };
    direction
      .querySelector("path")
      .setAttribute("d", turnPaths[sign] || "M5 12h14");
    direction.dataset.turn = step.sign < 0 ? "left" : "right";
    progress.disabled = false;
    previous.disabled = fraction === 0;
    next.disabled = arrived;
    reset.disabled = fraction === 0;
    progress.setAttribute(
      "aria-valuetext",
      `${Math.round(fraction * 100)}%, ${arrived ? "도착" : step.text}, 남은 거리 ${remaining.textContent}`,
    );
    const target = fraction * model.total;
    let end = model.distances.findIndex((distance) => distance > target);
    if (end < 0) end = model.distances.length - 1;
    const start = Math.max(0, end - 1);
    const segment = model.distances[end] - model.distances[start];
    const offset = segment ? (target - model.distances[start]) / segment : 0;
    const x =
      model.points[start * 2] +
      (model.points[end * 2] - model.points[start * 2]) * offset;
    const y =
      model.points[start * 2 + 1] +
      (model.points[end * 2 + 1] - model.points[start * 2 + 1]) * offset;
    marker.setAttribute("transform", `translate(${x} ${y})`);
    marker.removeAttribute("hidden");
    // A prefix of the original registered coordinates, ending exactly at the marker.
    const travelled = [];
    for (let i = 0; i <= start; i++)
      travelled.push(`${model.points[i * 2]},${model.points[i * 2 + 1]}`);
    trail.setAttribute("d", `M${travelled.join(" L")} L${x},${y}`);
    trail.removeAttribute("hidden");
  }
  function pauseRide() {
    playing = false;
    cancelAnimationFrame(frame);
    lastTick = null;
    if (ride) paintRide();
  }
  function tick(now) {
    if (!playing) return;
    if (lastTick !== null)
      positions[selected] = Math.min(
        1,
        positions[selected] + Math.min(now - lastTick, 100) / 45000,
      );
    lastTick = now;
    paintRide();
    if (positions[selected] >= 1) {
      pauseRide();
      feedback.textContent = "일광해수욕장에 도착했어요.";
    } else frame = requestAnimationFrame(tick);
  }
  play.addEventListener("click", async () => {
    if (playing) {
      pauseRide();
      return;
    }
    if (!(await loadRide())) return;
    if (document.hidden || !visible || !error.hidden) return;
    if (reduced.matches) {
      feedback.textContent =
        "이전 안내와 다음 안내, 경로 진행으로 길을 살펴보세요.";
      progress.focus();
      return;
    }
    if (positions[selected] >= 1) positions[selected] = 0;
    playing = true;
    lastTick = null;
    paintRide();
    frame = requestAnimationFrame(tick);
  });
  progress.addEventListener("input", () => {
    const value = Number(progress.value);
    pauseRide();
    positions[selected] = value / 1000;
    paintRide();
  });
  function stepRide(forward) {
    pauseRide();
    const steps = ride[selected].steps;
    const fraction = positions[selected];
    const candidates = steps.map((step) => step.fraction);
    positions[selected] = forward
      ? (candidates.find((value) => value > fraction + 0.000001) ?? 1)
      : (candidates.filter((value) => value < fraction - 0.000001).at(-1) ?? 0);
    paintRide();
    feedback.textContent = instruction.textContent;
  }
  previous.addEventListener("click", () => stepRide(false));
  next.addEventListener("click", () => stepRide(true));
  reset.addEventListener("click", () => {
    pauseRide();
    positions[selected] = 0;
    paintRide();
    feedback.textContent = "출발 지점으로 돌아왔어요.";
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseRide();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) pauseRide();
  }).observe(experience.querySelector(".ride-bottom"));
  reduced.addEventListener("change", () => {
    pauseRide();
    paintRide();
  });
  select(selected, false);
  paintRide();
  syncImageState();
  experience.classList.add("is-app");
  setMode("choose", false);
})();
