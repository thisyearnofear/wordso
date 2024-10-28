interface Options {
  element: Element;
  className: string;
  time: number;
}

export function animateKey({ element, className, time }: Options) {
  element.classList.remove("letter-correct", "letter-elsewhere", "letter-absent", "selected");
  element.classList.add(className);
  element.setAttribute("data-animation", "flip-in");
  setTimeout(() => element.setAttribute("data-animation", "flip-out"), time / 2);
}
