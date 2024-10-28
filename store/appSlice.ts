import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { resetGame } from "utils/reset-game";
import { createInitialState, createSetState, restartGameAction, type RootState } from "utils/store";

export const appSlice = createSlice({
  name: "app",
  initialState: createInitialState(),
  reducers: {
    startGame: (state, action: PayloadAction<{ words: string[]; encodedChallengeModeWord?: string }>) => {
      const { words, encodedChallengeModeWord } = action.payload;
      return restartGameAction(state, { words, encodedChallengeModeWord });
    },
    setSettings: (state, action: PayloadAction<{ numberOfLetters?: number; numberOfAttempts?: number }>) => {
      resetGame();
      return restartGameAction(state, {
        numberOfLetters: action.payload.numberOfLetters ?? state.numberOfLetters,
        numberOfAttempts: action.payload.numberOfAttempts ?? state.numberOfAttempts,
      });
    },
    restartGame: (state, action: PayloadAction<number | undefined>) => {
      resetGame();
      return restartGameAction(state, { numberOfLetters: action.payload });
    },
    setCurrentKeys: createSetState("keys", true),
    setModal: createSetState("modal", true),
    setBackspace: createSetState("backspace"),
    setCurrentRow: createSetState("currentRow"),
    setEnter: createSetState("enter"),
    setGameIs: createSetState("gameIs"),
    setSettingsActive: createSetState("isSettingsActive"),
    setLanguagesActive: createSetState("isLanguagesActive"),
    setChallengeActive: createSetState("isChallengeActive"),
    setIsChallengeMode: createSetState("isChallengeMode"),
    setNumberOfLetters: createSetState("numberOfLetters"),
    setNumberOfAttempts: createSetState("numberOfAttempts"),
  },
});

export const {
  restartGame,
  setCurrentKeys,
  setModal,
  setBackspace,
  setCurrentRow,
  setEnter,
  setGameIs,
  startGame,
  setSettingsActive,
  setLanguagesActive,
  setChallengeActive,
  setIsChallengeMode,
  setSettings,
  setNumberOfLetters,
  setNumberOfAttempts,
} = appSlice.actions;

const defaultSelector = <T>(state: T) => state;

export const letterSelector = createSelector(
  defaultSelector,
  ({ currentRow, word, words, numberOfLetters, numberOfAttempts }: RootState) => ({
    currentRow,
    word,
    words,
    numberOfLetters,
    numberOfAttempts,
  }),
);

export const panelSelector = createSelector(
  defaultSelector,
  ({ gameIs, keys, modal, numberOfAttempts, isChallengeMode }: RootState) => ({
    gameIs,
    keys,
    modal,
    isChallengeMode,
    numberOfAttempts,
  }),
);

export const stateSelector = createSelector(defaultSelector, ({ gameIs, word, isChallengeMode }: RootState) => ({
  gameIs,
  word,
  isChallengeMode,
}));

export const gameSelector = createSelector(defaultSelector, ({ backspace, enter }: RootState) => ({
  backspace,
  enter,
}));

export const gameHookSelector = createSelector(
  defaultSelector,
  ({
    backspace,
    currentRow,
    enter,
    gameIs,
    keys,
    words,
    numberOfLetters,
    numberOfAttempts,
    isChallengeActive,
    isSettingsActive,
  }: RootState) => {
    return {
      backspace,
      currentRow,
      enter,
      keys,
      gameIs,
      words,
      numberOfLetters,
      numberOfAttempts,
      isChallengeActive,
      isSettingsActive,
      isFinished: gameIs !== "playing",
    };
  },
);

export const settingsSelector = createSelector(
  defaultSelector,
  ({ isChallengeMode, isSettingsActive, numberOfLetters, numberOfAttempts }: RootState) => ({
    isChallengeMode,
    isSettingsActive,
    numberOfLetters,
    numberOfAttempts,
  }),
);

export const headerSelector = createSelector(defaultSelector, ({ gameIs, currentRow, isChallengeMode }: RootState) => ({
  gameIs,
  isChallengeMode,
  startPlaying: currentRow > 0,
}));

export const challengeSelector = createSelector(defaultSelector, ({ isChallengeActive, words }: RootState) => ({
  isChallengeActive,
  words,
}));

export default appSlice.reducer;
