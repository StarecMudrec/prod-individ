/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        surface: {
                  DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
                  alt: 'rgb(var(--color-surface-alt) / <alpha-value>)',
                  light: 'rgb(var(--color-surface-light) / <alpha-value>)',
                  dark: 'rgb(var(--color-surface-dark) / <alpha-value>)',
                  darker: 'rgb(var(--color-surface-darker) / <alpha-value>)',
                  darkest: 'rgb(var(--color-surface-darkest) / <alpha-value>)',
        },
        text: {
              DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
              muted:  {
                      DEFAULT: 'rgb(var(--color-text-muted) / <alpha-value>)',
                      alot: 'rgb(var(--color-text-muted-alot) / <alpha-value>)',
              },
              button: 'rgb(var(--color-button-text) / <alpha-value>)',
        },
        button: {
          default: 'rgb(var(--color-button-default) / <alpha-value>)',
          'bg-default': 'rgb(var(--color-button-bg-default) / <alpha-value>)',
          'hover-default': 'rgb(var(--color-button-hover-default) / <alpha-value>)',
          dev:  'rgb(var(--color-button-dev) / <alpha-value>)',
          'bg-dev': 'rgb(var(--color-button-bg-dev) / <alpha-value>)',
          'hover-dev': 'rgb(var(--color-button-hover-dev) / <alpha-value>)',
        },
        question: {
          norm: {
                DEFAULT: 'var(--color-question-norm)',
                sec: 'var(--color-question-norm-secondary)',
                text: 'rgb(var(--color-text-question-norm) / <alpha-value>)',
          },
          auc:  {
                DEFAULT: 'rgb(var(--color-question-auc) / <alpha-value>)',
                sec: 'rgb(var(--color-question-auc-secondary) / <alpha-value>)',
                text: 'rgb(var(--color-text-question-auc) / <alpha-value>)',
          },
          cat:  {
                DEFAULT: 'rgb(var(--color-question-cat) / <alpha-value>)',
                sec: 'rgb(var(--color-question-cat-secondary) / <alpha-value>)',
                text: 'rgb(var(--color-text-question-cat) / <alpha-value>)',
          },
        },
        dev: {
          DEFAULT: 'rgb(var(--color-dev) / <alpha-value>)',
          sec: 'rgb(var(--color-dev-sec) / <alpha-value>)',
          text: 'rgb(var(--color-dev-text) / <alpha-value>)',
        },
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        amber: {
          50: 'rgb(var(--color-amber-50) / <alpha-value>)',
          100: 'rgb(var(--color-amber-100) / <alpha-value>)',
          200: 'rgb(var(--color-amber-200) / <alpha-value>)',
          400: 'rgb(var(--color-amber-400) / <alpha-value>)',
          600: 'rgb(var(--color-amber-600) / <alpha-value>)',
          800: 'rgb(var(--color-amber-800) / <alpha-value>)',
        },
        white: 'rgb(var(--color-white) / <alpha-value>)',
        black: 'rgb(var(--color-black) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        rampart: ['var(--font-rampart)'],
        chicoree: ['var(--font-chicoree)'],
        'faberge': ['var(--font-faberge)'],
      },
      spacing: {
        'section': 'var(--spacing-section)',
        'block': 'var(--spacing-block)',
        'modal-block': '17px'
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'button': 'var(--radius-button)',
      },   
      fontSize: { 'heading': '32px' },
      letterSpacing: {
        'tight-negative': '-20px',
        'tight-less-negative': '-10px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-stroke-thin': {
          '-webkit-text-stroke-width': '0.1px',
          '-webkit-text-stroke-color': 'rgb(var(--color-text))',
        },
        '.text-stroke-0-5': {
          '-webkit-text-stroke-width': '0.5px',
          '-webkit-text-stroke-color': 'rgb(var(--color-text))',
        },
        '.text-stroke-1': {
          '-webkit-text-stroke-width': '1px',
          '-webkit-text-stroke-color': 'rgb(var(--color-text))',
        },
        '.text-stroke-1-5': {
          '-webkit-text-stroke-width': '1.5px',
          '-webkit-text-stroke-color': 'rgb(var(--color-text))',
        },
        '.unselectable': {
          '-webkit-touch-callout': 'none',
          '-webkit-user-select': 'none',
          '-khtml-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
        },
        '.player-card-skin': {
          position: 'relative',
          borderRadius: 'var(--radius-card)',
          borderWidth: '2px',
          borderColor: 'rgb(var(--color-text) / 1)',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        },
        '.player-card-skin::before': {
          content: '""',
          position: 'absolute',
          top: '4px',
          left: '4px',
          width: '100%',
          height: '100%',
          zIndex: '-1',
          borderRadius: 'var(--radius-card)',
          background:
            'linear-gradient(45deg, rgb(var(--color-text) / 1) 20%, transparent 20%, transparent 50%, rgb(var(--color-text) / 1) 50%, rgb(var(--color-text) / 1) 70%, transparent 70%)',
          backgroundSize: '5px 5px',
        },
        '.glow-primary': {
          boxShadow:
            '0 0 0 1px rgb(var(--color-primary) / 0.5), 0 0 2px 3px rgb(var(--color-primary) / 0.3), 0 0 4px 6px rgb(var(--color-primary) / 0.12), 0 0 8px 8px rgb(var(--color-primary) / 0.05)',
        },
        '.glow-victory': {
          boxShadow:
            '0 0 0 1px rgb(var(--color-amber-600) / 0.5), 0 0 2px 3px rgb(var(--color-amber-600) / 0.3), 0 0 4px 6px rgb(var(--color-amber-600) / 0.12), 0 0 8px 8px rgb(var(--color-amber-600) / 0.05)',
        },
        '.glow-defeat': {
          boxShadow:
            '0 0 0 1px rgb(var(--color-error) / 0.5), 0 0 2px 3px rgb(var(--color-error) / 0.3), 0 0 4px 6px rgb(var(--color-error) / 0.12), 0 0 8px 8px rgb(var(--color-error) / 0.05)',
        },
        '.glow-auction': {
          boxShadow:
            '0 0 0 1px rgb(var(--color-text-question-auc) / 0.25), 0 0 2px 3px rgb(var(--color-text-question-auc) / 0.15), 0 0 4px 6px rgb(var(--color-text-question-auc) / 0.06), 0 0 8px 8px rgb(var(--color-text-question-auc) / 0.025)',
        },
        '.striped-defeat': {
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 5px, rgb(var(--color-error) / 0.3) 5px, rgb(var(--color-error) / 0.3) 10px)',
        },
      })
    },
  ],
}