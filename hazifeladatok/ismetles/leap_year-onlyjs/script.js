import input from "../input.js"

const year = parseInt(await input("Enter the year: "));
let result = '';

if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
    result = `${year} is a leap year.`;
} else {
    result = `${year} is not a leap year.`;
}

console.log(`Result: ${result}`)