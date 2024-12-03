import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import input from "./input.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "uvegek.txt");

function readDataFromFile() {
    let content = '';
    let data = [];
    try {
        content = fs.readFileSync(filePath, 'utf8');
        data = content.split(", ");
    } catch (err) {
        console.log('Hiba a fájl olvasása közben: ', err);
    }
    return data;
}

let data = readDataFromFile();

console.log("1. feladat");
console.log('Üvegek tartalma dl-ben: ', data);
console.log("2. feladat");

let totalamount = await input("Add meg Mari néni lekvárját dl-ben (0 és 200 között): ");

while (totalamount <= 0 || totalamount > 200) {
    console.log("Hibás adat! Kérlek, add meg a helyes mennyiséget.");
    totalamount = await input("Add meg Mari néni lekvárját dl-ben (0 és 200 között): ");
}

console.log(`Mari néni lekvárja (dl): ${totalamount}`);

console.log("3. feladat")

let max = Math.max(...data);
let maxIndex = data.indexOf(max);
console.log(`A legnagyobb üveg: ${max} dl és ${maxIndex + 1}. a sorban.`);

console.log("4. feladat")

let totalmariamount = data.reduce((sum, current) => sum + Number(current), 0);
if (totalmariamount >= totalamount) {
    console.log("Elegendő üveg volt.");
} else {
    console.log("Maradt lekvár.");
}