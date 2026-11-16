import * as Ingredient from '../entities/Ingredient.js';
import * as PizzaComposition from '../entities/PizzaComposition.js';
import { fail, validateId, validateIngredient } from '../validation.js';

export function list() {
  return Ingredient.findAll();
}

export function get(id) {
  const ingredient = Ingredient.findById(validateId(id));
  if (!ingredient) fail(404, 'Ingrédient introuvable.');
  return ingredient;
}

export function create(body) {
  return Ingredient.create(validateIngredient(body));
}

export function update(id, body) {
  const ingredientId = get(id).id;
  return Ingredient.update(ingredientId, validateIngredient(body));
}

export function remove(id) {
  const ingredientId = get(id).id;
  if (PizzaComposition.isUsed(ingredientId)) {
    fail(409, 'Ingrédient utilisé par au moins une pizza.');
  }
  Ingredient.remove(ingredientId);
}

export function ensureExist(ids) {
  const missing = ids.filter(id => !Ingredient.findById(id));
  if (missing.length > 0) {
    fail(400, `Ingrédient(s) introuvable(s) : ${missing.join(', ')}.`);
  }
}