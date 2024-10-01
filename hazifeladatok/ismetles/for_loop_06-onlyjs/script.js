import input from "../input.js"

const number = await parseInt(input("Enter a number: "));
let factorial = 1;

if (number < 0) {
    console.log("Please enter a non-negative integer.");
    return;
}

for (let i = 1; i <= number; i++) {
    factorial *= i;
}

console.log(`${number}'s factorial is ${factorial}`);