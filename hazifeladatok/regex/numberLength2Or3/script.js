let text = "Hello WORLD! Today is the 5th of June 2024 21th century. I've 15 apples, 123 oranges, and 4567 grapes."
let regex, result

regex = /\b\d{2}\b/g
result = text.match(regex)

console.log(`\nOlyan számok keresése, melyek 2 vagy 3 számjegyet tartalmaznak: ${regex}`)
console.log(result)