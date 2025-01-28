const apiBase = 'https://vvri.pythonanywhere.com/api/courses';
const apiStudents = 'https://vvri.pythonanywhere.com/api/students';

const showCoursesBtn = document.getElementById('showCourses');
const showStudentsBtn = document.getElementById('showStudents');
const formContainer = document.getElementById('formContainer');
const sectionTitle = document.getElementById('sectionTitle');
const itemsList = document.getElementById('itemsList');

showCoursesBtn.addEventListener('click', () => {
    sectionTitle.textContent = 'Kurzusok';
    loadItems('courses');
    createForm('courses');
});

showStudentsBtn.addEventListener('click', () => {
    sectionTitle.textContent = 'Diákok';
    loadItems('students');
    createForm('students');
});

async function loadItems(type) {
    itemsList.innerHTML = '';
    const url = type === 'courses' ? apiBase : apiStudents;
    const response = await fetch(url);
    const data = await response.json();
    
    data.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.textContent = `${item.name || item.student_name}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Törlés';
        deleteBtn.addEventListener('click', () => deleteItem(type, item.id));
        
        itemElement.appendChild(deleteBtn);
        itemsList.appendChild(itemElement);
    });
}

function createForm(type) {
    if (type === 'courses') {
        formContainer.innerHTML = `
            <h3>Új ${type.slice(0, -1)} hozzáadása</h3>
            <input type="text" id="itemName" placeholder="Kurzus neve" required />
            <button id="addItemBtn">Hozzáadás</button>
        `;
    } else if (type === 'students') {
        formContainer.innerHTML = `
            <h3>Új diák hozzáadása</h3>
            <input type="text" id="studentName" placeholder="Diák neve" required />
            <button id="addItemBtn">Hozzáadás</button>
        `;
    }

    const addItemBtn = document.getElementById('addItemBtn');
    const itemNameInput = document.getElementById(type === 'courses' ? 'itemName' : 'studentName');

    addItemBtn.addEventListener('click', () => {
        const name = itemNameInput.value;
        if (name) {
            addItem(type, name);
        }
    });
}

async function addItem(type, name) {
    const url = type === 'courses' ? apiBase : apiStudents;
    const body = type === 'courses' 
        ? JSON.stringify({ name: name })
        : JSON.stringify({ name: name });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(`Hiba: ${responseData.message || 'Ismeretlen hiba'}`);
        }

        loadItems(type);
    } catch (error) {
        console.error('Hiba történt a diák hozzáadásakor:', error);
        alert('Hiba történt a diák hozzáadásakor. Ellenőrizd az adatokat.');
    }
}

async function deleteItem(type, id) {
    const url = type === 'courses' ? `${apiBase}/${id}` : `${apiStudents}/${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
    });

    if (response.ok) {
        loadItems(type);
    } else {
        alert('Hiba történt a törlés során');
    }
}
