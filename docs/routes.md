# Routes

| Méthode | Route               | Description                | Succès | Erreurs                   |
| -------- | ------------------- | -------------------------- | ------- | ------------------------- |
| GET      | `/`               | Vérifie que l'API répond | 200     | -                         |
| GET      | `/api/users`      | Liste les utilisateurs     | 200     | 500                       |
| GET      | `/api/pizzas`     | Liste les pizzas           | 200     | 500                       |
| GET      | `/api/pizzas/:id` | Liste une pizza            | 200     | 404, 500                  |
| POST     | `/api/pizzas/`    | Ajouter une pizza          | 201     | 400, 401, 403, 500        |
| PUT      | `/api/pizzas/:id` | Modifier une pizza         | 200     | 400, 401, 403, 404, 500   |
| DELETE   | `/api/pizzas/:id` | Supprimer une pizza        | 204     | 400, 401, 403, 404, 500 |

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
