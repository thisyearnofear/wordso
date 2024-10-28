module.exports = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => ["pnpm tsc --noEmit"],

  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx|js)": (filenames) => [
    `pnpm eslint --fix ${filenames.join(" ")}`,
    `pnpm prettier --write ${filenames.join(" ")}`,
  ],
  "*": (filenames) => [`pnpm prettier -wu ${filenames.join(" ")}`],
};
