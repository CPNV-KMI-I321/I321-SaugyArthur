# I321-SaugyArthur

Implémentation d'un backend avec express


## Routes



| Méthode | Route          | Description                | Succès | Erreurs |
| -------- | -------------- | -------------------------- | ------- | ------- |
| GET      | `/`          | Vérifie que l'API répond | 200     | -       |
| GET      | `/api/users` | Liste les utilisateurs     | 200     | 500     |

Toute route inexistante renvoie une erreur `404 Not Found`.


### GET `/api/users`

Renvoie la liste des utilisateurs.

Réponse `200 OK` :

```json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
```

Réponse `500 Internal Server Error` :

```json
{
  "error": "Une erreur interne est survenue"
}
```
