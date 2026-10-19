# Tests E2E Detox (application mobile)

Les tests de bout en bout de l'application mobile (`frontend/mobile`) utilisent
[Detox](https://wix.github.io/Detox/) avec Jest comme exécuteur de tests.

## Emplacement

- Configuration Detox : `frontend/mobile/.detoxrc.js`
- Tests : `frontend/mobile/e2e/` (convention : fichiers `*.test.js`)
- Éléments interactibles repérés par `testID` (par exemple
  `home-screen` sur l'écran initial dans `src/app/index.tsx`)

## Prérequis (macOS uniquement)

L'exécution des tests E2E iOS nécessite :

- macOS avec Xcode (runtime simulateur iOS installé),
- CocoaPods (`sudo gem install cocoapods`),
- `applesimutils`, un utilitaire requis par Detox (`brew install applesimutils`),
- Node.js 22.13 minimum (prérequis de l'Expo SDK 57).

Les runners GitHub Actions actuels du dépôt sont sous Linux et ne peuvent pas
lancer de simulateur iOS : les tests E2E s'exécutent en local pour l'instant
(une intégration CI macOS reste possible en suivi).

## Commandes

Depuis `frontend/mobile` :

```sh
# Installer les dépendances (dont detox et jest)
npm ci

# Générer le projet natif iOS (CNG) puis compiler l'app pour le simulateur
npm run e2e:build:ios

# Lancer les tests E2E sur le simulateur
npm run e2e:test:ios
```

Le build utilise `expo prebuild` (le dossier `ios/` généré est ignoré par git)
puis `xcodebuild` en configuration Release pour le simulateur.

À noter : `expo prebuild` réécrit les scripts `ios` et `android` du
`package.json` (`expo start --ios` devient `expo run:ios`). Si cela se produit,
rétablissez les scripts d'origine (`expo start --ios` / `expo start --android`) et
ne commitez pas cette réécriture — le projet reste en génération native continue.

## Cible et configuration

Une seule cible initiale : simulateur iOS en configuration Release
(`ios.sim.release`). Le modèle de simulateur (iPhone 17 Pro) est configurable
dans `frontend/mobile/.detoxrc.js` ; la liste des simulateurs disponibles est
obtenue avec `xcrun simctl list devices available`.

## Limites connues

- Detox 20.51 est officiellement testé par ses mainteneurs pour React Native
  0.77 à 0.84 (voir [Environment Setup
  Detox](https://wix.github.io/Detox/docs/introduction/environment-setup/)) ;
  le projet utilise React Native 0.86 (Expo SDK 57), au-delà de cette plage.
  La compatibilité avec RN 0.86 n'a pas été validée ici : le smoke test doit
  être exécuté sur macOS pour la confirmer.
- Les tests pilotent le binaire de l'application généré par prebuild, pas
  Expo Go.
