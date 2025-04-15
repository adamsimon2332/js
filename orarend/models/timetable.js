import { dbAll, dbGet, dbRun } from './database.js';

export async function initializeDatabase() {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS timetable_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL,
        hour INTEGER NOT NULL,
        subject TEXT NOT NULL,
        teacher TEXT,
        room TEXT
      )
    `);
    
    const count = await dbGet('SELECT COUNT(*) as count FROM timetable_entries');
    
    if (count.count === 0) {
      const initialData = [
        { day: "Hétfő", hour: 1, subject: "Matematika", teacher: "Nagy Mária", room: "101" },
        { day: "Hétfő", hour: 2, subject: "Történelem", teacher: "Kis János", room: "102" },
        { day: "Kedd", hour: 1, subject: "Fizika", teacher: "Szabó Péter", room: "103" },
        { day: "Szerda", hour: 3, subject: "Irodalom", teacher: "Kovács Éva", room: "104" },
        { day: "Csütörtök", hour: 2, subject: "Angol", teacher: "Lakatos Ronaldo", room: "105" },
        { day: "Péntek", hour: 4, subject: "Informatika", teacher: "Nagy István", room: "106" }
      ];
      
      for (const entry of initialData) {
        await dbRun(
          'INSERT INTO timetable_entries (day, hour, subject, teacher, room) VALUES (?, ?, ?, ?, ?)',
          [entry.day, entry.hour, entry.subject, entry.teacher, entry.room]
        );
      }
    }
    
    console.log('Az adatbázis sikeresen elindult.');
  } catch (error) {
    console.error('Adatbázis hiba:', error);
  }
}

export async function getAllEntries() {
  try {
    return await dbAll('SELECT * FROM timetable_entries ORDER BY day, hour');
  } catch (error) {
    console.error('Hiba az órák lekérésénél:', error);
    return [];
  }
}

export async function getEntriesByDay(day) {
  try {
    return await dbAll('SELECT * FROM timetable_entries WHERE day = ? ORDER BY hour', [day]);
  } catch (error) {
    console.error('Hiba az órák lekérésénél naponként:', error);
    return [];
  }
}

export async function addEntry(entry) {
  try {
    const result = await dbRun(
      'INSERT INTO timetable_entries (day, hour, subject, teacher, room) VALUES (?, ?, ?, ?, ?)',
      [entry.day, entry.hour, entry.subject, entry.teacher || null, entry.room || null]
    );
    
    return {
      id: result.lastID,
      ...entry
    };
  } catch (error) {
    console.error('Hozzáadási hiba:', error);
    return null;
  }
}

export async function updateEntry(id, updatedEntry) {
  try {
    await dbRun(
      'UPDATE timetable_entries SET day = ?, hour = ?, subject = ?, teacher = ?, room = ? WHERE id = ?',
      [updatedEntry.day, updatedEntry.hour, updatedEntry.subject, updatedEntry.teacher || null, updatedEntry.room || null, id]
    );
    
    return await dbGet('SELECT * FROM timetable_entries WHERE id = ?', [id]);
  } catch (error) {
    console.error('Frissítési hiba:', error);
    return null;
  }
}

export async function deleteEntry(id) {
  try {
    const result = await dbRun('DELETE FROM timetable_entries WHERE id = ?', [id]);
    return result.changes > 0;
  } catch (error) {
    console.error('Törlési hiba:', error);
    return false;
  }
}

export async function getDays() {
  try {
    const rows = await dbAll('SELECT DISTINCT day FROM timetable_entries');
    return rows.map(row => row.day);
  } catch (error) {
    console.error('Hiba a napok lekérésénél:', error);
    return [];
  }
}