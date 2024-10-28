import { checkWord } from "utils/check-word";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { animateKey } from "utils/animate-key";
import { letterSelector, setGameIs } from "store/appSlice";

export interface LetterRowProps extends React.HTMLProps<HTMLDivElement> {
  rowId: number;
  keys: string[];
}

export function LetterRow({ rowId, keys, ...props }: LetterRowProps) {
  const dispatch = useAppDispatch();
  const { currentRow, word, words, numberOfLetters, numberOfAttempts } =
    useAppSelector(letterSelector);
  const shouldCheck = rowId === currentRow - 1;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const letters = ref.current?.childNodes as NodeListOf<Element>;
    letters?.forEach((element, i) => {
      const key = keys?.[i];
      element.classList[key ? "add" : "remove"]("selected");
      element.setAttribute("data-animation", key ? "pop" : "none");
    });
  }, [rowId, keys]);

  useEffect(() => {
    if (!shouldCheck) return;
    const check = checkWord(word, keys.join(""), words);
    if (!check.exists) return;

    const letters = ref.current?.childNodes as NodeListOf<Element>;

    const didPlayerWin = check.keys.every((k) => k.class === "letter-correct");
    const time = 300;

    letters?.forEach((element, i) => {
      if (!element) return;
      setTimeout(
        () => animateKey({ element, className: check.keys[i].class, time }),
        time * i,
      );
    });

    setTimeout(
      () => {
        check.keys.forEach((item) => {
          const keyboardRow = document.querySelector(
            `.Game-keyboard-button[data-key="${item.key.toLowerCase()}"]`,
          );
          if (!keyboardRow) return;

          const contains = (token: string) =>
            keyboardRow.classList.contains(token);
          if (contains("letter-correct")) return;
          if (contains(item.class)) return;
          if (contains("letter-elsewhere") && item.class !== "letter-correct")
            return;

          animateKey({ element: keyboardRow, className: item.class, time });
        });

        if (didPlayerWin) return dispatch(setGameIs("won"));
        if (rowId === numberOfAttempts - 1) dispatch(setGameIs("lost"));
      },
      time * letters.length + 1,
    );
  }, [shouldCheck, keys, word, dispatch, rowId, words, numberOfAttempts]);

  return (
    <div className="Row" ref={ref} {...props}>
      {[...Array(numberOfLetters)].map((_, i) => (
        <div key={i} className="Row-letter" data-animation="none">
          {keys?.[i] ?? ""}
        </div>
      ))}
    </div>
  );
}
