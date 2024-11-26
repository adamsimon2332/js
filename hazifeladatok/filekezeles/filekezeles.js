import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "adatok.json");

try {
    fs.writeFileSync(filePath, JSON.stringify(users));
} catch (err) {
    console.log(err);
}

function readDataFromFile() {
    let content = '';
    let data = [];
    try {
        content = fs.readFileSync(filePath, 'utf8');
        data = JSON.parse(content);
    } catch (err) {
        console.log('Hiba a fájl olvasása közben: ', err);
    }
    return data;
}

function writeDataToFile(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.log('Hiba a fájl írása közben:', err);
    }
}


let data = readDataFromFile();

data.push({ name: 'Adam' });
data.push({ name: 'Jani' });
data.push({ name: 'Pista' });

writeDataToFile(data);

const updatedData = readDataFromFile();

console.log('Frissített fájl tartalma: ', updatedData);
