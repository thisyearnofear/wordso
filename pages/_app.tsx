import "styles/global.css";
import type { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import { getCookie } from "cookies-next";
import { store } from "store/store";
import { Footer } from "components/Footer";
import { setNumberOfAttempts, setNumberOfLetters } from "store/appSlice";
import { MontserratFont, OpenSansFont } from "utils/fonts";
import {
  DEFAULT_NUMBER_OF_ATTEMPTS,
  DEFAULT_NUMBER_OF_LETTERS,
  getNumberFromCookie,
  NUMBER_OF_ATTEMPTS_KEY,
  NUMBER_OF_LETTERS_KEY,
} from "utils/numbers-of-letters";
import { useTranslation } from "hooks/use-translations";
import ContextProvider from "../context";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function App({
  Component,
  pageProps,
  colorScheme,
  numberOfLetters,
  numberOfAttempts,
}: AppProps & {
  colorScheme: "light" | "dark";
  numberOfLetters: number;
  numberOfAttempts: number;
}) {
  const translation = useTranslation();

  store.dispatch(setNumberOfLetters(numberOfLetters));
  store.dispatch(setNumberOfAttempts(numberOfAttempts));

  useEffect(() => {
    const updateScroll = () => {
      const scrollPercentage =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty(
        "--scroll",
        `${scrollPercentage * 100}%`
      );
      document.documentElement.style.setProperty(
        "--bg-position",
        `0 ${scrollPercentage * 100}%`
      );
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <link rel="icon" sizes="512x512" href="/favicon.png" type="image/png" />
        <meta name="description" content={translation.description} />
        <meta name="keywords" content={translation.keywords} />
        <meta name="theme-color" content="#000000" />
        <link
          rel="shortcut icon"
          href="/icons/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="shortcut icon"
          href="/icons/favicon-192x192.png"
          sizes="192x192"
          type="image/png"
        />
        <link
          rel="shortcut icon"
          href="/icons/favicon-384x384.png"
          sizes="384x384"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          type="image/png"
          href="/icons/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          type="image/png"
          href="/icons/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          type="image/png"
          href="/icons/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          type="image/png"
          href="/icons/apple-touch-icon-152x152.png"
        />
      </Head>
      <div className="scroll-progress" />
      <Provider store={store}>
        <ContextProvider cookies={getCookie("cookie")}>
          <div
            className={`App ${MontserratFont.variable} ${OpenSansFont.variable}`}
          >
            <Component {...pageProps} colorScheme={colorScheme} />
            <Footer />
          </div>
        </ContextProvider>
      </Provider>
      <Analytics />
    </>
  );
}

App.getInitialProps = ({ ctx }: AppContext) => {
  const numberOfLettersCookie = getCookie(NUMBER_OF_LETTERS_KEY, ctx);
  const numberOfAttemptsCookie = getCookie(NUMBER_OF_ATTEMPTS_KEY, ctx);

  return {
    numberOfLetters: getNumberFromCookie(
      numberOfLettersCookie,
      DEFAULT_NUMBER_OF_LETTERS
    ),
    numberOfAttempts: getNumberFromCookie(
      numberOfAttemptsCookie,
      DEFAULT_NUMBER_OF_ATTEMPTS
    ),
    colorScheme: getCookie("preferred-color-theme", ctx),
  };
};
