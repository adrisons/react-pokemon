import type { StorybookConfig } from '@storybook/react-vite';
import path from "path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  framework: "@storybook/react-vite",
  viteFinal: async (cfg) => {
    if (!cfg.resolve) cfg.resolve = {};
    cfg.resolve.alias = {
      ...cfg.resolve.alias,
      "@app": path.resolve(dirname, "../src/app"),
      "@shared": path.resolve(dirname, "../src/shared"),
      "@core": path.resolve(dirname, "../src/core"),
      "@features": path.resolve(dirname, "../src/features"),
      "@layouts": path.resolve(dirname, "../src/layouts"),
    };
    return cfg;
  },
};
export default config;