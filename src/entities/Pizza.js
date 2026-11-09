import { db } from '../config/database.js';

export function findAll() {
  return db.prepare('SELECT * FROM pizzas ORDER BY id').all();
}

export function findById(id) {
  return db.prepare('SELECT * FROM pizzas WHERE id=?').get(id)
}

export function create(data) {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO pizzas(name, description, price, imageUrl) VALUES (?, ?, ?, ?)')
    .run(data.name, data.description, data.price, data.imageUrl)
  return findById(lastInsertRowid)
}

export function update(id, data) {
  const { changes } = db
    .prepare('UPDATE pizzas SET name=?, description=?, price=?, imageUrl=? WHERE id=?')
    .run(data.name, data.description, data.price, data.imageUrl, id)
  if (changes > 0) {
    return findById(id)
  } else {
    return undefined
  }
}

export function remove(id) {
  const { changes } = db.prepare('DELETE FROM pizzas WHERE id=?').run(id)
  return changes > 0
}
