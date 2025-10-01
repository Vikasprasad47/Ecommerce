/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    mode: 'jit', // Ensure JIT mode is enabled
    theme: {
      extend: {  // ✅ Change `extends` to `extend`
        colors: {
          "primary-200": "#ffbf00",  // ✅ Added missing `#`
          "primary-100": "#ffc929",
          "secondary-200": "#00b050",
          "secondary-100": "#0b1a78"
        }
      }
    }
  }
  