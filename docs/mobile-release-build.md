# Build mobile de release (iOS, distribution interne)

L'application mobile (`frontend/mobile`) est construite par EAS Build lors des
PR dont la branche source commence par `release/`. Le workflow GitHub Actions
est défini dans `.github/workflows/mobile-release-build.yml`.

Le build iOS utilise la distribution interne EAS (provisioning ad hoc) : le
fichier `.ipa` produit est installable uniquement sur les iPhone dont l'UDID
est enregistré, via un lien partagé par EAS. L'iPhone est la plateforme
prioritaire du MVP (voir `CLAUDE.md`).

## Déclenchement

- Toute PR du dépôt dont la branche source est préfixée `release/` lance le build.
- Les PR issues d'un fork ne lancent pas le build (le secret `EXPO_TOKEN`
  n'est pas exposé aux forks).
- `concurrency` annule les exécutions GitHub Actions obsolètes d'une même
  branche ; les builds EAS déjà démarrés à distance ne sont pas annulés.
- L'échec du build EAS fait échouer le statut GitHub de la PR ; le lien du
  build est ajouté au résumé du job.

## Mise en place (à faire une seule fois)

1. Créer un compte sur [expo.dev](https://expo.dev).
2. Depuis `frontend/mobile` :
   ```sh
   npx eas-cli login
   npx eas-cli init
   ```
   `eas init` ajoute `expo.extra.eas.projectId` au `app.json` : committer ce
   changement.
3. Créer un access token sur expo.dev (Account settings > Access tokens) et
   l'ajouter comme secret `EXPO_TOKEN` dans Settings > Secrets and variables >
   Actions du dépôt.
4. L'inscription au Apple Developer Program est requise pour la signature iOS.
   Enregistrer d'abord les iPhone qui recevront l'application, afin que leurs
   UDID soient inclus dans le profil ad hoc :
   ```sh
   npx eas-cli device:create
   ```
   (la commande fournit une URL ou un QR code à ouvrir sur chaque iPhone)
5. Lancer une première fois le build en local, depuis `frontend/mobile`, pour
   que EAS crée les credentials de signature (certificat de distribution et
   profil ad hoc) :
   ```sh
   npx eas-cli build --platform ios --profile internal
   ```

## Ajouter un iPhone après coup

Enregistrer l'appareil avec `npx eas-cli device:create`, puis soit relancer un
build, soit re-signer le build existant :

```sh
npx eas-cli build:resign
```

## Profil de build

Le profil `internal` est défini dans `frontend/mobile/eas.json` :
`distribution: internal` (partage par URL EAS, provisioning ad hoc sur iOS).

## Limites connues

- Le plan gratuit EAS limite le nombre de builds iOS par mois.
- Les icônes actuellement versionnées sont les placeholders du template
  officiel Expo : à remplacer par le logo réel avant une livraison.
