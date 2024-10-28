import dynamic from "next/dynamic";
import { decodeWord } from "utils/check-word";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { restartGame, setIsChallengeMode, stateSelector } from "store/appSlice";
import { Modal } from "./Modal";
import { getCookie } from "cookies-next";
import {
  DEFAULT_NUMBER_OF_LETTERS,
  getNumberFromCookie,
  NUMBER_OF_LETTERS_KEY,
} from "utils/numbers-of-letters";
import { useRouter } from "next/router";
import { useTranslation } from "hooks/use-translations";

const Confetti = dynamic(() => import("../Confetti").then((m) => m.Confetti), {
  ssr: false,
});

export function GameState() {
  const router = useRouter();
  const translation = useTranslation();
  const dispatch = useAppDispatch();
  const { gameIs, word, isChallengeMode } = useAppSelector(stateSelector);
  const wordToGuess = decodeWord(word);

  const getDefinitionUrl = (word: string) => {
    if (router.locale === "sw") {
      return `https://swahili-dictionary.com/swahili-english/${word}_${word}`;
    }
    return `https://wordlegame.org/dictionary?q=${word}+definition`;
  };

  return (
    <Modal
      active={gameIs !== "playing"}
      title={
        gameIs === "won" ? translation.tip_you_win : translation.tip_you_lost
      }
      titleClass={gameIs}
    >
      <div className="cont">
        <div className="desc">{translation.the_answer_was}</div>
        <div className="word">
          <span>{gameIs !== "playing" && wordToGuess}</span>
        </div>
        {gameIs !== "playing" && (
          <a
            className="definition"
            target="_blank"
            rel="noreferrer"
            href={getDefinitionUrl(wordToGuess)}
          >
            {translation.what_does_it_mean}
          </a>
        )}
        <div className="restart_btn">
          <button
            type="button"
            onClick={() => {
              if (isChallengeMode) {
                void router.replace("/");
                dispatch(setIsChallengeMode(false));
              }

              const numberOfLettersCookie = getCookie(NUMBER_OF_LETTERS_KEY);
              const numberOfLetters = getNumberFromCookie(
                numberOfLettersCookie,
                DEFAULT_NUMBER_OF_LETTERS,
              );

              dispatch(restartGame(numberOfLetters));
            }}
          >
            {isChallengeMode ? translation.new_game : translation.restart}
          </button>
        </div>
      </div>
      {gameIs === "won" && <Confetti />}
    </Modal>
  );
}
