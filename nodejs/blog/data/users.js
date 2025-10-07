import { db } from "./db.js";

export const getUsers = () => db.prepare("SELECT * FROM users").all();

export const getUserById = (id) =>
  db.prepare("SELECT * FROM users WHERE id = ?").get(id);

export const saveUser = (name, email, password) =>
  db
    .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
    .run(name, email, password);

export const updateUser = (id, name, email, password) =>
  db
    .prepare("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?")
    .run(name, email, password, id);

export const deleteUser = (id) =>
  db.prepare("DELETE FROM users WHERE id = ?").run(id);