// Configures Vitest to run the React component and service test suite.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
  },
})
