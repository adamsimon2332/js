import Database from "better-sqlite3";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'szamla.sqlite');

const db = new Database(dbPath);

db.prepare(`CREATE TABLE IF NOT EXISTS kiallito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nev TEXT NOT NULL,
    cim TEXT NOT NULL,
    adoszam TEXT NOT NULL,
    bankszamlaszam TEXT NOT NULL,
    telefon TEXT,
    email TEXT,
    inaktiv INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS vevo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nev TEXT NOT NULL,
    cim TEXT NOT NULL,
    adoszam TEXT,
    telefon TEXT,
    email TEXT,
    inaktiv INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS szamla (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    szamlaszam TEXT UNIQUE NOT NULL,
    kiallito_id INTEGER NOT NULL,
    vevo_id INTEGER NOT NULL,
    kiallitas_datum DATE NOT NULL,
    teljesites_datum DATE NOT NULL,
    fizetesi_hatarido DATE NOT NULL,
    afa_kulcs REAL NOT NULL DEFAULT 27.0,
    netto_osszeg REAL NOT NULL,
    afa_osszeg REAL NOT NULL,
    brutto_osszeg REAL NOT NULL,
    stornozott BOOLEAN DEFAULT 0,
    storno_szamla_id INTEGER,
    kiallito_nev TEXT,
    kiallito_cim TEXT,
    kiallito_adoszam TEXT,
    kiallito_bankszamlaszam TEXT,
    kiallito_telefon TEXT,
    kiallito_email TEXT,
    vevo_nev TEXT,
    vevo_cim TEXT,
    vevo_adoszam TEXT,
    vevo_telefon TEXT,
    vevo_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kiallito_id) REFERENCES kiallito(id),
    FOREIGN KEY (vevo_id) REFERENCES vevo(id),
    FOREIGN KEY (storno_szamla_id) REFERENCES szamla(id)
)`).run();

export const getAllIssuers = () => db.prepare(`SELECT * FROM kiallito WHERE inaktiv = 0 ORDER BY nev`).all();
export const getIssuerById = (id) => db.prepare(`SELECT * FROM kiallito WHERE id = ?`).get(id);
export const setIssuerInactive = (id) => db.prepare(`UPDATE kiallito SET inaktiv = 1 WHERE id = ?`).run(id);
export const addIssuer = (nev, cim, adoszam, bankszamlaszam, telefon, email) => 
    db.prepare(`INSERT INTO kiallito (nev, cim, adoszam, bankszamlaszam, telefon, email) VALUES (?, ?, ?, ?, ?, ?)`).run(nev, cim, adoszam, bankszamlaszam, telefon, email);
export const updateIssuer = (id, nev, cim, adoszam, bankszamlaszam, telefon, email) => 
    db.prepare(`UPDATE kiallito SET nev = ?, cim = ?, adoszam = ?, bankszamlaszam = ?, telefon = ?, email = ? WHERE id = ?`).run(nev, cim, adoszam, bankszamlaszam, telefon, email, id);
export const deleteIssuer = (id) => db.prepare(`DELETE FROM kiallito WHERE id = ?`).run(id);

export const getAllCustomers = () => db.prepare(`SELECT * FROM vevo WHERE inaktiv = 0 ORDER BY nev`).all();
export const getCustomerById = (id) => db.prepare(`SELECT * FROM vevo WHERE id = ?`).get(id);
export const setCustomerInactive = (id) => db.prepare(`UPDATE vevo SET inaktiv = 1 WHERE id = ?`).run(id);
export const addCustomer = (nev, cim, adoszam, telefon, email) => 
    db.prepare(`INSERT INTO vevo (nev, cim, adoszam, telefon, email) VALUES (?, ?, ?, ?, ?)`).run(nev, cim, adoszam, telefon, email);
export const updateCustomer = (id, nev, cim, adoszam, telefon, email) => 
    db.prepare(`UPDATE vevo SET nev = ?, cim = ?, adoszam = ?, telefon = ?, email = ? WHERE id = ?`).run(nev, cim, adoszam, telefon, email, id);
export const deleteCustomer = (id) => db.prepare(`DELETE FROM vevo WHERE id = ?`).run(id);

export const getAllInvoices = () => {
    return db.prepare(`
        SELECT 
            s.*
        FROM szamla s
        ORDER BY s.kiallitas_datum DESC, s.szamlaszam DESC
    `).all();
};

export const getInvoiceById = (id) => {
    return db.prepare(`
        SELECT 
            s.*
        FROM szamla s
        WHERE s.id = ?
    `).get(id);
};

export const addInvoice = (szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg) => {
    const afa_osszeg = Math.round(netto_osszeg * (afa_kulcs / 100) * 100) / 100;
    const brutto_osszeg = Math.round((netto_osszeg + afa_osszeg) * 100) / 100;
    // Fetch issuer and customer details for snapshot
    const k = getIssuerById(kiallito_id);
    const v = getCustomerById(vevo_id);
    return db.prepare(`
        INSERT INTO szamla (
            szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg, afa_osszeg, brutto_osszeg,
            kiallito_nev, kiallito_cim, kiallito_adoszam, kiallito_bankszamlaszam, kiallito_telefon, kiallito_email,
            vevo_nev, vevo_cim, vevo_adoszam, vevo_telefon, vevo_email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg, afa_osszeg, brutto_osszeg,
        k?.nev, k?.cim, k?.adoszam, k?.bankszamlaszam, k?.telefon, k?.email,
        v?.nev, v?.cim, v?.adoszam, v?.telefon, v?.email
    );
};

export const updateInvoice = (id, szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg) => {
    const afa_osszeg = Math.round(netto_osszeg * (afa_kulcs / 100) * 100) / 100;
    const brutto_osszeg = Math.round((netto_osszeg + afa_osszeg) * 100) / 100;
    
    return db.prepare(`
        UPDATE szamla 
        SET szamlaszam = ?, kiallito_id = ?, vevo_id = ?, kiallitas_datum = ?, teljesites_datum = ?, fizetesi_hatarido = ?, afa_kulcs = ?, netto_osszeg = ?, afa_osszeg = ?, brutto_osszeg = ?
        WHERE id = ?
    `).run(szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg, afa_osszeg, brutto_osszeg, id);
};

export const deleteInvoice = (id) => db.prepare(`DELETE FROM szamla WHERE id = ?`).run(id);

export const stornoInvoice = (id) => {
    return db.prepare(`UPDATE szamla SET stornozott = 1 WHERE id = ?`).run(id);
};

export const createStornoInvoice = (originalId, newInvoiceNumber) => {
    const original = getInvoiceById(originalId);
    if (!original) throw new Error('Original invoice not found');
    
    const result = db.prepare(`
        INSERT INTO szamla (szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg, afa_osszeg, brutto_osszeg, storno_szamla_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        newInvoiceNumber,
        original.kiallito_id,
        original.vevo_id,
        original.kiallitas_datum,
        original.teljesites_datum,
        original.fizetesi_hatarido,
        original.afa_kulcs,
        original.netto_osszeg,
        original.afa_osszeg,
        original.brutto_osszeg,
        originalId
    );
    
    stornoInvoice(originalId);
    
    return result;
};

const initSampleData = () => {
    const issuerCount = db.prepare(`SELECT COUNT(*) as count FROM kiallito`).get().count;
    
    if (issuerCount === 0) {
        
        const issuers = [
            {
                nev: 'Tech Solutions Kft.',
                cim: '1056 Budapest, Váci utca 12.',
                adoszam: '12345678-2-41',
                bankszamlaszam: '11700024-20212345-12345678',
                telefon: '+36 1 234 5678',
                email: 'info@techsolutions.hu'
            },
            {
                nev: 'Kreatív Stúdió Bt.',
                cim: '6720 Szeged, Tisza Lajos krt. 103.',
                adoszam: '87654321-1-06',
                bankszamlaszam: '11773016-20543210-87654321',
                telefon: '+36 62 987 654',
                email: 'hello@kreativstudio.hu'
            }
        ];
        
        issuers.forEach(issuer => {
            addIssuer(issuer.nev, issuer.cim, issuer.adoszam, issuer.bankszamlaszam, issuer.telefon, issuer.email);
        });
        
        const customers = [
            {
                nev: 'ABC Kereskedelmi Kft.',
                cim: '1135 Budapest, Váci út 45.',
                adoszam: '11223344-2-41',
                telefon: '+36 1 345 6789',
                email: 'rendeles@abckereskedo.hu'
            },
            {
                nev: 'XYZ Szolgáltató Zrt.',
                cim: '4029 Debrecen, Piac utca 23.',
                adoszam: '55667788-2-09',
                telefon: '+36 52 123 456',
                email: 'info@xyzszolgaltato.hu'
            },
            {
                nev: 'Innovatív Megoldások Kft.',
                cim: '7621 Pécs, Király utca 67.',
                adoszam: '99887766-2-02',
                telefon: '+36 72 789 012',
                email: 'kapcsolat@innovativ.hu'
            },
            {
                nev: 'Global Trade Ltd.',
                cim: '9023 Győr, Baross Gábor út 89.',
                adoszam: '44332211-2-08',
                telefon: '+36 96 456 789',
                email: 'office@globaltrade.hu'
            }
        ];
        
        customers.forEach(customer => {
            addCustomer(customer.nev, customer.cim, customer.adoszam, customer.telefon, customer.email);
        });
        
        const invoices = [
            {
                szamlaszam: 'TS-2024-001',
                kiallito_id: 1,
                vevo_id: 1,
                kiallitas_datum: '2024-01-15',
                teljesites_datum: '2024-01-15',
                fizetesi_hatarido: '2024-02-14',
                afa_kulcs: 27.0,
                netto_osszeg: 150000
            },
            {
                szamlaszam: 'TS-2024-002',
                kiallito_id: 1,
                vevo_id: 2,
                kiallitas_datum: '2024-01-20',
                teljesites_datum: '2024-01-18',
                fizetesi_hatarido: '2024-02-19',
                afa_kulcs: 27.0,
                netto_osszeg: 280000
            },
            {
                szamlaszam: 'TS-2024-003',
                kiallito_id: 1,
                vevo_id: 3,
                kiallitas_datum: '2024-01-25',
                teljesites_datum: '2024-01-22',
                fizetesi_hatarido: '2024-02-24',
                afa_kulcs: 27.0,
                netto_osszeg: 95000
            },
            {
                szamlaszam: 'KS-2024-001',
                kiallito_id: 2,
                vevo_id: 1,
                kiallitas_datum: '2024-01-10',
                teljesites_datum: '2024-01-08',
                fizetesi_hatarido: '2024-02-09',
                afa_kulcs: 27.0,
                netto_osszeg: 120000
            },
            {
                szamlaszam: 'KS-2024-002',
                kiallito_id: 2,
                vevo_id: 3,
                kiallitas_datum: '2024-01-18',
                teljesites_datum: '2024-01-15',
                fizetesi_hatarido: '2024-02-17',
                afa_kulcs: 27.0,
                netto_osszeg: 75000
            },
            {
                szamlaszam: 'KS-2024-003',
                kiallito_id: 2,
                vevo_id: 4,
                kiallitas_datum: '2024-01-28',
                teljesites_datum: '2024-01-25',
                fizetesi_hatarido: '2024-02-27',
                afa_kulcs: 27.0,
                netto_osszeg: 185000
            }
        ];
        
        invoices.forEach(invoice => {
            addInvoice(
                invoice.szamlaszam,
                invoice.kiallito_id,
                invoice.vevo_id,
                invoice.kiallitas_datum,
                invoice.teljesites_datum,
                invoice.fizetesi_hatarido,
                invoice.afa_kulcs,
                invoice.netto_osszeg
            );
        });
        
    }
};

initSampleData();

export default db;
