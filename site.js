(() => {
  "use strict";
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
