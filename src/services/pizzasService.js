import { transaction } from '../config/database.js';
import * as Pizza from '../entities/Pizza.js';
import * as PizzaComposition from '../entities/PizzaComposition.js';
import * as ingredientsService from './ingredientsService.js';
import { fail, validateId, validateIngredientIds, validatePizza } from '../validation.js';

function withIngredients(pizza) {
  return { ...pizza, ingredientIds: PizzaComposition.ingredientIds(pizza.id) };
}

function validateInput(body) {
  const data = validatePizza(body);
  const ingredientIds = validateIngredientIds(body.ingredientIds);
  return { data, ingredientIds };
}

function ensureNameAvailable(name, currentId = null) {
  const existing = Pizza.findByName(name);
  if (existing && existing.id !== currentId) fail(409, 'Une pizza porte déjà ce nom.');
}

export function list() {
  return Pizza.findAll().map(withIngredients);
}

export function get(id) {
  const pizza = Pizza.findById(validateId(id));
  if (!pizza) fail(404, 'Pizza introuvable.');
  return withIngredients(pizza);
}

export function create(body) {
  const { data, ingredientIds } = validateInput(body);
  return transaction(() => {
    ingredientsService.ensureExist(ingredientIds);
    ensureNameAvailable(data.name);
    const pizza = Pizza.create(data);
    PizzaComposition.replace(pizza.id, ingredientIds);
    return withIngredients(pizza);
  });
}

export function update(id, body) {
  const pizzaId = validateId(id);
  const { data, ingredientIds } = validateInput(body);
  return transaction(() => {
    if (!Pizza.findById(pizzaId)) fail(404, 'Pizza introuvable.');
    ingredientsService.ensureExist(ingredientIds);
    ensureNameAvailable(data.name, pizzaId);
    const pizza = Pizza.update(pizzaId, data);
    PizzaComposition.replace(pizzaId, ingredientIds);
    return withIngredients(pizza);
  });
}

export function remove(id) {
  if (!Pizza.remove(validateId(id))) fail(404, 'Pizza introuvable.');
}