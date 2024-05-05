/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  plugins: [
    require('daisyui'),
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {        
          "primary": "#f59e0b",
          "secondary": "#d1d5db",
          "accent": "#f3f4f6",
          "neutral": "#e5e7eb",
          "base-100": "#111827",
          "info": "#009fff",
          "success": "#00e76e",
          "warning": "#bb6200",
          "error": "#ff6773",
          "dark": "#1f2937"
        }
      }
    ],
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  }

}

