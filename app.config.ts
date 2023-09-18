export default defineAppConfig({
    ui: {
      primary: 'cornflower-blue',
      gray: 'woodsmoke',
      button: {
        variant: {
          solid: "shadow-sm text-white dark:text-white bg-{color}-500 hover:bg-{color}-600 disabled:bg-{color}-500 dark:bg-{color}-500 dark:hover:bg-{color}-600 dark:disabled:bg-{color}-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-500"
        }
      },
      table: {
        td: {
          color: "text-gull-gray-900 dark:text-gull-gray-500"
        }
      }

    }
  })
  