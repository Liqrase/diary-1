document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a").forEach((link) => {
    const exceptionPrefix = "https://liqrase.github.io/";
    if (
      link.hostname !== window.location.hostname &&
      !link.href.startsWith(exceptionPrefix)
    ) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
});
