import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "dobasok.txt");

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
console.log('Dobások: ', data);

let place = 0;
let back = 0;
console.log("2. feladat")
for (let i = 0; i != data.length; i++) {
    place += parseInt(data[i]);
    if(place >= 45) {
        console.log("3. feladat");
        console.log(`A játék során ${back} alkalommal lépett létrára.`);
        console.log("4. feladat");
        console.log("A játékot befejezte.");
        break;
    }
    if(place % 10 == 0) {
        console.log(place-3);
        back += 1;
    } else {
        console.log(place);
    }
}