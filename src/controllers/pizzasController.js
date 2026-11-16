import * as pizzasService from '../services/pizzasService.js';

export function list(req, res) {
  res.json(pizzasService.list());
}

export function get(req, res) {
  res.json(pizzasService.get(req.params.id));
}

export function create(req, res) {
  const pizza = pizzasService.create(req.body);
  res.location(`/api/pizzas/${pizza.id}`).status(201).json(pizza);
}

export function update(req, res) {
  res.json(pizzasService.update(req.params.id, req.body));
}

export function remove(req, res) {
  pizzasService.remove(req.params.id);
  res.sendStatus(204);
}