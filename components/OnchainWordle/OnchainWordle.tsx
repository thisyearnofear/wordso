import React from "react";
import styles from "./OnchainWordle.module.css";

export interface InstructionSection {
  title: string;
  content: string;
}

interface OnChainWordleProps {
  instructionSections: InstructionSection[];
}

const OnChainWordle: React.FC<OnChainWordleProps> = ({
  instructionSections,
}) => {
  return (
    <div className={styles.container}>
      {/* Instructions */}
      <div className={styles.instructionsWrapper}>
        {instructionSections.map((section, index) => (
          <section key={index} className={styles.section}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </section>
        ))}
      </div>

      {/* Onchain Guess Section - Directly after instructions */}
      <div className={styles.inputSection}>
        <h2>Make Your On-Chain Guess</h2>
        <input type="text" placeholder="Enter your guess" maxLength={5} />
        <button>Submit On-Chain Guess</button>
      </div>
    </div>
  );
};

export default OnChainWordle;
