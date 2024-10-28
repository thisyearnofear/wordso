export const NUMBER_OF_LETTERS_KEY = "number-of-letters";
export const NUMBER_OF_ATTEMPTS_KEY = "number-of-attempts";

export const NUMBERS_OF_LETTERS = [4, 5, 6, 7, 8, 9, 10, 11];
export const NUMBERS_OF_ATTEMPTS = [2, 3, 4, 5, 6];

export const DEFAULT_NUMBER_OF_LETTERS = 5;
export const DEFAULT_NUMBER_OF_ATTEMPTS = 6;

export function isValidNumberOfLetter(n: number) {
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  return !isNaN(n) && n > (NUMBERS_OF_LETTERS.at(0) as number) && n < (NUMBERS_OF_LETTERS.at(-1) as number);
}

export function getNumberFromCookie(numberOfLetters: any, defaultValue: number): number {
  return +(numberOfLetters ?? 0) || defaultValue;
}
