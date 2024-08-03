/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',  // Include the app directory if using Next.js 13+
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#0D47A1",   // Deep Blue (for buttons and primary elements)
          "secondary": "#00ACC1", // Teal (for secondary elements)
          "accent": "#82B1FF",    // Light Blue (for accents)
          "neutral": "#FFFFFF",   // White (for backgrounds and neutral areas)
          "base-100": "#E3F2FD",  // Light Blue-Teal mix (for base backgrounds)
        },
      },
      "light", // Optional: Include predefined light theme
      "dark",  // Optional: Include predefined dark theme
    ],
  },
}