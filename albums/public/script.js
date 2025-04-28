const API_URL = '/api/albums';

let currentAlbumId = null;

async function loadAlbums() {
  try {
    const albumList = document.getElementById('albumList');
    albumList.innerHTML = '<div class="loading">Betöltés...</div>';
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const albums = await response.json();
    displayAlbums(albums);
  } catch (error) {
    showError('Hiba történt az albumok betöltésekor', error);
  }
}

async function fetchAlbum(id) {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return await response.json();
}

async function createAlbum(albumData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(albumData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return await response.json();
}

async function updateAlbum(id, albumData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(albumData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return await response.json();
}

async function deleteAlbum(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return await response.json();
}

function showSection(section) {
  const albumListSection = document.getElementById('albumListSection');
  const addAlbumSection = document.getElementById('addAlbumSection');
  const viewAlbumSection = document.getElementById('viewAlbumSection');
  const editAlbumSection = document.getElementById('editAlbumSection');
  
  const listAlbumsBtn = document.getElementById('listAlbumsBtn');
  const addAlbumBtn = document.getElementById('addAlbumBtn');

  albumListSection.classList.add('hidden');
  addAlbumSection.classList.add('hidden');
  viewAlbumSection.classList.add('hidden');
  editAlbumSection.classList.add('hidden');
  
  section.classList.remove('hidden');
  
  listAlbumsBtn.classList.remove('active');
  addAlbumBtn.classList.remove('active');
  
  if (section === albumListSection) {
    listAlbumsBtn.classList.add('active');
    loadAlbums();
  } else if (section === addAlbumSection) {
    addAlbumBtn.classList.add('active');
    document.getElementById('addAlbumForm').reset();
  }
  
  hideDeleteConfirmation();
}

function displayAlbums(albums) {
  const albumList = document.getElementById('albumList');
  
  if (albums.length === 0) {
    albumList.innerHTML = '<p class="no-albums">Nincsenek albumok. Adj hozzá egy új albumot!</p>';
    return;
  }
  
  albumList.innerHTML = '';
  
  albums.forEach(album => {
    const albumCard = document.createElement('div');
    albumCard.className = 'album-card';
    albumCard.innerHTML = `
      <h3>${album.band}</h3>
      <p class="album-title">${album.title}</p>
      ${album.releaseYear ? `<p>Kiadás éve: ${album.releaseYear}</p>` : ''}
      ${album.genre ? `<p>Műfaj: ${album.genre}</p>` : ''}
    `;
    
    albumCard.addEventListener('click', () => viewAlbum(album.id));
    
    albumList.appendChild(albumCard);
  });
}

async function viewAlbum(id) {
  try {
    const album = await fetchAlbum(id);
    
    currentAlbumId = album.id;
    
    const albumDetails = document.getElementById('albumDetails');
    albumDetails.innerHTML = `
      <h3>${album.band} - ${album.title}</h3>
      <p><span class="label">Azonosító:</span> ${album.id}</p>
      <p><span class="label">Zenekar:</span> ${album.band}</p>
      <p><span class="label">Album címe:</span> ${album.title}</p>
      <p><span class="label">Kiadás éve:</span> ${album.releaseYear || 'Nincs megadva'}</p>
      <p><span class="label">Műfaj:</span> ${album.genre || 'Nincs megadva'}</p>
      <p><span class="label">Létrehozva:</span> ${new Date(album.created_at).toLocaleString()}</p>
    `;
    
    showSection(document.getElementById('viewAlbumSection'));
  } catch (error) {
    showError('Hiba történt az album adatainak betöltésekor', error);
  }
}

function fillEditForm(album) {
  document.getElementById('editAlbumId').value = album.id;
  document.getElementById('editBand').value = album.band;
  document.getElementById('editTitle').value = album.title;
  document.getElementById('editReleaseYear').value = album.releaseYear || '';
  document.getElementById('editGenre').value = album.genre || '';
}

function showDeleteConfirmation() {
  const deleteModal = document.getElementById('deleteModal');
  const modalOverlay = document.getElementById('modalOverlay');
  
  deleteModal.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
  
  modalOverlay.style.display = 'flex';
  deleteModal.style.display = 'block';
}

function hideDeleteConfirmation() {
  const deleteModal = document.getElementById('deleteModal');
  const modalOverlay = document.getElementById('modalOverlay');
  
  deleteModal.classList.add('hidden');
  modalOverlay.classList.add('hidden');
  
  modalOverlay.style.display = 'none';
  deleteModal.style.display = 'none';
  
  document.body.style.overflow = 'auto';
  document.body.style.pointerEvents = 'auto';
}

function showError(message, error) {
  console.error(message, error);
  alert(`${message}: ${error.message}`);
}

async function handleAddAlbum(event) {
  event.preventDefault();
  
  try {
    const addAlbumForm = document.getElementById('addAlbumForm');
    const formData = new FormData(addAlbumForm);
    const albumData = {
      band: formData.get('band'),
      title: formData.get('title'),
      releaseYear: formData.get('releaseYear') ? parseInt(formData.get('releaseYear')) : null,
      genre: formData.get('genre')
    };
    
    await createAlbum(albumData);
    addAlbumForm.reset();
    showSection(document.getElementById('albumListSection'));
  } catch (error) {
    showError('Hiba történt az album hozzáadásakor', error);
  }
}

async function handleUpdateAlbum(event) {
  event.preventDefault();
  
  try {
    const editAlbumForm = document.getElementById('editAlbumForm');
    const formData = new FormData(editAlbumForm);
    const albumData = {
      band: formData.get('band'),
      title: formData.get('title'),
      releaseYear: formData.get('releaseYear') ? parseInt(formData.get('releaseYear')) : null,
      genre: formData.get('genre')
    };
    
    await updateAlbum(currentAlbumId, albumData);
    showSection(document.getElementById('albumListSection'));
  } catch (error) {
    showError('Hiba történt az album frissítésekor', error);
  }
}

async function handleDeleteAlbum() {
  try {
    await deleteAlbum(currentAlbumId);
    hideDeleteConfirmation();
    showSection(document.getElementById('albumListSection'));
  } catch (error) {
    showError('Hiba történt az album törlésekor', error);
    hideDeleteConfirmation();
  }
}

async function handleEditButtonClick() {
  try {
    const album = await fetchAlbum(currentAlbumId);
    fillEditForm(album);
    showSection(document.getElementById('editAlbumSection'));
  } catch (error) {
    showError('Hiba történt az album betöltésekor', error);
  }
}

function initApp() {
  const listAlbumsBtn = document.getElementById('listAlbumsBtn');
  const addAlbumBtn = document.getElementById('addAlbumBtn');

  const addAlbumForm = document.getElementById('addAlbumForm');
  const editAlbumForm = document.getElementById('editAlbumForm');

  const editAlbumBtn = document.getElementById('editAlbumBtn');
  const deleteAlbumBtn = document.getElementById('deleteAlbumBtn');
  const backToListBtn = document.getElementById('backToListBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const deleteModal = document.getElementById('deleteModal');

  modalOverlay.classList.add('hidden');
  deleteModal.classList.add('hidden');
  
  modalOverlay.style.display = 'none';
  deleteModal.style.display = 'none';

  hideDeleteConfirmation();

  listAlbumsBtn.addEventListener('click', () => showSection(document.getElementById('albumListSection')));
  addAlbumBtn.addEventListener('click', () => showSection(document.getElementById('addAlbumSection')));

  addAlbumForm.addEventListener('submit', handleAddAlbum);
  editAlbumForm.addEventListener('submit', handleUpdateAlbum);

  backToListBtn.addEventListener('click', () => showSection(document.getElementById('albumListSection')));
  editAlbumBtn.addEventListener('click', handleEditButtonClick);
  deleteAlbumBtn.addEventListener('click', showDeleteConfirmation);
  cancelEditBtn.addEventListener('click', () => showSection(document.getElementById('viewAlbumSection')));

  confirmDeleteBtn.addEventListener('click', handleDeleteAlbum);
  cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);
  modalOverlay.addEventListener('click', hideDeleteConfirmation);

  showSection(document.getElementById('albumListSection'));
}

document.addEventListener('DOMContentLoaded', initApp);

window.onload = function() {
  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay && !modalOverlay.classList.contains('hidden')) {
    modalOverlay.classList.add('hidden');
    modalOverlay.style.display = 'none';
    
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
      deleteModal.classList.add('hidden');
      deleteModal.style.display = 'none';
    }
    
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
  }
};