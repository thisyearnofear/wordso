// pages/index.tsx

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
import ScrollSequence from "components/ScrollingGrid/ScrollSequence";
import { InstructionSection } from "components/OnchainWordle/OnchainWordle";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LenisOptions } from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

// Define instructionSections locally
const instructionSections: InstructionSection[] = [
  {
    title: "Welcome to On-Chain Wordle",
    content: "Get ready for a blockchain-powered word guessing game!",
  },
  {
    title: "How to Play",
    content:
      "Start with the off-chain version, then use image clues for the on-chain word.",
  },
  {
    title: "Daily Challenge",
    content: "You get one on-chain guess every 24 hours. Make it count!",
  },
  {
    title: "Blockchain Integration",
    content:
      "Your guesses are recorded on the blockchain, ensuring fairness and transparency.",
  },
  {
    title: "Ready to Play?",
    content:
      "Scroll down to make your on-chain guess and join the crypto-word revolution!",
  },
];

export default function Game({
  colorScheme,
}: {
  colorScheme: "light" | "dark";
}) {
  const router = useRouter();
  const translation = useTranslation();
  const dispatch = useAppDispatch();
  const lenisRef = useRef<Lenis | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { deleteLastLetter, passToNextRow, addNewKeyWithEvent, activeModal } =
    useGame();
  const { backspace, enter } = useAppSelector(gameSelector);

  // Initialize Lenis smooth scrolling and GSAP animations
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

    // Create GSAP context
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // Pin game section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      });

      // Fade out game section
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "center top",
          scrub: true,
          onLeave: () => {
            gsap.set(containerRef.current, { visibility: "hidden" });
          },
          onEnterBack: () => {
            gsap.set(containerRef.current, { visibility: "visible" });
          },
        },
      });
    });

    // RAF loop for Lenis
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
      ctx.revert();
      lenisRef.current?.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  // Game logic effects
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
    <div className="App-container" ref={containerRef}>
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

      {/* Game Section */}
      {GameSection}

      {/* ScrollSequence with instructions */}
      <ScrollSequence instructionSections={instructionSections} />

      {/* Modals and overlays */}
      <Settings />
      <Challenge />
      <Languages />
    </>
  );
}
