import type { StorybookConfig } from '@storybook/nextjs';
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/nextjs",
  "staticDirs": [
    "../public"
  ],
  webpackFinal: async (config) => {
    // Ensure Tailwind v4 PostCSS plugin is used for CSS processing
    const cssRules = config.module?.rules?.filter(
      (rule: any) => rule?.test?.toString().includes('css')
    );
    if (cssRules) {
      for (const rule of cssRules as any[]) {
        if (rule.use) {
          for (const loader of rule.use) {
            if (loader.loader && loader.loader.includes('postcss-loader')) {
              loader.options = {
                ...loader.options,
                postcssOptions: {
                  plugins: [
                    ['@tailwindcss/postcss', {}],
                  ],
                },
              };
            }
          }
        }
      }
    }
    return config;
  },
};
export default config;