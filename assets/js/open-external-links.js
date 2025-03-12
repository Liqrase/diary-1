document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a").forEach((link) => {
      const targetUrl = "https://liqrase.github.io/cafe/"; // 例外として現在のタブで開くURL

      if (link.hostname !== window.location.hostname && link.href !== targetUrl) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
      }
  });
});
