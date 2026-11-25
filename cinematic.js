(() => {
  "use strict";
  const film = document.querySelector(".film");
  if (!film) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const title = film.querySelector("[data-film-title]");
  const copy = film.querySelector("[data-film-copy]");
  const phase = film.querySelector("[data-film-phase]");
  const choices = [...film.querySelectorAll("[data-film-route]")];
  const routeButtons = [
    ...document.querySelectorAll("#route-experience [data-route]"),
  ];
  function sync(id) {
    for (const button of choices)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filmRoute === id),
      );
    for (const path of film.querySelectorAll("[data-path]"))
      path.classList.toggle("selected", path.dataset.path === id);
    film.querySelector(".film-app-summary strong").innerHTML =
      id === "balanced"
        ? "14.8 <small>km</small><span>약 17분</span>"
        : "16.8 <small>km</small><span>약 20분</span>";
    film.querySelector("[data-film-result]").textContent =
      id === "balanced"
        ? "경치·한적함·편안함을 고르게"
        : "경치와 한적함에 더 비중을 둔 길";
  }
  for (const button of choices)
    button.addEventListener("click", () => {
      document
        .querySelector(
          `#route-experience [data-route="${button.dataset.filmRoute}"]`,
        )
        .click();
      sync(button.dataset.filmRoute);
    });
  for (const button of routeButtons)
    button.addEventListener("click", () => sync(button.dataset.route));
  let frame = 0,
    previous = -1;
  function update() {
    frame = 0;
    const rect = film.getBoundingClientRect();
    const progress = reduced.matches
      ? 1
      : Math.min(
          1,
          Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight)),
        );
    film.style.setProperty("--film-progress", progress.toFixed(4));
    film.querySelector(".film-app-summary").inert = progress < 0.9;
    film.querySelector(".film-app-head").inert = progress < 0.9;
    const step = progress < 0.45 ? 0 : 1;
    if (step === previous) return;
    const changed = previous !== -1;
    previous = step;
    if (changed && !reduced.matches) {
      title.getAnimations().forEach((animation) => animation.cancel());
      title.animate(
        [{ transform: "translateY(18px)" }, { transform: "translateY(0)" }],
        { duration: 450, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
    }
    title.innerHTML = step
      ? "그 길을,<br>내 화면으로."
      : "도착보다 먼저.<br>마음이 가는 길.";
    copy.innerHTML = step
      ? "지도로 살펴보고, 취향으로 고르고.<br>아래에서 두 실제 경로를 직접 비교해보세요."
      : "부산 미포에서 일광까지.<br>같은 목적지에도, 다른 라이딩이 있어요.";
    phase.textContent = step ? "내 방식으로 준비하고" : "길을 만나고";
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  reduced.addEventListener("change", schedule);
  update();
})();
