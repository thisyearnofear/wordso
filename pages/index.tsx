import Head from "next/head";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useWindowEvent } from "hooks/use-window-event";
import { useGame } from "hooks/use-game";
import { GamePanel } from "components/Game/Panel";
import { GameState } from "components/Game/State";
import { Header } from "components/Header";
import { getWords } from "utils/get-words";
import { gameSelector, startGame } from "store/appSlice";
import { resetGame } from "utils/reset-game";
import { Settings } from "components/Settings";
import { Challenge } from "components/Challenge";
import { useRouter } from "next/router";
import { useTranslation } from "hooks/use-translations";
import { Languages } from "components/Languages";
import ConnectButton from "../components/ConnectButton";
import dynamic from "next/dynamic";
import ScrollingGrid from "components/ScrollingGrid/ScrollingGrid";
import ScrollSequence from "components/ScrollingGrid/ScrollSequence";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LenisOptions } from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

const OnChainWordle = dynamic(
  () => import("components/OnchainWordle/OnchainWordle"),
  { ssr: true }
);

export default function Game({
  colorScheme,
}: {
  colorScheme: "light" | "dark";
}) {
  const router = useRouter();
  const translation = useTranslation();
  const dispatch = useAppDispatch();
  const lenisRef = useRef<Lenis | null>(null);

  const { deleteLastLetter, passToNextRow, addNewKeyWithEvent, activeModal } =
    useGame();
  const { backspace, enter } = useAppSelector(gameSelector);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const options: LenisOptions = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    };

    lenisRef.current = new Lenis(options);

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis to ScrollTrigger
    lenisRef.current.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current?.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  useEffect(() => {
    if (backspace) deleteLastLetter();
  }, [backspace, deleteLastLetter]);

  useEffect(() => {
    if (enter) passToNextRow();
  }, [enter, passToNextRow]);

  useEffect(() => {
    const start = async () => {
      const timeout = setTimeout(() => {
        activeModal(translation.loading, 1000 * 60);
      }, 500);

      const words = await getWords(router.locale ?? "en");
      const challenge = router.query.challenge;
      const encodedChallengeModeWord =
        typeof challenge === "string" ? challenge : undefined;

      clearTimeout(timeout);
      dispatch(startGame({ words, encodedChallengeModeWord }));
      resetGame();
      activeModal(translation.make_your_first_guess, 1500);
    };
    start().catch(() => {});
  }, [
    router.locale,
    router.query.challenge,
    dispatch,
    activeModal,
    translation.loading,
    translation.make_your_first_guess,
  ]);

  useWindowEvent("keydown", addNewKeyWithEvent);

  // Prepare game section content
  const GameSection = (
    <div className="App-container">
      <Header colorScheme={colorScheme} />
      <div className="Game">
        <GamePanel />
        <GameState />
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <link
          rel="manifest"
          href={
            router.locale === "es"
              ? "/manifest_es.json"
              : router.locale === "sw"
                ? "/manifest_sw.json"
                : "/manifest.json"
          }
        />
      </Head>
      <div className="scroll-progress" />
      <ConnectButton />

      {/* ScrollSequence with smooth scrolling */}
      <ScrollSequence>
        {/* Game Section */}
        {GameSection}

        {/* Grid Section */}
        <ScrollingGrid />

        {/* OnChain Section */}
        <OnChainWordle />
      </ScrollSequence>

      {/* Modals and overlays */}
      <Settings />
      <Challenge />
      <Languages />
    </>
  );
}
