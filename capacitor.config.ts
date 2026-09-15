import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tileoasis.sanctuarymatch',
  appName: 'Tile Oasis: Sanctuary Match',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    AdMob: {
      // Configuration for @capacitor-community/admob
    },
  },
};

export default config;
