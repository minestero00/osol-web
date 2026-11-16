/* Read before paint; storage is optional and contains only a display preference. */
(() => {
  document.documentElement.classList.remove("no-js");
  try {
    const preference = localStorage.getItem("osol-theme");
    if (preference === "light" || preference === "dark") {
      document.documentElement.dataset.theme = preference;
    }
  } catch {
    /* Private browsing and blocked storage still follow the OS. */
  }
})();
