// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto"', 'sans-serif'],
        openSans: ['"Open Sans"', 'sans-serif'],
        lato: ['"Lato"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        merriweather: ['"Merriweather"', 'serif'],
        oswald: ['"Oswald"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        raleway: ['"Raleway"', 'sans-serif'],
        sourceSansPro: ['"Source Sans Pro"', 'sans-serif'],
        nunito: ['"Nunito"', 'sans-serif'],
        dancingScript: ['"Dancing Script"', 'cursive'],
        quicksand: ['"Quicksand"', 'sans-serif'],
        lora: ['"Lora"', 'serif'],
        bebasNeue: ['"Bebas Neue"', 'cursive'],
      },
    },
  },
  plugins: [],
}
