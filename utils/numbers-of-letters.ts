export const NUMBER_OF_LETTERS_KEY = "number-of-letters";
export const NUMBER_OF_ATTEMPTS_KEY = "number-of-attempts";

export const NUMBERS_OF_LETTERS = [4, 5, 6, 7, 8, 9, 10, 11];
export const NUMBERS_OF_ATTEMPTS = [2, 3, 4, 5, 6];

export const DEFAULT_NUMBER_OF_LETTERS = 5;
export const DEFAULT_NUMBER_OF_ATTEMPTS = 6;

export function isValidNumberOfLetter(n: number) {
  const firstNumber = NUMBERS_OF_LETTERS[0];
  const lastNumber = NUMBERS_OF_LETTERS[NUMBERS_OF_LETTERS.length - 1];
  return (
    !isNaN(n) &&
    firstNumber !== undefined &&
    lastNumber !== undefined &&
    n > firstNumber &&
    n < lastNumber
  );
}

export function getNumberFromCookie(
  cookie: string | undefined,
  defaultValue: number
): number {
  if (!cookie) return defaultValue;
  const value = parseInt(cookie, 10);
  return isNaN(value) ? defaultValue : value;
}
