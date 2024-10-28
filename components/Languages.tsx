import Link from "next/link";
import { useTranslation } from "hooks/use-translations";
import { useRouter } from "next/router";
import { setLanguagesActive } from "store/appSlice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { EnglishUSFlag, SpanishFlag, KenyanFlag } from "./flags";
import { Modal } from "./Game/Modal";

const langs = [
  { locale: "en", label: "English (US)", icon: EnglishUSFlag },
  { locale: "es", label: "Español", icon: SpanishFlag },
  { locale: "sw", label: "Kiswahili", icon: KenyanFlag },
];

export function Languages() {
  const router = useRouter();
  const translation = useTranslation();
  const dispatch = useAppDispatch();
  const isLanguagesActive = useAppSelector((state) => state.isLanguagesActive);

  return (
    <Modal
      title={translation.dictionary}
      className="settings"
      titleClass="lost"
      active={isLanguagesActive}
      onClose={() => dispatch(setLanguagesActive(false))}
    >
      <div className="desc" style={{ color: "#fff", fontWeight: 600 }}>
        {translation.select_dictionary}
      </div>
      <div className="desc" style={{ maxWidth: 350 }}>
        {translation.select_a_game_dictionary}
      </div>
      <div className="languages flex">
        {langs.map((lang) => (
          <Link
            key={lang.locale}
            locale={lang.locale}
            href="/"
            className={`lang_checkbox${router.locale === lang.locale ? " lang_checkbox_selected" : ""}`}
            rel="noreferrer"
          >
            <label className="label_check">
              <span className="check_text">
                <span className="icon">{<lang.icon />}</span>
                {lang.label}
              </span>
            </label>
          </Link>
        ))}
      </div>
    </Modal>
  );
}
