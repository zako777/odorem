/**
 * Configuration Detox — tests E2E de l'application mobile.
 *
 * Une seule cible initiale : iOS Simulator en configuration Release.
 * Le projet utilise la génération native continue (CNG) : `expo prebuild`
 * génère le dossier ios/ (ignoré par git) avant la compilation xcodebuild.
 *
 * Prérequis et commandes : docs/e2e-detox.md
 *
 * @type {Detox.DetoxConfig}
 */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/mobile.app',
      build:
        'npx expo prebuild --platform ios && xcodebuild -workspace ios/mobile.xcworkspace -scheme mobile -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 17 Pro',
      },
    },
  },
  configurations: {
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
  },
};
