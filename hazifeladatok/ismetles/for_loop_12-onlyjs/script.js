import input from "../input.js"

const number = await input("Enter a number: ");
let sum = 0;
let count = 0;

if (!number || number < 0) {
    console.log(`Please enter a valid non-negative integer.`)
    return;
}

for (let digit of number) {
    sum += parseInt(digit, 10);
}

const average = sum / count;

console.log(`The average of digits is ${average}.`)