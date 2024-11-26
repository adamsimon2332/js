import input from "../input.js"

class WeeklySchedule {
    constructor(day, hour, subject) {
        this.day = day;
        this.hour = hour;
        this.subject = subject;
    }
}

const lessons = [];

for (let i = 0; 7 != i; i++) {
    for (let k = 0; 12 != k; k++) {
        const schedule = await input("Add meg a tantárgy nevét: ");
        lessons.push(new WeeklySchedule(i, i, schedule));
    }
    const schedule = await input("Add meg a tantárgy nevét: ");
    lessons.push(new WeeklySchedule(i, i, schedule));
}

for (let i = 0; persons.length != i; i++) {
    console.log(`Név: ${persons[i].name}`);
    console.log(`Email: ${persons[i].email}`);
}