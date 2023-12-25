/** @type {import('tailwindcss').Config} */
const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")

module.exports = {
  content: [
    `./components/**/*.{vue,js,ts}`,
    `./dashboard/**/*.vue`,
    `./layouts/**/*.vue`,
    `./pages/*.vue`,
    `./composables/**/*.{js,ts}`,
    `./plugins/**/*.{js,ts}`,
    `./utils/**/*.{js,ts}`,
    `./App.{js,ts,vue}`,
    `./app.{js,ts,vue}`,
    `./Error.{js,ts,vue}`,
    `./error.{js,ts,vue}`,
    `./app.config.{js,ts}`,
  ],
  theme: {
    extend: {
      colors: {
        'gull-gray': {
          '50': '#f8f9fa',
          '100': '#f2f4f5',
          '200': '#e6eaee',
          '300': '#d2d9e0',
          '400': '#b8c3cd',
          '500': '#94a1b2',
          '600': '#838fa4',
          '700': '#707b91',
          '800': '#5e6879',
          '900': '#4e5564',
          '950': '#333942',
      },
        'woodsmoke': {
          '50': '#ededf1',
          '100': '#d8d9df',
          '200': '#b6b7c3',
          '300': '#8e90a2',
          '400': '#707287',
          '500': '#5a5b6f',
          '600': '#4a4a5a',
          '700': '3f404d',
          '800': '#242629',
          '900': '#16161a',
          '950': '#16161a',
      },
        
        'jungle-green': {
          '50': '#eefbf4',
          '100': '#d7f4e3',
          '200': '#b1e9ca',
          '300': '#7fd6ad',
          '400': '#4abd8a',
          '500': '#2cb67d',
          '600': '#198258',
          '700': '#146849',
          '800': '#12533c',
          '900': '#104432',
          '950': '#08261d',
      },
      
        'cornflower-blue': {
          '50': '#f4f3ff',
          '100': '#eceafd',
          '200': '#dcd7fd',
          '300': '#c1b7fb',
          '400': '#a38ff6',
          '500': '#7f5af0',
          '600': '#7440e7',
          '700': '#642ed3',
          '800': '#5426b1',
          '900': '#462191',
          '950': '#2a1362',
      },


        'venus': {
          '50': '#f8f7f8',
          '100': '#f3f0f3',
          '200': '#e8e2e7',
          '300': '#d6cbd5',
          '400': '#bbabb9',
          '500': '#9f899c',
          '600': '#8c7688',
          '700': '#766071',
          '800': '#62525e',
          '900': '#544751',
          '950': '#30272e',
      },


        'ebony-clay': {
          '50': '#f6f7f9',
          '100': '#ebecf3',
          '200': '#d4d7e3',
          '300': '#aeb4cb',
          '400': '#818aaf',
          '500': '#626c95',
          '600': '#4d557c',
          '700': '#3f4465',
          '800': '#373b55',
          '900': '#2f3245',
          '950': '#212330',
      },


        'grimPurple': {
          '50': '#f8f7f8',
        '100': '#f2f1f2',
        '200': '#e7e3e6',
        '300': '#d4cdd4',
        '400': '#b8aeb7',
        '500': '#9a8c98',
        '600': '#887a85',
        '700': '#72646f',
        '800': '#5f555d',
        '900': '#524950',
        '950': '#2e292d',}
      }
    },
    fontFamily: {
      'body': [
    'Inter', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Roboto', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    'Apple Color Emoji', 
    'Segoe UI Emoji', 
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ],
      'sans': [
    'Inter', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Roboto', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    'Apple Color Emoji', 
    'Segoe UI Emoji', 
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ]
    }
  },
  plugins: [
    iconsPlugin({
      // Select the icon collections you want to use
      // You can also ignore this option to automatically discover all icon collections you have installed
      collections: getIconCollections(["heroicons", "lucide"]),
    }),
  ],
}

