import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(255, 255, 255)',
        text: 'rgb(34, 34, 34)',
        filter: 'rgb(238, 235, 39)',
      },
    },
  },
  plugins: [],
}
export default config