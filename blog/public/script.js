// Global variables
let blogs = [];
let users = [];
let currentEditingBlog = null;

// DOM elements
const blogSection = document.getElementById('blogSection');
const createSection = document.getElementById('createSection');
const editSection = document.getElementById('editSection');
const usersSection = document.getElementById('usersSection');
const editUserSection = document.getElementById('editUserSection');

const showBlogsBtn = document.getElementById('showBlogsBtn');
const showCreateBtn = document.getElementById('showCreateBtn');
const showUsersBtn = document.getElementById('showUsersBtn');

const blogList = document.getElementById('blogList');
const userList = document.getElementById('userList');

const createBlogForm = document.getElementById('createBlogForm');
const editBlogForm = document.getElementById('editBlogForm');
const createUserForm = document.getElementById('createUserForm');
const editUserForm = document.getElementById('editUserForm');

const authorSelect = document.getElementById('authorSelect');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const cancelEditUserBtn = document.getElementById('cancelEditUserBtn');

const loading = document.getElementById('loading');
const toast = document.getElementById('toast');

showBlogsBtn.addEventListener('click', () => showSection('blog'));
showCreateBtn.addEventListener('click', () => showSection('create'));
showUsersBtn.addEventListener('click', () => showSection('users'));
cancelEditBtn.addEventListener('click', () => showSection('blog'));
cancelEditUserBtn.addEventListener('click', () => showSection('users'));

createBlogForm.addEventListener('submit', handleCreateBlog);
editBlogForm.addEventListener('submit', handleEditBlog);
createUserForm.addEventListener('submit', handleCreateUser);
editUserForm.addEventListener('submit', handleEditUser);

function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    switch(section) {
        case 'blog':
            blogSection.classList.add('active');
            showBlogsBtn.classList.add('active');
            loadBlogs();
            break;
        case 'create':
            createSection.classList.add('active');
            showCreateBtn.classList.add('active');
            loadUsers();
            break;        case 'edit':
            editSection.classList.add('active');
            break;
        case 'editUser':
            editUserSection.classList.add('active');
            break;
        case 'users':
            usersSection.classList.add('active');
            showUsersBtn.classList.add('active');
            loadUsers();
            break;
    }
}

async function apiCall(url, options = {}) {
    showLoading();
    try {
        const response = await fetch(`/api${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API hiba történt');
        }
        
        return data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function loadBlogs() {
    try {
        blogs = await apiCall('/blogs');
        renderBlogs();
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
}

async function loadUsers() {
    try {
        users = await apiCall('/users');
        renderUsers();
        populateAuthorSelect();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderBlogs() {
    if (blogs.length === 0) {
        blogList.innerHTML = '<p class="no-data">Még nincsenek blog bejegyzések.</p>';
        return;
    }
    
    blogList.innerHTML = blogs.map(blog => `
        <div class="blog-item">
            <div class="blog-header">
                <h3 class="blog-title">${escapeHtml(blog.title)}</h3>
                <span class="blog-category">${escapeHtml(blog.category)}</span>
            </div>
            <div class="blog-meta">
                <span><strong>Szerző:</strong> ${escapeHtml(blog.author_name)}</span>
                <span><strong>Létrehozva:</strong> ${formatDate(blog.created_at)}</span>
                <span><strong>Módosítva:</strong> ${formatDate(blog.updated_at)}</span>
            </div>
            <div class="blog-content">${escapeHtml(blog.content)}</div>
            <div class="blog-actions">
                <button class="btn btn-edit" onclick="editBlog(${blog.id})">Szerkesztés</button>
                <button class="btn btn-delete" onclick="deleteBlog(${blog.id})">Törlés</button>
            </div>
        </div>
    `).join('');
}

function renderUsers() {
    if (users.length === 0) {
        userList.innerHTML = '<p class="no-data">Még nincsenek felhasználók.</p>';
        return;
    }
    
    userList.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-info">
                <h4>${escapeHtml(user.name)}</h4>
                <p>${escapeHtml(user.email)}</p>
            </div>
            <div class="user-actions">
                <button class="btn btn-edit" onclick="editUser(${user.id})">Szerkesztés</button>
                <button class="btn btn-delete" onclick="deleteUser(${user.id})">Törlés</button>
            </div>
        </div>
    `).join('');
}

function populateAuthorSelect() {
    authorSelect.innerHTML = '<option value="">Válassz szerzőt...</option>' +
        users.map(user => `<option value="${user.id}">${escapeHtml(user.name)}</option>`).join('');
}

async function handleCreateBlog(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const blogData = {
        author_id: parseInt(document.getElementById('authorSelect').value),
        title: document.getElementById('titleInput').value,
        category: document.getElementById('categoryInput').value,
        content: document.getElementById('contentInput').value
    };
    
    try {
        await apiCall('/blogs', {
            method: 'POST',
            body: JSON.stringify(blogData)
        });
        
        showToast('Blog bejegyzés sikeresen létrehozva!');
        createBlogForm.reset();
        showSection('blog');
    } catch (error) {
        console.error('Error creating blog:', error);
    }
}

async function editBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;
    
    currentEditingBlog = blog;
    
    document.getElementById('editBlogId').value = blog.id;
    document.getElementById('editTitleInput').value = blog.title;
    document.getElementById('editCategoryInput').value = blog.category;
    document.getElementById('editContentInput').value = blog.content;
    
    showSection('edit');
}

async function handleEditBlog(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editBlogId').value);
    const blogData = {
        title: document.getElementById('editTitleInput').value,
        category: document.getElementById('editCategoryInput').value,
        content: document.getElementById('editContentInput').value
    };
    
    try {
        await apiCall(`/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(blogData)
        });
        
        showToast('Blog bejegyzés sikeresen frissítve!');
        showSection('blog');
    } catch (error) {
        console.error('Error updating blog:', error);
    }
}

async function deleteBlog(id) {
    if (!confirm('Biztosan törölni szeretnéd ezt a blog bejegyzést?')) return;
    
    try {
        await apiCall(`/blogs/${id}`, { method: 'DELETE' });
        showToast('Blog bejegyzés sikeresen törölve!');
        loadBlogs();
    } catch (error) {
        console.error('Error deleting blog:', error);
    }
}

async function handleCreateUser(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('userNameInput').value,
        email: document.getElementById('userEmailInput').value
    };
    
    try {
        await apiCall('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        showToast('Felhasználó sikeresen létrehozva!');
        createUserForm.reset();
        loadUsers();
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('Biztosan törölni szeretnéd ezt a felhasználót?\n\nFIGYELEM: A felhasználó összes blog bejegyzése is törölve lesz!')) return;
    
    try {
        await apiCall(`/users/${id}`, { method: 'DELETE' });
        showToast('Felhasználó sikeresen törölve!');
        loadUsers();
        if (blogSection.classList.contains('active')) {
            loadBlogs();
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserNameInput').value = user.name;
    document.getElementById('editUserEmailInput').value = user.email;
    
    showSection('editUser');
}

async function handleEditUser(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editUserId').value);
    const userData = {
        name: document.getElementById('editUserNameInput').value,
        email: document.getElementById('editUserEmailInput').value
    };
    
    try {
        await apiCall(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
        
        showToast('Felhasználó sikeresen frissítve!');
        showSection('users');
        if (blogSection.classList.contains('active')) {
            loadBlogs();
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('blog');
});
