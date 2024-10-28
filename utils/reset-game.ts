export function resetGame() {
  const remover = (key: Element) => {
    key.setAttribute("data-animation", "none");
    key.classList.remove("letter-correct", "letter-elsewhere", "letter-absent", "selected");
  };
  document.querySelectorAll(".Game-keyboard-button").forEach(remover);
  document.querySelectorAll(".Row-letter").forEach(remover);
}
