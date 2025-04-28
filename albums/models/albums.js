import { dbAll, dbGet, dbRun } from './database.js';

export async function initializeDatabase() {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        band TEXT NOT NULL,
        title TEXT NOT NULL,
        releaseYear INTEGER,
        genre TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const count = await dbGet('SELECT COUNT(*) as count FROM albums');
    
    if (count.count === 0) {
      const initialData = [
        { band: "Pink Floyd", title: "The Dark Side of the Moon", releaseYear: 1973, genre: "Progressive Rock" },
        { band: "Led Zeppelin", title: "IV", releaseYear: 1971, genre: "Hard Rock" },
        { band: "Queen", title: "A Night at the Opera", releaseYear: 1975, genre: "Rock" },
        { band: "The Beatles", title: "Abbey Road", releaseYear: 1969, genre: "Rock" },
        { band: "Metallica", title: "Master of Puppets", releaseYear: 1986, genre: "Heavy Metal" }
      ];
      
      for (const album of initialData) {
        await dbRun(
          'INSERT INTO albums (band, title, releaseYear, genre) VALUES (?, ?, ?, ?)',
          [album.band, album.title, album.releaseYear, album.genre]
        );
      }
    }
    
    console.log('Az adatbázis sikeresen elindult.');
  } catch (error) {
    console.error('Adatbázis hiba:', error);
  }
}

export async function getAllAlbums() {
  try {
    return await dbAll('SELECT * FROM albums ORDER BY band');
  } catch (error) {
    console.error('Hiba az albumok lekérésénél:', error);
    return [];
  }
}

export async function getAlbumById(id) {
  try {
    const album = await dbGet('SELECT * FROM albums WHERE id = ?', [id]);
    if (!album) {
      throw new Error('Album not found');
    }
    return album;
  } catch (error) {
    console.error('Hiba az album lekérésénél:', error);
    throw error;
  }
}

export async function createAlbum(albumData) {
  try {
    const { band, title, releaseYear, genre } = albumData;
    
    const result = await dbRun(
      'INSERT INTO albums (band, title, releaseYear, genre) VALUES (?, ?, ?, ?)',
      [band, title, releaseYear, genre]
    );
    
    return await getAlbumById(result.lastID);
  } catch (error) {
    console.error('Hozzáadási hiba:', error);
    throw error;
  }
}

export async function updateAlbum(id, albumData) {
  try {
    const { band, title, releaseYear, genre } = albumData;
    
    const result = await dbRun(
      'UPDATE albums SET band = ?, title = ?, releaseYear = ?, genre = ? WHERE id = ?',
      [band, title, releaseYear, genre, id]
    );
    
    if (result.changes === 0) {
      throw new Error('Album not found');
    }
    
    return await getAlbumById(id);
  } catch (error) {
    console.error('Frissítési hiba:', error);
    throw error;
  }
}

export async function deleteAlbum(id) {
  try {
    const result = await dbRun('DELETE FROM albums WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      throw new Error('Album not found');
    }
    
    return true;
  } catch (error) {
    console.error('Törlési hiba:', error);
    throw error;
  }
}

export async function getAlbumsByBand(band) {
  try {
    return await dbAll('SELECT * FROM albums WHERE band = ? ORDER BY releaseYear', [band]);
  } catch (error) {
    console.error('Hiba az albumok lekérésénél előadó szerint:', error);
    return [];
  }
}

export async function getBands() {
  try {
    const rows = await dbAll('SELECT DISTINCT band FROM albums ORDER BY band');
    return rows.map(row => row.band);
  } catch (error) {
    console.error('Hiba a zenekarok lekérésénél:', error);
    return [];
  }
}