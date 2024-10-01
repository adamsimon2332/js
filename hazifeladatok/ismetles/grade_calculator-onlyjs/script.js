import input from "../input.js"

const score = parseFloat(await input("Enter your score: "));
let grade = '';

if (score >= 90 && score <= 100) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else if (score >= 70) {
    grade = 'C';
} else if (score >= 60) {
    grade = 'D';
} else if (score < 60 && score >= 0) {
    grade = 'F';
} else {
    grade = 'Invalid score';
}

console.log(`Your Grade: ${grade}`)