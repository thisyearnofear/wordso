/* eslint-disable @typescript-eslint/no-var-requires */
import { useLocale } from "./use-locale";

export interface Translation {
  title: string;
  description: string;
  keywords: string;
  button_copy_link_to_this_word: string;
  button_copy_link: string;
  close: string;
  dark_mode_description: string;
  dark_mode_title: string;
  dictionary: string;
  give_up: string;
  link_copied: string;
  loading: string;
  mainpage: string;
  make_your_first_guess: string;
  new_game: string;
  not_a_valid_word: string;
  not_found: string;
  number_of_letters_description: string;
  number_of_letters_title: string;
  number_of_attempts_description: string;
  number_of_attempts_title: string;
  placeholder_your_word: string;
  restart: string;
  select_a_game_dictionary: string;
  select_dictionary: string;
  settings: string;
  the_answer_was: string;
  tip_challenge: string;
  tip_you_lost: string;
  tip_you_win: string;
  too_short: string;
  what_does_it_mean: string;
  wordle_generator_description: string;
  wordle_generator_title: string;
}

export function useTranslation(): Translation {
  const { locale } = useLocale();
  // sourcery skip: inline-immediately-returned-variable
  const lang = require(`public/i18n/${locale}.json`);
  return lang;
}
