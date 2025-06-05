# Számla Kezelő Rendszer

Ez a webalkalmazás számlák kezelésére és nyilvántartására szolgál. A rendszer lehetővé teszi számlák kiállítását, stornózását, valamint a kiállítók és vevők adatainak kezelését.

## Funkciók

### Számlakezelés
- Új számlák létrehozása
- Számlák listázása
- Számlák részleteinek megtekintése
- Számlák stornózása (törlés helyett)

### Vevők kezelése
- Vevők listázása
- Új vevők hozzáadása
- Vevő adatok módosítása

### Kiállítók kezelése
- Kiállítók listázása
- Új kiállítók hozzáadása

## Technikai részletek

A rendszer a következő funkcionalitást valósítja meg:
- A számláknak van kiállítója, vevője, száma, kelte, teljesítés dátuma, fizetési határideje, végösszege és ÁFA nagysága
- A kiállítónak és a vevőnek van neve, címe, adószáma
- A számlán csak a végösszeg és az ÁFA kulcs jelenik meg (tételek nélkül)
- Az adatok SQLite adatbázisban tárolódnak
- A számlák 5 évig megőrzésre kerülnek a jogszabályi követelmények szerint
- A kiállított számlák nem módosíthatók, csak stornózhatók
- Stornózás esetén az eredeti számla megmarad, de "stornózva" státuszban

## Jogilag fontos részletek
- A fizetési határidő nem lehet több, mint a kiállítás dátuma plusz 30 nap (jogszabályi előírás)
- A rendszer követi az ÁFA-val kapcsolatos jogszabályokat (teljesítés dátumától kezdődően ÁFA fizetési kötelezettség)
- A számla külalakja megfelel a szabványos formátumnak (számlaszám felül, kiállító és vevő adatok, dátumok, összegek)

## Telepítés és használat

1. Klónozza a repositoryt
2. Telepítse a függőségeket: `npm install`
3. Adatbázis inicializálása: `cd data && npm run init && npm run seed`
4. Indítsa el a szervert: `npm start`
5. Nyissa meg böngészőben: `http://localhost:3000`

## API végpontok

- `GET /api/kiallito` - Kiállítók listázása
- `POST /api/kiallito` - Kiállító létrehozása
- `GET /api/vevok` - Vevők listázása
- `POST /api/vevok` - Vevő létrehozása
- `PUT /api/vevok/:id` - Vevő módosítása
- `GET /api/szamlak` - Számlák listázása
- `GET /api/szamlak/:szamlaszam` - Számla részletek lekérdezése
- `POST /api/szamlak` - Számla létrehozása
- `POST /api/szamlak/:szamlaszam/storno` - Számla stornózása
