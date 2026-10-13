# Odorem — Instructions pour Claude Code

## 1. Projet et objectif

Odorem est une application mobile personnelle de gestion de parfums.

Le MVP doit permettre de :
- Consulter un catalogue de parfums et rechercher par nom ou marque.
- Consulter une fiche parfum.
- Gérer une collection personnelle et les informations de ses possessions.
- Gérer une wishlist et transférer un élément vers sa collection.
- Scanner un code-barres pour retrouver un produit dans le catalogue interne.
- Se connecter par email/mot de passe, Google et Apple.

Le projet est développé par deux développeurs full-stack.
La première livraison est privée, sur leurs deux iPhone.
Aucune échéance fixe n’est imposée.

Priorités :
- Parcours simples et réellement utilisables.
- Isolation stricte des données personnelles.
- Fiabilité, tests et maintenance.
- Technologies justifiées par les besoins, sans surarchitecture.

La communauté, les fonctions sociales, les notifications et la publication
publique ne font pas partie du MVP actuel.

## 2. Source de vérité et état du projet

Ne pas confondre une décision, un ticket et une fonctionnalité implémentée.

Pour comprendre une tâche :
1. Lire les instructions applicables et la documentation concernée.
2. Examiner le code, les configurations, les migrations et les tests.
3. Identifier les différences entre l’état actuel et la cible.
4. Signaler les contradictions avant une modification structurante.

Sources à consulter :
- Ce fichier : contexte durable et règles de travail.
- docs/setup.md : procédures de développement.
- backend/package.json et frontend/mobile/package.json : scripts et dépendances.
- infra/ : tâches de développement et configuration d’infrastructure.

Ne pas supposer une branche de travail d’après une ancienne conversation.
Vérifier les branches disponibles et les conventions actuelles du dépôt.

## 3. Structure actuelle du dépôt

La structure observée est :

    backend/           API AdonisJS
    frontend/mobile/   Application React Native avec Expo
    docs/              Documentation du projet
    infra/             Outils de développement et infrastructure
    README.md          Présentation du dépôt

L’ancienne proposition apps/api et apps/mobile ne décrit pas la structure
actuelle. Ne pas déplacer les applications pour retrouver cette proposition
sans validation explicite.

Respecter l’organisation et les conventions déjà présentes.
Ne pas ajouter de packages partagés ou d’outil de monorepo sans besoin concret.

## 4. Stack et décisions techniques

### Backend
- TypeScript et modules ESM.
- AdonisJS ; le package actuel déclare @adonisjs/core ^7.5.2.
- Lucid pour la persistance.
- VineJS pour la validation serveur.
- Japa pour les tests.
- GraphQL avec @foadonis/graphql et Apollo Server.
- Authentification REST existante à conserver et à tester.

### Mobile
- React Native avec Expo et TypeScript.
- Expo Router pour la navigation.
- iPhone comme plateforme prioritaire du MVP.
- Respecter les versions compatibles déclarées dans le package mobile.

### Base de données
- PostgreSQL est la cible retenue pour le MVP.
- La configuration actuelle accepte SQLite et PostgreSQL.
- DB_CONNECTION=pg sélectionne PostgreSQL ; sinon la configuration
  consultée utilise SQLite.
- La documentation Docker actuelle décrit encore SQLite.

Ne pas considérer la transition PostgreSQL comme terminée sans vérifier
l’environnement, les migrations, les tests et la documentation.
Ne pas supprimer SQLite ou ses dépendances sans examiner leurs usages.

### Dépendances
Les applications possèdent actuellement des package-lock.json.
Utiliser npm et respecter les lockfiles existants.
Ne pas introduire pnpm, Yarn ou un nouveau gestionnaire sans validation.

Zod n’est pas obligatoire.
Ne pas ajouter Zod, un client GraphQL, une base mobile locale ou une bibliothèque
de formulaires uniquement par habitude.
Justifier toute nouvelle dépendance par un besoin identifié.

## 5. Commandes de développement

Les commandes communes sont documentées dans docs/setup.md.
Elles utilisent Invoke depuis la racine du dépôt.

Installation de l’outil, si nécessaire :

    python3 -m pip install -e infra

Découverte des tâches :

    inv -r infra --list

Tâches documentées :

    inv -r infra install
    inv -r infra backend
    inv -r infra mobile
    inv -r infra build
    inv -r infra test
    inv -r infra check

Avant leur exécution, consulter les tâches infra si leurs effets sont incertains,
notamment la base ciblée par les tests.

Commandes backend déclarées, à lancer depuis backend/ :

    npm run dev
    npm run lint
    npm run typecheck
    npm run test
    npm run build

Commandes mobiles déclarées, à lancer depuis frontend/mobile/ :

    npm run start
    npm run ios
    npm run lint

L’existence d’un script ne garantit pas qu’il fonctionne.
Vérifier ses prérequis et rapporter les erreurs réelles.
Ne pas inventer un script de test ou de typage mobile absent du package.json.

Ne pas exécuter reset-project sans vérifier le script et obtenir une validation.
Ne pas lancer de reset de base, de rollback ou de suppression de volumes
sans avoir identifié la cible et obtenu une validation explicite.

## 6. Architecture et conventions

Faire des changements ciblés, cohérents avec le code existant.

- Garder contrôleurs et resolvers centrés sur le transport et l’orchestration.
- Séparer les règles métier réutilisables des détails HTTP, GraphQL et SQL.
- Ne pas placer toute la logique métier dans les composants React.
- Réutiliser la validation, l’authentification et la gestion d’erreurs existantes.
- Respecter les alias d’import et les conventions ESM du backend.
- Éviter any et les contournements du typage non justifiés.
- Ne pas modifier manuellement les fichiers générés sans vérifier leur mécanisme.
- Préférer des noms explicites et des modules de taille raisonnable.
- Ne pas effectuer de refactor global à l’occasion d’une petite fonctionnalité.

Une séparation domaine/application/infrastructure peut être introduite lorsque
les règles métier la justifient.
Ne pas imposer DDD, CQRS, des events ou des repositories abstraits partout.
Ne pas présenter une architecture envisagée comme déjà implémentée.

## 7. Contrat API et authentification

Répartition retenue :
- REST pour l’authentification.
- GraphQL pour les données métier.

Les tickets font référence à /api/v1 et /graphql.
Vérifier les routes actuelles avant d’implémenter un client.
Respecter les réponses REST et les erreurs GraphQL réellement exposées.

Ne pas réécrire l’authentification existante sans nécessité démontrée.

Règles obligatoires :
- Vérifier le jeton côté serveur pour chaque opération privée.
- Déterminer l’utilisateur depuis le contexte d’authentification.
- Ne jamais accepter un userId client comme preuve de propriété.
- Contrôler l’autorisation à la lecture et à chaque mutation.
- Tester avec au moins deux utilisateurs.
- Refuser les jetons invalides, expirés ou révoqués.
- Ne pas exposer les mots de passe ou leurs hashes.

Pour Google et Apple :
- Vérifier l’identité côté serveur.
- Ne pas se fier uniquement aux données transmises par le mobile.
- Ne pas créer de mot de passe factice pour un compte social.
- Ne pas lier automatiquement des comptes sur la seule égalité d’un email.
- Respecter les décisions de liaison et de session prévues par les tickets.

## 8. Modèle métier

Distinguer explicitement :
- Parfum : fiche du catalogue.
- Concentration : EDT, EDP, Extrait, etc.
- Produit : variante commercialisée, notamment concentration et volume.
- Code-barres : correspondance vérifiée vers un produit.
- Possession : entrée personnelle appartenant à un utilisateur.
- Wishlist : intention personnelle d’acquisition.

Une possession n’est pas une fiche catalogue.

Ne pas inventer les champs, contraintes ou règles non tranchés.

Points à vérifier avant implémentation :
- Possession rattachée à un parfum ou à un produit.
- Gestion de plusieurs flacons identiques.
- Quantité, état et note personnelle.
- Contraintes d’unicité.
- Suppression et intégrité référentielle.

Les données publiques du catalogue et les données personnelles doivent
rester distinctes.

## 9. Collection, wishlist et cohérence

- Un utilisateur ne peut accéder qu’à ses données personnelles.
- Appliquer les règles de doublons validées.
- Protéger aussi les opérations appelées directement via l’API.
- Préserver la cohérence lors d’un transfert wishlist vers collection.
- Utiliser une transaction lorsque plusieurs écritures doivent être atomiques.
- Prévoir les doubles validations et les reprises après timeout.
- Ne pas relancer automatiquement une mutation non idempotente.
- Ne pas afficher un succès avant confirmation ou gestion explicite
  d’un état optimiste et de son éventuel échec.

Ne pas ajouter de synchronisation offline complexe sans tâche dédiée.

## 10. Scan et provenance des données

Le scan interroge d’abord le catalogue interne.

Parcours attendu :
1. Lire le code-barres.
2. Rechercher une correspondance vérifiée.
3. Présenter le produit reconnu.
4. Demander confirmation avant l’ajout.
5. Si le code est inconnu, proposer une recherche manuelle.

Règles :
- Stocker EAN/UPC en texte pour préserver les zéros initiaux.
- Gérer le refus de permission caméra et les lectures répétées.
- Ne pas enregistrer automatiquement une association approximative.
- Une fiche parfum importée ne prouve pas une correspondance code-barres.
- Identifier clairement les codes et données de test.

Pour les imports :
- Préserver la provenance et les références de source.
- Rendre les réimports idempotents.
- Tracer les rejets et mises à jour.
- Ne pas écraser les données personnelles lors d’un import catalogue.


## 11. Sécurité et données

Ne jamais versionner ou journaliser :
- Mots de passe et hashes.
- Jetons de session et credentials OAuth.
- Secrets serveur, clés privées et certificats privés.
- Dumps de base contenant des données personnelles.

Sur mobile :
- Stocker les jetons dans un stockage sécurisé adapté.
- Ne pas embarquer de secret serveur dans l’application.
- Une variable publique Expo ne constitue pas un emplacement secret.
- Une panne réseau ne doit pas effacer une session locale valide.
- Distinguer erreur réseau et refus d’authentification.

Pour les bases et sauvegardes :
- Séparer développement, test et environnement privé.
- Vérifier la base ciblée avant migrations et tests.
- Ne pas restaurer sur la base active pour tester une sauvegarde.
- Éviter tout effet externe depuis un environnement de restauration.
- Prévoir le traitement des sessions après restauration.
- Ne pas réactiver involontairement des jetons révoqués.

Pour la livraison privée :
- Utiliser HTTPS.
- Masquer les données sensibles dans les logs.
- Faire valider les coûts et souscriptions avant engagement.

Ce fichier donne des instructions de travail.
Il ne remplace pas les permissions des outils ni les protections techniques.


## 12. Manière de travailler

Pour chaque tâche :
1. Identifier le périmètre et les critères d’acceptation.
2. Lire les fichiers concernés et les tests existants.
3. Vérifier les prérequis et les hypothèses.
4. Proposer un plan court si le changement touche plusieurs couches.
5. Implémenter le minimum cohérent nécessaire.
6. Ajouter ou adapter les tests.
7. Exécuter les contrôles pertinents.
8. Mettre à jour la documentation affectée.
9. Résumer les changements, vérifications et limites.
10. Ne met jamais claude en co-authored.

Communiquer en français.
Suivre la langue et les conventions existantes pour les identifiants de code.

Ne pas annuler les changements non liés d’un autre développeur.
Ne pas changer une architecture, un contrat API ou une règle métier importante
sans expliquer l’impact et obtenir une validation.

Ne pas effectuer sans validation :
- Commit, push, merge ou force-push.
- Modification des protections de branches.
- Modification d’un ticket Linear.
- Déploiement, souscription ou achat.
- Opération destructive sur les fichiers ou les données.

Si Graphify est disponible, l’utiliser comme aide à la navigation.
Vérifier les relations et conclusions dans le code réel.
Ne pas considérer son index comme nécessairement à jour.

## 14. Tests et définition de terminé

Tests à adapter au périmètre :
- Validation des entrées.
- Cas de succès et cas d’erreur.
- Accès sans authentification.
- Isolation entre deux utilisateurs.
- Pagination et limites serveur.
- Doublons, répétitions et reprise des mutations.
- Contraintes et migrations sur PostgreSQL.
- Chargement, résultat vide et erreur côté mobile.
- Permissions caméra et codes inconnus pour le scan.

Une tâche n’est pas terminée uniquement parce que le code compile.

Avant de déclarer le travail terminé :
- Vérifier les critères d’acceptation.
- Exécuter les contrôles disponibles et pertinents.
- Documenter les contrôles non exécutés et leur raison.
- Signaler les risques, limites et décisions restantes.
- Prévoir la revue croisée de l’autre développeur.
- Indiquer les parcours nécessitant une validation sur les deux iPhone.

Ne jamais déclarer un test réussi s’il n’a pas été exécuté.
Ne pas présenter un contrôle en simulateur comme une validation sur appareil.
Ne pas marquer un ticket terminé automatiquement.

Format du compte rendu :
- Changements effectués.
- Tests et contrôles exécutés, avec leurs résultats.
- Contrôles non exécutés et raisons.
- Limites ou points à valider.