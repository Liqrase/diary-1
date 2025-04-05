document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a").forEach((link) => {
    const exceptionPrefix = "https://liqrase.github.io/";
    const exceptionPrefix2 = "https://www.liqrase.net/";
    if (
      link.hostname !== window.location.hostname &&
      (!link.href.startsWith(exceptionPrefix) && !link.href.startsWith(exceptionPrefix2))
    ) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
});
