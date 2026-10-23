# Outils de développement

Les tâches du projet utilisent [Invoke](https://www.pyinvoke.org/). Depuis la
racine du dépôt, créer un environnement virtuel, l'activer, puis installer
l'outil et afficher les tâches disponibles :

```sh
python3 -m venv infra/.venv
source infra/.venv/bin/activate
python -m pip install -e infra
inv -r infra --list
```

Les commandes Invoke créent automatiquement `backend/.env` à partir de
`backend/.env.example` et génèrent une `APP_KEY` locale si ce fichier n'existe
pas. Pour le faire immédiatement sans lancer une autre tâche :

```sh
inv -r infra install
```

Si `infra/.venv` existe déjà mais que `inv` renvoie une erreur
`bad interpreter`, l'environnement a probablement été créé dans un autre
emplacement. Il peut être régénéré avec :

```sh
python3 -m venv --clear infra/.venv
source infra/.venv/bin/activate
python -m pip install -e infra
```

## Tâches principales

| Commande | Action |
| --- | --- |
| `inv -r infra install` | Installe les dépendances backend et mobile |
| `inv -r infra build` | Construit le backend AdonisJS |
| `inv -r infra test` | Lance les tests du backend |
| `inv -r infra check` | Lance lint, vérification des types, tests et build |
| `inv -r infra backend` | Lance le backend en mode développement |
| `inv -r infra mobile` | Lance le serveur Expo |

## Docker

Les fichiers Docker sont regroupés dans `infra/docker/` :

```sh
inv -r infra docker-build
APP_KEY='une-cle-adonis-valide' inv -r infra docker-up
inv -r infra docker-logs
inv -r infra docker-down
```

Le port publié est `3333`; il peut être changé avec `BACKEND_PORT`.

## Base de données et migrations

PostgreSQL est la base cible du MVP. Le service `postgres` de
`infra/docker/compose.yml` la fournit en local (utilisateur, mot de passe et
base `odorem` par défaut, port `5432`).

### Démarrer la base uniquement

```sh
docker compose -f infra/docker/compose.yml up -d postgres
```

Les données persistent dans le volume Docker `postgres_data`.

### Tests

`inv -r infra test` démarre le service `postgres` si besoin et exécute la
suite backend contre PostgreSQL, sur une base dédiée `odorem_test` (créée
automatiquement si absente). Ne jamais utiliser la base de développement pour
les tests.

### Configurer le backend

Créer `backend/.env` (non versionné) à partir de `backend/.env.example`, puis
renseigner :

```env
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=odorem
DB_PASSWORD=odorem
DB_DATABASE=odorem
```

Générer la clé applicative si `APP_KEY` est vide :

```sh
cd backend
node ace.js generate:key
```

### Jouer les migrations

Depuis `backend/` :

```sh
node ace.js migration:run        # applique les migrations en attente
node ace.js migration:status     # affiche l'état des migrations
node ace.js migration:rollback   # annule le dernier batch (dev uniquement)
```

`migration:run` crée les tables de suivi `adonis_schema` et
`adonis_schema_versions` au premier passage, puis régénère automatiquement
les classes de schéma après chaque exécution.

Règle : une seule migration de création par table. Avant d'en ajouter une,
vérifier qu'aucune migration existante ne crée déjà cette table. Tout
rollback, reset ou suppression de volume nécessite une validation explicite
et une cible identifiée (voir CLAUDE.md).
