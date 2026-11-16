(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-button");
  const themeOptions = document.querySelector(".theme-options");
  let transition;
  let fallbackTimer;
  const updateThemeButtons = () => {
    const current = root.dataset.theme || "system";
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.themeChoice === current),
      );
    });
  };
  const closeTheme = (restoreFocus = false) => {
    if (!themeOptions) return;
    themeOptions.hidden = true;
    themeButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) themeButton.focus();
  };
  themeButton?.addEventListener("click", () => {
    const open = themeOptions.hidden;
    themeOptions.hidden = !open;
    themeButton.setAttribute("aria-expanded", String(open));
    if (open) themeOptions.querySelector('[aria-pressed="true"]').focus();
  });
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const preference = button.dataset.themeChoice;
      closeTheme(true);
      const apply = () => {
        if (preference === "system") delete root.dataset.theme;
        else root.dataset.theme = preference;
        try {
          localStorage.setItem("osol-theme", preference);
        } catch {
          /* Optional. */
        }
        updateThemeButtons();
      };
      transition?.skipTransition();
      if (document.startViewTransition) {
        transition = document.startViewTransition(apply);
        transition.ready.catch(() => {});
      } else {
        clearTimeout(fallbackTimer);
        root.classList.add("theme-fallback");
        apply();
        fallbackTimer = setTimeout(
          () => root.classList.remove("theme-fallback"),
          300,
        );
      }
    });
  });
  updateThemeButtons();
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".theme-control")) closeTheme();
  });
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");
  const closeMenu = () => {
    if (!menuButton) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "메뉴 열기");
    delete navigation.dataset.open;
  };
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    navigation.dataset.open = String(open);
    closeTheme();
  });
  navigation
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  matchMedia("(min-width: 721px)").addEventListener("change", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (themeOptions && !themeOptions.hidden) closeTheme(true);
    if (menuButton?.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-shell")) closeMenu();
  });

  const screens = {
    route: [
      "경로 살피기",
      "Osol 경로 화면: 해안 크루저 프리셋과 지도 위 경로, 거리·예상 시간이 표시됩니다.",
    ],
    record: [
      "라이드 기록하기",
      "Osol 라이드 기록 화면: 기록 중 상태와 거리, 시간, 평균 속도, 일시정지와 저장 조작이 표시됩니다.",
    ],
    crew: [
      "크루와 준비하기",
      "Osol 크루 화면: 예시 초대 코드와 초대 링크 공유, 크루 채팅, 같이 달리기 조작이 표시됩니다.",
    ],
  };
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.screen;
      const preview = document.querySelector("#app-screen");
      preview.src = `assets/screens/${key}.png`;
      preview.alt = screens[key][1];
      document.querySelector("#screen-caption").textContent = screens[key][0];
      document
        .querySelectorAll("[data-screen]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
    });
  });

  // A bounded, illustrative explorer. It never asks for location or computes a route.
  const stage = document.querySelector("#route-explorer");
  if (stage) {
    const buttons = [...document.querySelectorAll("[data-preference]")];
    const descriptions = [
      "거리와 길의 성향을 함께 살펴요.",
      "해안의 경치를 더 즐기는 선택이에요.",
      "굽이가 덜한 길을 우선하는 예시예요.",
    ];
    let selected = 0;
    let animation;
    let offset = 0;
    let drag;
    const setOffset = (value) => {
      offset = value;
      stage.style.setProperty("--drag-x", `${value}px`);
    };
    const select = (index) => {
      selected = Math.max(0, Math.min(buttons.length - 1, index));
      buttons.forEach((button, i) =>
        button.setAttribute("aria-pressed", String(i === selected)),
      );
      document.querySelectorAll("[data-route]").forEach((path) => {
        path.classList.toggle(
          "inactive",
          Number(path.dataset.route) !== selected,
        );
      });
      document.querySelector("#route-description").textContent =
        descriptions[selected];
    };
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => select(index));
      button.addEventListener("keydown", (event) => {
        let next;
        if (event.key === "ArrowRight")
          next = Math.min(buttons.length - 1, selected + 1);
        if (event.key === "ArrowLeft") next = Math.max(0, selected - 1);
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(next);
        buttons[next].focus();
      });
    });
    const springHome = () => {
      cancelAnimationFrame(animation);
      if (reduced.matches) {
        setOffset(0);
        return;
      }
      let velocity = 0;
      let last = performance.now();
      const start = last;
      const omega = (2 * Math.PI) / 0.35;
      const damping = 0.8;
      const step = (now) => {
        const dt = Math.min((now - last) / 1000, 1 / 60);
        last = now;
        velocity +=
          (-omega * omega * offset - 2 * damping * omega * velocity) * dt;
        setOffset(offset + velocity * dt);
        if (
          (Math.abs(offset) < 0.1 && Math.abs(velocity) < 0.5) ||
          now - start > 1000
        ) {
          setOffset(0);
          return;
        }
        animation = requestAnimationFrame(step);
      };
      animation = requestAnimationFrame(step);
    };
    stage.addEventListener("pointerdown", (event) => {
      if (
        event.target.closest("button,a") ||
        !event.isPrimary ||
        event.button !== 0
      )
        return;
      cancelAnimationFrame(animation);
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        dx: 0,
        horizontal: false,
      };
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener("pointermove", (event) => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy))
        drag.horizontal = true;
      if (!drag.horizontal) return;
      drag.dx = dx;
      const edge =
        (selected === 0 && dx > 0) ||
        (selected === buttons.length - 1 && dx < 0);
      if (!reduced.matches) setOffset(edge ? dx / (1 + Math.abs(dx) / 65) : dx);
    });
    const endDrag = (event, cancelled) => {
      if (!drag || drag.id !== event.pointerId) return;
      const finished = drag;
      drag = undefined;
      if (stage.hasPointerCapture(event.pointerId))
        stage.releasePointerCapture(event.pointerId);
      if (!cancelled && finished.horizontal && Math.abs(finished.dx) > 45) {
        select(selected + (finished.dx < 0 ? 1 : -1));
      }
      springHome();
    };
    stage.addEventListener("pointerup", (event) => endDrag(event, false));
    stage.addEventListener("pointercancel", (event) => endDrag(event, true));
    stage.addEventListener("lostpointercapture", (event) =>
      endDrag(event, true),
    );
    reduced.addEventListener("change", () => {
      if (reduced.matches) {
        cancelAnimationFrame(animation);
        setOffset(0);
      }
    });
  }

  const search = document.querySelector("#faq-search");
  if (search) {
    const entries = [...document.querySelectorAll("details.faq")];
    const groups = [...document.querySelectorAll(".faq-group")];
    const normalize = (text) =>
      text
        .normalize("NFKC")
        .toLocaleLowerCase("ko")
        .replace(/\s+/g, " ")
        .trim();
    const filter = () => {
      const terms = normalize(search.value).split(" ").filter(Boolean);
      let count = 0;
      entries.forEach((entry) => {
        const match = terms.every((term) =>
          normalize(
            entry.textContent + " " + (entry.dataset.keywords || ""),
          ).includes(term),
        );
        entry.hidden = !match;
        if (match) count++;
        if (terms.length) entry.open = match;
        else entry.open = location.hash === `#${entry.id}`;
      });
      groups.forEach(
        (group) =>
          (group.hidden = ![...group.querySelectorAll("details.faq")].some(
            (entry) => !entry.hidden,
          )),
      );
      document.querySelector("#faq-count").textContent = terms.length
        ? `답변 ${count}개를 찾았어요.`
        : "궁금한 질문을 선택하면 답변이 열려요.";
      document.querySelector("#faq-empty").hidden = count !== 0;
      document.querySelector("#faq-clear").hidden = search.value.length === 0;
    };
    search.addEventListener("input", filter);
    document.querySelectorAll("[data-clear-search]").forEach((button) =>
      button.addEventListener("click", () => {
        search.value = "";
        filter();
        search.focus();
      }),
    );
    document.querySelectorAll(".help-aside a").forEach((link) =>
      link.addEventListener("click", () => {
        search.value = "";
        filter();
      }),
    );
    filter();
  }
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const field = document.getElementById(button.dataset.copy);
      const status = document.getElementById(`${button.dataset.copy}-status`);
      const value = field.value || field.textContent;
      try {
        await navigator.clipboard.writeText(value);
        status.textContent = "초대 코드를 복사했어요.";
      } catch {
        if (field.select) {
          field.focus();
          field.select();
        } else {
          const range = document.createRange();
          range.selectNodeContents(field);
          const selection = getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
        status.textContent = "복사하지 못했어요. 코드를 선택해 복사해 주세요.";
      }
    });
  });
})();
