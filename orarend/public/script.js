const API_URL = 'http://localhost:3001/api';
const DAYS = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];
const MAX_HOURS = 8;
// Define character limits
const MAX_SUBJECT_LENGTH = 20;
const MAX_TEACHER_LENGTH = 30;
const MAX_ROOM_LENGTH = 10;

const timetableElement = document.getElementById('timetable');
const addEntryButton = document.getElementById('add-entry-btn');
const entryModal = document.getElementById('entry-modal');
const confirmModal = document.getElementById('confirm-modal');
const modalTitle = document.getElementById('modal-title');
const closeModalButton = document.querySelector('.close');
const entryForm = document.getElementById('entry-form');
const cancelButton = document.getElementById('cancel-btn');
const confirmYesButton = document.getElementById('confirm-yes');
const confirmNoButton = document.getElementById('confirm-no');

let timetableData = [];
let currentEntryId = null;
let deleteCallback = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchTimetableData();
    setupEventListeners();
});

async function fetchTimetableData() {
    try {
        const response = await fetch(`${API_URL}/entries`);
        if (!response.ok) throw new Error('Hiba az órarend lekérésénél');

        timetableData = await response.json();
        renderTimetable();
    } catch (error) {
        console.error('Hiba az órarend lekérésénél:', error);
        showNotification('Hiba történt az adatok betöltése közben', 'error');
    }
}

function renderTimetable() {
    const tbody = timetableElement.querySelector('tbody');
    tbody.innerHTML = '';

    for (let hour = 1; hour <= MAX_HOURS; hour++) {
        const row = document.createElement('tr');
        
        const hourCell = document.createElement('th');
        hourCell.textContent = `${hour}. óra`;
        row.appendChild(hourCell);

        for (const day of DAYS) {
            const cell = document.createElement('td');
            const entries = timetableData.filter(entry => entry.day === day && entry.hour === hour);

            if (entries.length > 0) {
                entries.forEach(entry => {
                    const entryElement = createEntryElement(entry);
                    cell.appendChild(entryElement);
                });
            }

            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
}

function createEntryElement(entry) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'class-entry';
    entryDiv.dataset.id = entry.id;
    
    const subjectDiv = document.createElement('div');
    subjectDiv.className = 'subject';
    subjectDiv.textContent = truncateText(entry.subject, MAX_SUBJECT_LENGTH);
    subjectDiv.title = entry.subject; // Add title for hover text with full content
    entryDiv.appendChild(subjectDiv);
    
    if (entry.teacher) {
        const teacherDiv = document.createElement('div');
        teacherDiv.className = 'teacher';
        teacherDiv.textContent = truncateText(entry.teacher, MAX_TEACHER_LENGTH);
        teacherDiv.title = entry.teacher; // Add title for hover text with full content
        entryDiv.appendChild(teacherDiv);
    }
    
    if (entry.room) {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';
        roomDiv.textContent = `Terem: ${truncateText(entry.room, MAX_ROOM_LENGTH)}`;
        roomDiv.title = `Terem: ${entry.room}`; // Add title for hover text with full content
        entryDiv.appendChild(roomDiv);
    }
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'class-actions';
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = 'Szerkesztés';
    editButton.addEventListener('click', () => openEditModal(entry));
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Törlés';
    deleteButton.addEventListener('click', () => openDeleteConfirmation(entry.id));
    
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    entryDiv.appendChild(actionsDiv);
    
    return entryDiv;
}

// Add a helper function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function setupEventListeners() {
    addEntryButton.addEventListener('click', openAddModal);
    
    closeModalButton.addEventListener('click', closeModal);
    
    cancelButton.addEventListener('click', closeModal);
    
    entryForm.addEventListener('submit', handleFormSubmit);
    
    confirmYesButton.addEventListener('click', handleConfirmYes);
    confirmNoButton.addEventListener('click', closeConfirmModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === entryModal) closeModal();
        if (e.target === confirmModal) closeConfirmModal();
    });
    
    // Add maxlength attributes to input fields
    document.getElementById('subject').setAttribute('maxlength', MAX_SUBJECT_LENGTH);
    document.getElementById('teacher').setAttribute('maxlength', MAX_TEACHER_LENGTH);
    document.getElementById('room').setAttribute('maxlength', MAX_ROOM_LENGTH);
    
    // Add input validation
    document.getElementById('subject').addEventListener('input', function() {
        validateFieldLength(this, MAX_SUBJECT_LENGTH);
    });
    
    document.getElementById('teacher').addEventListener('input', function() {
        validateFieldLength(this, MAX_TEACHER_LENGTH);
    });
    
    document.getElementById('room').addEventListener('input', function() {
        validateFieldLength(this, MAX_ROOM_LENGTH);
    });
}

// Add a validation function
function validateFieldLength(field, maxLength) {
    if (field.value.length > maxLength) {
        field.value = field.value.substring(0, maxLength);
        showNotification(`A mező maximális hossza ${maxLength} karakter`, 'warning');
    }
}

function openAddModal() {
    modalTitle.textContent = 'Új óra hozzáadása';
    entryForm.reset();
    document.getElementById('entry-id').value = '';
    currentEntryId = null;
    entryModal.style.display = 'block';
}

function openEditModal(entry) {
    modalTitle.textContent = 'Óra szerkesztése';
    
    document.getElementById('entry-id').value = entry.id;
    document.getElementById('day').value = entry.day;
    document.getElementById('hour').value = entry.hour;
    document.getElementById('subject').value = entry.subject;
    document.getElementById('teacher').value = entry.teacher || '';
    document.getElementById('room').value = entry.room || '';
    
    currentEntryId = entry.id;
    entryModal.style.display = 'block';
}

function openDeleteConfirmation(entryId) {
    currentEntryId = entryId;
    deleteCallback = handleDeleteEntry;
    document.getElementById('confirm-message').textContent = 'Biztosan törölni szeretnéd ezt az órát?';
    confirmModal.style.display = 'block';
}

function closeModal() {
    entryModal.style.display = 'none';
}

function closeConfirmModal() {
    confirmModal.style.display = 'none';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const entryData = {
        day: document.getElementById('day').value,
        hour: parseInt(document.getElementById('hour').value),
        subject: document.getElementById('subject').value,
        teacher: document.getElementById('teacher').value,
        room: document.getElementById('room').value
    };
    
    if (currentEntryId) {
        await updateEntry(currentEntryId, entryData);
    } else {
        await addEntry(entryData);
    }
    
    closeModal();
}

function handleConfirmYes() {
    if (deleteCallback) deleteCallback();
    closeConfirmModal();
}

async function addEntry(entryData) {
    try {
        const response = await fetch(`${API_URL}/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entryData)
        });
        
        if (!response.ok) throw new Error('Hiba az új óra hozzáadásánál');
        
        const newEntry = await response.json();
        timetableData.push(newEntry);
        renderTimetable();
        showNotification('Óra sikeresen hozzáadva', 'success');
    } catch (error) {
        console.error('Hiba az új óra hozzáadásánál:', error);
        showNotification('Hiba történt az óra hozzáadása közben, már van ebben az időpontban óra', 'error');
    }
}

async function updateEntry(id, entryData) {
    try {
        const response = await fetch(`${API_URL}/entries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entryData)
        });
        
        if (!response.ok) throw new Error('Hiba az óra frissítésénél');
        
        const updatedEntry = await response.json();
        const index = timetableData.findIndex(entry => entry.id === updatedEntry.id);
        if (index !== -1) timetableData[index] = updatedEntry;
        
        renderTimetable();
        showNotification('Óra sikeresen frissítve', 'success');
    } catch (error) {
        console.error('Hiba az óra frissítésénél:', error);
        showNotification('Hiba történt az óra frissítése közben', 'error');
    }
}

async function handleDeleteEntry() {
    if (!currentEntryId) return;
    
    try {
        const response = await fetch(`${API_URL}/entries/${currentEntryId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Hiba az óra törlésénél');
        
        timetableData = timetableData.filter(entry => entry.id !== currentEntryId);
        renderTimetable();
        showNotification('Óra sikeresen törölve', 'success');
    } catch (error) {
        console.error('Hiba az óra törlésénél:', error);
        showNotification('Hiba történt az óra törlése közben', 'error');
    }
}

function showNotification(message) {
    alert(message);
}