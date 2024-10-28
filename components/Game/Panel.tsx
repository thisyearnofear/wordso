import { keyboard } from "utils/keyboard";
import { KeyboardRow } from "components/Key";
import { LetterRow } from "components/Letter";
import { useAppSelector } from "store/hooks";
import { panelSelector } from "store/appSlice";
import { useTranslation } from "hooks/use-translations";

export function GamePanel() {
  const translation = useTranslation();

  const { gameIs, keys, modal, numberOfAttempts, isChallengeMode } = useAppSelector(panelSelector);

  return (
    <>
      <div className="Game-Rows">
        {[...Array(numberOfAttempts)].map((_, i) => {
          const key = i;
          return <LetterRow rowId={i} keys={keys[key]} key={i} />;
        })}
      </div>
      {gameIs === "playing" && isChallengeMode && (
        <div className="message">
          <b>{translation.tip_challenge}</b>
        </div>
      )}
      {gameIs !== "playing" && (
        <div className="message">
          <b>{gameIs === "won" ? translation.tip_you_win : translation.tip_you_lost}</b>
        </div>
      )}
      <div className="Game-keyboard">
        {keyboard.map((keys, i) => (
          <KeyboardRow key={i} keys={keys} />
        ))}
      </div>
      {modal.isOpen && gameIs === "playing" && (
        <div className="alert" style={{ display: "block" }}>
          {modal.content}
        </div>
      )}
    </>
  );
}
