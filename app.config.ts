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
      },
      verticalNavigation: {
        font: "font-base",
        active: "text-gray-900 dark:text-white before:bg-gray-100 dark:before:bg-gray-800",
        inactive: "text-gray-500 dark:text-gull-gray-500 hover:text-gray-900 dark:hover:text-white hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50",
      },
      notifications: {
        position: 'top-0 right-0'
      }
    }
  })
  