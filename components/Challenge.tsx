import { useLocale } from "hooks/use-locale";
import { useTranslation } from "hooks/use-translations";
import { encode } from "js-base64";
import { useRef, useState } from "react";
import { challengeSelector, setChallengeActive } from "store/appSlice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getChallengeModeWord } from "utils/store";
import { Modal } from "./Game/Modal";

export function Challenge() {
  const { locale } = useLocale();
  const translation = useTranslation();
  const dispatch = useAppDispatch();
  const { isChallengeActive, words } = useAppSelector(challengeSelector);
  const [value, setValue] = useState("");
  const validRef = useRef<HTMLDivElement>(null);
  const invalidRef = useRef<HTMLDivElement>(null);

  return (
    <Modal
      title={translation.wordle_generator_title}
      titleClass="lost"
      active={isChallengeActive}
      onClose={() => dispatch(setChallengeActive(false))}
    >
      <div className="cont">
        <div className="desc">{translation.wordle_generator_description}</div>
        <div className="line_form">
          <div className="field">
            <input
              type="text"
              name="input"
              className="input"
              placeholder={translation.placeholder_your_word}
              minLength={4}
              maxLength={11}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
        <div ref={validRef} className="desc valid" style={{ display: "none" }}>
          {translation.link_copied}
        </div>
        <div ref={invalidRef} className="desc not_valid" style={{ display: "none" }}>
          {translation.not_a_valid_word}
        </div>
        <div className="copy_btn">
          <button
            type="button"
            aria-label={translation.button_copy_link_to_this_word}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              if (!validRef.current || !invalidRef.current) return;
              const animate = (e: HTMLDivElement) => {
                e.style.display = "block";
                setTimeout(() => (e.style.display = "none"), 3000);
              };
              const create = async (word: string) => {
                const data = getChallengeModeWord(words, encode(word.toLowerCase()));
                if (!data.exist) return false;

                const encodedWord = data.encodedWord.replace(/=+$/g, "");

                const link = `${(process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "")}/${
                  locale === "en" ? "" : locale
                }?challenge=${encodedWord}`;

                try {
                  await navigator.clipboard.writeText(link);
                } catch {
                  return false;
                }

                return link;
              };

              if (value.length < 4 || value.length > 11) return animate(invalidRef.current);
              const link = await create(value);
              if (!link) return animate(invalidRef.current);
              animate(validRef.current);
            }}
          >
            {translation.button_copy_link}
          </button>
        </div>
      </div>
    </Modal>
  );
}
