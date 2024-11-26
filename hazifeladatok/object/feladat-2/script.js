import input from "../input.js"

class WeeklySchedule {
    constructor(day, hour, subject) {
        this.day = day;
        this.hour = hour;
        this.subject = subject;
    }
}

const lessons = [];

for (let i = 1; 6 != i; i++) {
    for (let k = 1; 13 != k; k++) {
        const subject = await input("Add meg a tantárgy nevét: ");
        lessons.push(new WeeklySchedule(i, k, subject));
    }
}

for (let i = 0; lessons.length != i; i++) {
    console.log(`Nap: ${lessons[i].day}.`);
    console.log(`Óra: ${lessons[i].hour}.`);
    console.log(`Tantárgy: ${lessons[i].subject}`);
}