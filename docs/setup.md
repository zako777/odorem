# Outils de développement

Les tâches du projet utilisent [Invoke](https://www.pyinvoke.org/). Depuis la
racine du dépôt, installer l'outil puis afficher les tâches disponibles :

```sh
python3 -m pip install -e infra
inv -r infra --list
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

Le conteneur utilise la base SQLite configurée par défaut dans le backend et
conserve `backend/tmp` dans un volume Docker. Le port publié est `3333`; il peut
être changé avec `BACKEND_PORT`.
