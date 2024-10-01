import input from "../input.js"

const length = await input("Enter the length: ");
const width = await input("Enter the width: ");
const height = await input("Enter the height: ");

const surfaceArea = 2 * (length * width + width * height + height * length);
const volume = length * width * height;

console.log(`Surface Area: ${surfaceArea.toFixed(2)}`)
console.log(`Volume: ${volume.toFixed(2)}`)