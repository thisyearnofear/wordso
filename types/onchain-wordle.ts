export interface InstructionSection {
  title: string;
  content: string;
  icon?: string;
  highlight?: string;
}

export interface AnimationTimeline {
  play: () => void;
  reverse: () => void;
}

export interface ScrollTriggerConfig {
  trigger: Element;
  start: string;
  end?: string;
  scrub?: number | boolean;
  toggleActions?: string;
  pin?: boolean;
  anticipatePin?: number;
  markers?: boolean;
}

export interface GSAPContext {
  revert: () => void;
}

export interface SectionRefs {
  current: Array<HTMLElement | null>;
}

export interface ContainerRef {
  current: HTMLDivElement | null;
}

export interface InputRef {
  current: HTMLInputElement | null;
}
