import type { PayloadAction } from "@reduxjs/toolkit";
import { decode, encode } from "js-base64";
import { DEFAULT_NUMBER_OF_ATTEMPTS, DEFAULT_NUMBER_OF_LETTERS } from "./numbers-of-letters";

export interface RootState {
  isSettingsActive: boolean;
  isLanguagesActive: boolean;
  isChallengeMode: boolean;
  isChallengeActive: boolean;
  numberOfLetters: number;
  numberOfAttempts: number;
  backspace: boolean;
  currentRow: number;
  enter: boolean;
  gameIs: "playing" | "won" | "lost";
  keys: Record<number, string[]>;
  modal: { content: string; isOpen: boolean; showButton: boolean };
  word: string;
  words: string[];
}

export const createInitialState = (): RootState => ({
  isSettingsActive: false,
  isLanguagesActive: false,
  isChallengeActive: false,
  isChallengeMode: false,
  numberOfLetters: DEFAULT_NUMBER_OF_LETTERS,
  numberOfAttempts: DEFAULT_NUMBER_OF_ATTEMPTS,
  backspace: false,
  currentRow: 0,
  enter: false,
  gameIs: "playing",
  keys: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
  modal: { isOpen: false, content: "", showButton: false },
  word: "",
  words: [],
});

export const createSetState = <T extends keyof RootState>(property: T, mergeObj?: boolean) => {
  return (
    state: RootState,
    action: PayloadAction<RootState[T] extends Record<string, unknown> ? Partial<RootState[T]> : RootState[T]>,
  ) => {
    if (!mergeObj) {
      state[property] = action.payload as any;
      return state;
    }

    const obj = state[property];
    if (typeof obj === "object" && typeof action.payload === "object") state[property] = { ...obj, ...action.payload };
  };
};

export const getRandomWord = (words: string[]) => encode(words[Math.floor(Math.random() * words.length)]);

export const getWords = (words: string[], length: number) => {
  return words.filter((word): word is string => typeof word === "string" && word.length === length);
};

export const getChallengeModeWord = (
  words: string[],
  challenge?: string,
): { exist: false } | { exist: true; challenge: string; encodedWord: string } => {
  const challengeModeWord = challenge && decode(challenge);
  const existsChallengeModeWord = !!(challengeModeWord && words.includes(challengeModeWord));

  if (!challengeModeWord || !existsChallengeModeWord) return { exist: false };

  return { exist: true, challenge: challengeModeWord, encodedWord: encode(challengeModeWord) };
};

interface Options {
  encodedChallengeModeWord?: string;
  numberOfLetters?: number;
  numberOfAttempts?: number;
  words?: string[];
}

export const restartGameAction = (state: RootState, options?: Options): RootState => {
  const {
    numberOfLetters = state.numberOfLetters,
    numberOfAttempts = state.numberOfAttempts,
    words = state.words,
    encodedChallengeModeWord = state.isChallengeMode ? state.word : undefined,
  } = options ?? {};

  const challengeModeWord = getChallengeModeWord(words, encodedChallengeModeWord);
  const validChallengeMode = challengeModeWord.exist && numberOfLetters === state.numberOfLetters;

  return {
    ...createInitialState(),
    isChallengeMode: validChallengeMode,
    gameIs: "playing",
    numberOfLetters: validChallengeMode ? challengeModeWord.challenge.length : numberOfLetters,
    numberOfAttempts,
    word: challengeModeWord.exist ? challengeModeWord.encodedWord : getRandomWord(getWords(words, numberOfLetters)),
    words,
  };
};
