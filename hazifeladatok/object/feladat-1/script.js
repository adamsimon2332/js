import input from "../input.js"

class Person {
    constructor(name, email,) {
        this.name = name;
        this.email = email;
    }
}

const amount = await input("Add meg hány adatot szeretnél megadni: ");
const persons = [];

for (let i = 0; amount != i; i++) {
    const name = await input("Add meg a személy nevét: ");
    const email = await input("Add meg a személy email címét: ");
    persons.push(new Person(name, email));
}

for (let i = 0; persons.length != i; i++) {
    console.log(`Név: ${persons[i].name}`);
    console.log(`Email: ${persons[i].email}`);
}