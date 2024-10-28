import { useRouter } from "next/router";
import { IconCirclePlus, IconSettings, IconMoon, IconSun, IconRefresh } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { setCookie } from "cookies-next";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  headerSelector,
  restartGame,
  setChallengeActive,
  setGameIs,
  setIsChallengeMode,
  setLanguagesActive,
  setSettingsActive,
} from "store/appSlice";
import { useLocale } from "hooks/use-locale";
import { useTranslation } from "hooks/use-translations";
import { EnglishUSFlag, SpanishFlag } from "./flags";

export function Header({ colorScheme }: { colorScheme: "light" | "dark" }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { locale } = useLocale();
  const translation = useTranslation();

  const [theme, setTheme] = useState<"dark" | "light">(colorScheme);

  const { gameIs, startPlaying, isChallengeMode } = useAppSelector(headerSelector);

  const toggleColorTheme = useCallback(() => {
    setTheme((theme) => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setCookie("preferred-color-theme", newTheme);
      document.documentElement.classList.toggle("dark");
      return newTheme;
    });
  }, []);

  return (
    <header>
      <div className="cont flex">
        <button className="lang" onClick={() => dispatch(setLanguagesActive(true))}>
          <span className="icon">{locale === "en" ? <EnglishUSFlag /> : <SpanishFlag />}</span>
          {locale.toUpperCase()}
        </button>
        <button
          type="button"
          className="generator"
          style={{ display: "block" }}
          onClick={() => dispatch(setChallengeActive(true))}
          aria-label={translation.wordle_generator_title}
        >
          <IconCirclePlus width="20" height="20" />
        </button>
        {startPlaying && (
          <button
            type="button"
            className="generator restart_btn"
            style={{ display: "block" }}
            onClick={() => {
              if (gameIs === "playing") {
                return dispatch(setGameIs("lost"));
              }

              if (isChallengeMode) {
                dispatch(setIsChallengeMode(false));
                void router.replace("/");
              }

              dispatch(restartGame());
            }}
            aria-label={gameIs === "playing" ? translation.give_up : translation.restart}
          >
            {gameIs === "playing" ? (
              <span className="give-up">{translation.give_up}</span>
            ) : (
              <IconRefresh width="20" height="20" />
            )}
          </button>
        )}
        <div className="buttons flex">
          <button
            type="button"
            className="button"
            aria-label={translation.settings}
            onClick={() => dispatch(setSettingsActive(true))}
          >
            <IconSettings size={22} />
          </button>
          <button
            type="button"
            className="button"
            onClick={() => toggleColorTheme()}
            aria-label={translation.dark_mode_description}
          >
            {theme === "dark" ? <IconMoon size={22} /> : <IconSun size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
