import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react';

const customConfig = defineConfig({
  globalCss: {
    html: {
      colorPalette: 'blue',
    },
  },
  theme: {
    recipes: {
      heading: defineRecipe({
        name: "heading",
        base: {
          color: "blue.500"
        }
      } as any)
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: '{colors.white}' },
          _dark: { value: '#141414' }, // Custom dark background
        },
        fg: {
          DEFAULT: { value: '{colors.black}' },
          _dark: { value: '#e5e5e5' }, // Custom dark text color
        },
        border: {
          DEFAULT: { value: '{colors.gray.200}' },
          _dark: { value: '#404040' }, // Custom dark border
        },
        primary: {
          DEFAULT: { value: '{colors.blue.500}' },
          _dark: { value: '{colors.blue.300}' }, // Lighter blue for dark mode
        },
      },
    },
    keyframes: {
      "pulse": {
        '0%': { opacity: 0.4 },
        '50%': { opacity: 0.8 },
        '100%': { opacity: 0.4 }
      },
      "blinkAnimation": {
        "0%, 100%": { opacity: 0.3 },
        "50%": { opacity: 1 }
      },
      "floatAnimation": {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-10px)" }
      },
      // For LoadingPage
      // "pulseAnimation": {
      //   "0%": { opacity: 0.6 },
      //   "50%": { opacity: 1 },
      //   "100%": { opacity: 0.6 }
      // }

      // For ErrorPage 
      "pulseAnimation": {
        "0%": { transform: "scale(1)", opacity: 0.8 },
        "50%": { transform: "scale(1.05)", opacity: 1 },
        "100%": { transform: "scale(1)", opacity: 0.8 }
      }
    }
  },
});

const system = createSystem(defaultConfig, customConfig);

export default system;