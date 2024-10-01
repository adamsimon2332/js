import input from "../input.js"

const massInKg = await input("Enter your weight in kilograms: ")
const heightInM = await input("Enter your height in meters: ")

const bmi = massInKg / (heightInM * heightInM);

console.log(`Your BMI: ${bmi.toFixed(2)}`)