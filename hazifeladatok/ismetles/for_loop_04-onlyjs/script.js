import input from "../input.js"

const myString = await input("Enter a string: ");
let output = '';

for (let i = 0; i < myString.length; i++) {
    output += myString[i] + "\n";
}

console.log(`${output}`)