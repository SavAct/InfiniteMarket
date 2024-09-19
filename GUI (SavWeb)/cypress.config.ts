import { defineConfig } from 'cypress';
import setupNodeEvents from './cypress/plugins/index';

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    experimentalStudio: true,
    setupNodeEvents,
  },
});
