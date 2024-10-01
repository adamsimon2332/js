import input from "../input.js"

const currentHours = await input("Enter the hours: ");
const currentMinutes = await input("Enter the minutes: ");
const currentSeconds = await input("Enter the seconds: ");

const totalSecondsInADay = 24 * 60 * 60;
const elapsedSeconds = (currentHours * 3600) + (currentMinutes * 60) + currentSeconds;
const remainingSeconds = totalSecondsInADay - elapsedSeconds;

console.log(`Remaining Seconds: ${remainingSeconds}`)