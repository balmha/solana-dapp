module.exports = {
  mode: "jit",
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require("@tailwindcss/typography")
  ],
  daisyui: {
    styled: true,
    // TODO: Theme needs works
    themes: [
      {
        'solana': {
          fontFamily: {
            display: ['PT Mono, monospace'],
            body: ['Inter, sans-serif'],
          },
          'primary': '#0a0a0a',           /* Primary color (deep black) */
          'primary-focus': '#9945FF',     /* Primary color - focused (Solana Purple) */
          'primary-content': '#ffffff',

          'secondary': '#171717',         /* Secondary color (dark gray) */
          'secondary-focus': '#14F195',   /* Secondary color - focused (Solana Green) */
          'secondary-content': '#ffffff',

          'accent': '#9945FF',            /* Accent color (Solana Purple) */
          'accent-focus': '#7e22ce',
          'accent-content': '#ffffff',

          'neutral': '#171717',           /* Neutral color */
          'neutral-focus': '#262626',
          'neutral-content': '#ffffff',

          'base-100': '#000000',          /* Base color of page */
          'base-200': '#0a0a0a',
          'base-300': '#171717',
          'base-content': '#f9fafb',

          'info': '#2094f3',              /* Info */
          'success': '#009485',           /* Success */
          'warning': '#ff9900',           /* Warning */
          'error': '#ff5724',             /* Error */
        },
      },
      // backup themes:
      // 'dark',
      // 'synthwave'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
}