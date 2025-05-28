import Database from "better-sqlite3";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'blog.sqlite');

const db = new Database(dbPath);

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
)`).run();

export const getAllUsers = () => db.prepare(`SELECT * FROM users`).all();
export const getUserById = (id) => db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
export const addUser = (name, email) => db.prepare(`INSERT INTO users (name, email) VALUES (?, ?)`).run(name, email);
export const updateUser = (id, name, email) => db.prepare(`UPDATE users SET name = ?, email = ? WHERE id = ?`).run(name, email, id);
export const deleteUser = (id) => {
    db.prepare(`DELETE FROM blogs WHERE author_id = ?`).run(id);
    return db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
};

export const getAllBlogs = () => {
    return db.prepare(`
        SELECT blogs.*, users.name as author_name, users.email as author_email 
        FROM blogs 
        JOIN users ON blogs.author_id = users.id 
        ORDER BY blogs.updated_at DESC
    `).all();
};

export const getBlogById = (id) => {
    return db.prepare(`
        SELECT blogs.*, users.name as author_name, users.email as author_email 
        FROM blogs 
        JOIN users ON blogs.author_id = users.id 
        WHERE blogs.id = ?
    `).get(id);
};

export const addBlog = (author_id, title, category, content) => {
    return db.prepare(`
        INSERT INTO blogs (author_id, title, category, content) 
        VALUES (?, ?, ?, ?)
    `).run(author_id, title, category, content);
};

export const updateBlog = (id, title, category, content) => {
    return db.prepare(`
        UPDATE blogs 
        SET title = ?, category = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `).run(title, category, content, id);
};

export const deleteBlog = (id) => db.prepare(`DELETE FROM blogs WHERE id = ?`).run(id);

const initSampleData = () => {
    const userCount = db.prepare(`SELECT COUNT(*) as count FROM users`).get().count;
    
    if (userCount === 0) {
        const users = [
            { name: 'Kovács János', email: 'kovacs.janos@email.com' },
            { name: 'Nagy Anna', email: 'nagy.anna@email.com' },
            { name: 'Kiss Péter', email: 'kiss.peter@email.com' }
        ];
        
        users.forEach(user => {
            addUser(user.name, user.email);
        });
        
        const blogs = [
            {
                author_id: 1,
                title: 'Első blog bejegyzésem',
                category: 'Személyes',
                content: 'Ez az első blog bejegyzésem. Nagyon izgatott vagyok, hogy elkezdem a blogolást!'
            },
            {
                author_id: 1,
                title: 'JavaScript tippek kezdőknek',
                category: 'Programozás',
                content: 'A JavaScript egy nagyszerű nyelv kezdőknek. Itt vannak néhány hasznos tippek...'
            },
            {
                author_id: 2,
                title: 'Kedvenc receptjeim',
                category: 'Főzés',
                content: 'Ma megosztom veletek a kedvenc receptjeimet. Kezdjük a gulyással...'
            },
            {
                author_id: 2,
                title: 'Egészséges életmód tippek',
                category: 'Egészség',
                content: 'Az egészséges életmód fontossága nem vitatható. Itt vannak néhány praktikus tanácsok...'
            },
            {
                author_id: 3,
                title: 'Utazási élményeim',
                category: 'Utazás',
                content: 'A múlt héten Párizsban jártam. Elmondhatatlanul szép város volt...'
            },
            {
                author_id: 3,
                title: 'Könyvajánló',
                category: 'Kultúra',
                content: 'Nemrég olvastam el egy fantasztikus könyvet, amit mindenkinek ajánlok...'
            }
        ];
        
        blogs.forEach(blog => {
            addBlog(blog.author_id, blog.title, blog.category, blog.content);
        });
        
        updateBlog(1, 'Első blog bejegyzésem (frissítve)', 'Személyes', 'Ez az első blog bejegyzésem. Nagyon izgatott vagyok, hogy elkezdem a blogolást! FRISSÍTÉS: Most már több tapasztalatom van!');
        updateBlog(3, 'Kedvenc receptjeim (bővítve)', 'Főzés', 'Ma megosztom veletek a kedvenc receptjeimet. Kezdjük a gulyással...');
        
        console.log('Sample data initialized successfully!');
    }
};

initSampleData();

export default db;
