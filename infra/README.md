# Outils de développement

Les tâches du projet utilisent [Invoke](https://www.pyinvoke.org/). Depuis la
racine du dépôt, installer l'outil puis afficher les tâches disponibles :

```sh
python3 -m pip install -e core
inv -r core --list
```

## Tâches principales

| Commande | Action |
| --- | --- |
| `inv -r core install` | Installe les dépendances backend et mobile |
| `inv -r core build` | Construit le backend AdonisJS |
| `inv -r core test` | Lance les tests du backend |
| `inv -r core check` | Lance lint, vérification des types, tests et build |
| `inv -r core backend` | Lance le backend en mode développement |
| `inv -r core mobile` | Lance le serveur Expo |

## Docker

Les fichiers Docker sont regroupés dans `core/docker/` :

```sh
inv -r core docker-build
APP_KEY='une-cle-adonis-valide' inv -r core docker-up
inv -r core docker-logs
inv -r core docker-down
```

Le conteneur utilise la base SQLite configurée par défaut dans le backend et
conserve `backend/tmp` dans un volume Docker. Le port publié est `3333`; il peut
être changé avec `BACKEND_PORT`.
