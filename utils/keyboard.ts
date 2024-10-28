import { IconBackspace } from "@tabler/icons-react";
import type { Key } from "components/Key";

const className = "Game-keyboard-button-wide";
const backspace: Key = { className, key: "backspace", label: "Backspace", icon: IconBackspace };
const enter: Key = { className, key: "enter", label: "Enter" };

const keysRow1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const keysRow2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", { className: "", key: "ñ", label: "ñ", locale: "es" }];
const keysRow3: Array<string | Key> = [backspace, "z", "x", "c", "v", "b", "n", "m", enter];

export const keyboard = [keysRow1, keysRow2, keysRow3];
