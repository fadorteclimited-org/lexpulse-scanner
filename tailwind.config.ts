/** @type {import('tailwindcss').Config} */
import {darkColors, primaryColor} from "./colors.js";
import forms from '@tailwindcss/forms';

export default {
    important: true,
  content: [
      './src/**/*.{js,ts,jsx,tsx}',
      './src/screens/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      './src/shells/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: primaryColor,
        dark: '#080714',
        danger: '#FF4D4F',
        warning: '#faad14',
        darkTheme: darkColors, // Adding dark theme colors
      },
        backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
    },
  },
    plugins: [forms],
}

