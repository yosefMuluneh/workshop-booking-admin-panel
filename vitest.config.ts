// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts', // Make sure this path is correct

    // --- THIS IS THE CRITICAL FIX ---
    // Force Vitest to process the CSS from @mui/x-data-grid
    deps: {
      inline: [/@mui\/x-data-grid/],
    },

    // We can revert to the simpler CSS mocking strategy now
    // because the dependency will be correctly processed.
    css: true,
  },
});