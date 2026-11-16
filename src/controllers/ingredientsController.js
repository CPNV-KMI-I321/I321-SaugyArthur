import * as ingredientsService from '../services/ingredientsService.js';

export function list(req, res) {
  res.json(ingredientsService.list());
}

export function get(req, res) {
  res.json(ingredientsService.get(req.params.id));
}

export function create(req, res) {
  const ingredient = ingredientsService.create(req.body);
  res.location(`/api/ingredients/${ingredient.id}`).status(201).json(ingredient);
}

export function update(req, res) {
  res.json(ingredientsService.update(req.params.id, req.body));
}

export function remove(req, res) {
  ingredientsService.remove(req.params.id);
  res.sendStatus(204);
}