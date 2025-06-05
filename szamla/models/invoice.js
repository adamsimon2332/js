import * as db from '../util/database.js';

export const initializeDatabase = async () => {
    console.log('Invoice database initialized');
};

export const getIssuers = () => db.getAllIssuers();
export const getIssuer = (id) => db.getIssuerById(id);
export const createIssuer = (nev, cim, adoszam, bankszamlaszam, telefon, email) => 
    db.addIssuer(nev, cim, adoszam, bankszamlaszam, telefon, email);
export const updateIssuer = (id, nev, cim, adoszam, bankszamlaszam, telefon, email) => 
    db.updateIssuer(id, nev, cim, adoszam, bankszamlaszam, telefon, email);
export const removeIssuer = (id) => db.setIssuerInactive(id);

export const getCustomers = () => db.getAllCustomers();
export const getCustomer = (id) => db.getCustomerById(id);
export const createCustomer = (nev, cim, adoszam, telefon, email) => 
    db.addCustomer(nev, cim, adoszam, telefon, email);
export const updateCustomer = (id, nev, cim, adoszam, telefon, email) => 
    db.updateCustomer(id, nev, cim, adoszam, telefon, email);
export const removeCustomer = (id) => db.setCustomerInactive(id);

export const getInvoices = () => db.getAllInvoices();
export const getInvoice = (id) => db.getInvoiceById(id);
export const createInvoice = (szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg) => 
    db.addInvoice(szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg);
export const updateInvoice = (id, szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg) => 
    db.updateInvoice(id, szamlaszam, kiallito_id, vevo_id, kiallitas_datum, teljesites_datum, fizetesi_hatarido, afa_kulcs, netto_osszeg);
export const removeInvoice = (id) => db.deleteInvoice(id);
export const cancelInvoice = (id) => db.stornoInvoice(id);
export const createInvoiceFromCancelled = (originalId, newInvoiceNumber) => 
    db.createStornoInvoice(originalId, newInvoiceNumber);
