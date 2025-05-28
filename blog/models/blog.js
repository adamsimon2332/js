import * as db from '../util/database.js';

export const initializeDatabase = async () => {
    console.log('Blog database initialized');
};

export const getUsers = () => db.getAllUsers();
export const getUser = (id) => db.getUserById(id);
export const createUser = (name, email) => db.addUser(name, email);
export const updateUser = (id, name, email) => db.updateUser(id, name, email);
export const removeUser = (id) => db.deleteUser(id);

export const getBlogs = () => db.getAllBlogs();
export const getBlog = (id) => db.getBlogById(id);
export const createBlog = (author_id, title, category, content) => db.addBlog(author_id, title, category, content);
export const updateBlog = (id, title, category, content) => db.updateBlog(id, title, category, content);
export const removeBlog = (id) => db.deleteBlog(id);
