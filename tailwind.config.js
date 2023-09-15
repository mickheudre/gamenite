/** @type {import('tailwindcss').Config} */
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
  }
}

