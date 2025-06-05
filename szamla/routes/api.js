import express from 'express';
import {
  getIssuers,
  createIssuer,
  getIssuer,
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  getInvoices,
  createInvoice,
  getInvoice,
  updateIssuer,
  removeIssuer,
  removeCustomer,
  removeInvoice
} from '../models/invoice.js';

const router = express.Router();

router.get('/kiallito', (req, res) => {
  res.json(getIssuers());
});

router.post('/kiallito', (req, res) => {
  const { nev, cim, adoszam, bankszamlaszam, telefon, email } = req.body;
  if (!nev || !cim || !adoszam || !bankszamlaszam) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező! (Név, cím, adószám, bankszámlaszám)' });
  }
  const result = createIssuer(nev, cim, adoszam, bankszamlaszam, telefon, email);
  res.status(201).json(getIssuer(result.lastInsertRowid));
});

// Edit issuer
router.put('/kiallito/:id', (req, res) => {
  const { nev, cim, adoszam, bankszamlaszam, telefon, email } = req.body;
  updateIssuer(req.params.id, nev, cim, adoszam, bankszamlaszam, telefon, email);
  res.json(getIssuer(req.params.id));
});

// Delete issuer
router.delete('/kiallito/:id', (req, res) => {
  removeIssuer(req.params.id);
  res.json({ success: true });
});

router.get('/vevok', (req, res) => {
  res.json(getCustomers());
});

router.post('/vevok', (req, res) => {
  const { nev, cim, adoszam, telefon, email } = req.body;
  const result = createCustomer(nev, cim, adoszam, telefon, email);
  res.status(201).json(getCustomer(result.lastInsertRowid));
});

router.put('/vevok/:id', (req, res) => {
  const { nev, cim, adoszam, telefon, email } = req.body;
  updateCustomer(req.params.id, nev, cim, adoszam, telefon, email);
  res.json(getCustomer(req.params.id));
});

// Delete customer
router.delete('/vevok/:id', (req, res) => {
  removeCustomer(req.params.id);
  res.json({ success: true });
});

router.get('/szamlak', (req, res) => {
  const invoices = getInvoices();
  // Map to frontend structure
  res.json(invoices.map(szamla => ({
    id: szamla.id,
    szamlaszam: szamla.szamlaszam,
    kiallitas_datum: szamla.kiallitas_datum,
    teljesites_datum: szamla.teljesites_datum,
    fizetesi_hatarido: szamla.fizetesi_hatarido,
    afa_kulcs: szamla.afa_kulcs,
    netto_osszeg: szamla.netto_osszeg,
    afa_osszeg: szamla.afa_osszeg,
    brutto_osszeg: szamla.brutto_osszeg,
    stornozott: szamla.stornozott,
    kiallito: {
      nev: szamla.kiallito_nev,
      cim: szamla.kiallito_cim,
      adoszam: szamla.kiallito_adoszam,
      bankszamlaszam: szamla.kiallito_bankszamlaszam,
      telefon: szamla.kiallito_telefon,
      email: szamla.kiallito_email
    },
    vevo: {
      nev: szamla.vevo_nev,
      cim: szamla.vevo_cim,
      adoszam: szamla.vevo_adoszam,
      telefon: szamla.vevo_telefon,
      email: szamla.vevo_email
    }
  })));
});

router.post('/szamlak', (req, res) => {
  const { kiallito, vevo, kelte, teljesites, fizetesiHatarido, vegosszeg, afa } = req.body;
  if (!kiallito || !vevo || !kelte || !teljesites || !fizetesiHatarido || !vegosszeg || !afa) {
    return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
  }
  const kelteD = new Date(kelte);
  const fizetesiHataridoD = new Date(fizetesiHatarido);
  if ((fizetesiHataridoD - kelteD) / (1000*60*60*24) > 30) {
    return res.status(400).json({ error: 'A fizetési határidő nem lehet több, mint 30 nap a kiállítás dátuma után.' });
  }
  // Számlaszám generálás (implement if needed)
  // ...existing code for generating szamlaszam...
  // For now, just use a placeholder:
  const szamlaszam = `${kiallito}-${Date.now()}`;
  try {
    createInvoice(szamlaszam, kiallito, vevo, kelte, teljesites, fizetesiHatarido, afa, vegosszeg);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a számla létrehozásakor.', details: error.message });
  }
});

router.get('/szamlak/:id', (req, res) => {
  const szamla = getInvoice(req.params.id);
  if (!szamla) {
    return res.status(404).json({ error: 'A számla nem található.' });
  }
  // Map to frontend structure
  res.json({
    id: szamla.id,
    szamlaszam: szamla.szamlaszam,
    kiallitas_datum: szamla.kiallitas_datum,
    teljesites_datum: szamla.teljesites_datum,
    fizetesi_hatarido: szamla.fizetesi_hatarido,
    afa_kulcs: szamla.afa_kulcs,
    netto_osszeg: szamla.netto_osszeg,
    afa_osszeg: szamla.afa_osszeg,
    brutto_osszeg: szamla.brutto_osszeg,
    stornozott: szamla.stornozott,
    kiallito: {
      nev: szamla.kiallito_nev,
      cim: szamla.kiallito_cim,
      adoszam: szamla.kiallito_adoszam,
      bankszamlaszam: szamla.kiallito_bankszamlaszam,
      telefon: szamla.kiallito_telefon,
      email: szamla.kiallito_email
    },
    vevo: {
      nev: szamla.vevo_nev,
      cim: szamla.vevo_cim,
      adoszam: szamla.vevo_adoszam,
      telefon: szamla.vevo_telefon,
      email: szamla.vevo_email
    }
  });
});

// Delete invoice
router.delete('/szamlak/:id', (req, res) => {
  try {
    removeInvoice(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Hiba történt a számla törlésekor.' });
  }
});

// DEBUG: List all invoices with stornozott field
router.get('/debug/szamla-storno', (req, res) => {
  const db = require('../util/database.js');
  const all = db.db.prepare('SELECT id, szamlaszam, stornozott FROM szamla').all();
  res.json(all);
});

export default router;
