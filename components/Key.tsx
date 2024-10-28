import type { Icon } from "@tabler/icons-react";
import { useGame } from "hooks/use-game";
import { useLocale } from "hooks/use-locale";

export interface Key {
  key: string;
  className: string;
  label: string;
  locale?: string;
  icon?: React.FC<React.ComponentPropsWithoutRef<Icon>>;
}

export interface KeyRowProps extends React.HTMLProps<HTMLDivElement> {
  keys: Array<string | Key>;
}

export function KeyboardRow({ keys }: KeyRowProps) {
  const { locale } = useLocale();
  const { addNewKey, deleteLastLetter, passToNextRow } = useGame();

  return (
    <div className="Game-keyboard-row">
      {keys.map((item) => {
        const isString = typeof item === "string";

        return (
          <button
            key={isString ? item : item.key}
            hidden={
              isString
                ? undefined
                : locale === item.locale
                  ? undefined
                  : item.locale != null
            }
            className={`Game-keyboard-button ${isString ? "" : item.className}`}
            onClick={() => {
              const key = (isString ? item : item.key).toLowerCase();
              if (key === "enter") return passToNextRow();
              if (key === "backspace") return deleteLastLetter();
              addNewKey(key);
            }}
            data-key={isString ? item : item.key}
          >
            {isString ? item : item.icon ? <item.icon size={22} /> : item.label}
          </button>
        );
      })}
    </div>
  );
}
