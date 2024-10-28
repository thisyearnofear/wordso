import { setCookie } from "cookies-next";
import { useTranslation } from "hooks/use-translations";
import { useRouter } from "next/router";
import {
  setSettings,
  setSettingsActive,
  settingsSelector,
} from "store/appSlice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  NUMBERS_OF_ATTEMPTS,
  NUMBERS_OF_LETTERS,
  NUMBER_OF_ATTEMPTS_KEY,
  NUMBER_OF_LETTERS_KEY,
} from "utils/numbers-of-letters";
import { Modal } from "./Game/Modal";

export function Settings() {
  const router = useRouter();
  const translation = useTranslation();
  const dispatch = useAppDispatch();
  const {
    isSettingsActive,
    numberOfLetters,
    numberOfAttempts,
    isChallengeMode,
  } = useAppSelector(settingsSelector);

  return (
    <Modal
      title={translation.settings}
      titleClass="lost"
      className="settings"
      active={isSettingsActive}
      onClose={() => dispatch(setSettingsActive(false))}
    >
      <div className="desc" style={{ color: "#fff", fontWeight: 600 }}>
        {translation.number_of_letters_title}
      </div>
      <div className="desc" style={{ maxWidth: 350 }}>
        {translation.number_of_letters_description}
      </div>
      <div className="numbers flex">
        {NUMBERS_OF_LETTERS.map((value) => (
          <div key={value} className="number_checkbox">
            <label className="label_check">
              <input
                type="radio"
                name="numbers"
                onChange={() => {
                  if (isChallengeMode) void router.replace("/");

                  setCookie(NUMBER_OF_LETTERS_KEY, value.toString());
                  dispatch(setSettings({ numberOfLetters: value }));
                  dispatch(setSettingsActive(false));
                }}
                autoComplete="off"
                value={value}
                checked={value === numberOfLetters}
              />
              <span className="check_text">{value}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="desc" style={{ color: "#fff", fontWeight: 600 }}>
        {translation.number_of_attempts_title}
      </div>
      <div className="desc" style={{ maxWidth: 350 }}>
        {translation.number_of_attempts_description}
      </div>
      <div className="numbers flex">
        {NUMBERS_OF_ATTEMPTS.map((value) => (
          <div key={value} className="number_checkbox">
            <label className="label_check">
              <input
                type="radio"
                name="attempts"
                onChange={() => {
                  setCookie(NUMBER_OF_ATTEMPTS_KEY, value.toString());
                  dispatch(setSettings({ numberOfAttempts: value }));
                  dispatch(setSettingsActive(false));
                }}
                autoComplete="off"
                value={value}
                checked={value === numberOfAttempts}
              />
              <span className="check_text">{value}</span>
            </label>
          </div>
        ))}
      </div>
    </Modal>
  );
}
