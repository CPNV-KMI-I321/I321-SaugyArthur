import * as Pizza from '../entities/Pizza.js';
import { fail, validateId, validatePizza } from '../validation.js';

export function list(req, res) {
  res.json(Pizza.findAll());
}

export function get(req, res) {
  const id = validateId(req.params.id)
  const pizza = Pizza.findById(id)

  if (pizza===undefined) fail(404, "Pizza introuvable")
  res.json(pizza)
}

export function create(req, res) {
  const data = validatePizza(req.body)

  const pizza = Pizza.create(data)

  res.json(pizza)
}

export function update(req, res) {
  const id = validateId(req.params.id)
  const data = validatePizza(req.body)

  const pizza = Pizza.update(id, data)
  if (pizza === undefined) return fail(404, "Pizza introuvable")
}

export function remove(req, res) {
  const id = validateId(req.params.id)

  const pizza = Pizza.remove(id)
  if (pizza === undefined) return fail(404, "Pizza introuvable")
}
