document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".highlight").forEach((codeBlock) => {
      const button = document.createElement("button");
      button.className = "copy-btn";
      button.innerText = "Copy";

      button.addEventListener("click", function () {
          const code = codeBlock.querySelector("pre").innerText;
          navigator.clipboard.writeText(code).then(() => {
              button.innerText = "Copied!";
              setTimeout(() => {
                  button.innerText = "Copy";
              }, 2000);
          }).catch(err => console.error("Failed to copy text", err));
      });

      codeBlock.style.position = "relative"; // ボタンを適切に配置するため
      codeBlock.appendChild(button);
  });
});
