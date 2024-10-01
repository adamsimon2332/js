function iterateString() {
    const myString = document.getElementById('myString').value;
    let output = '';

    for (let i = 0; i < myString.length; i++) {
        output += myString[i] + '<br>';
    }

    document.getElementById('output').innerHTML = output;
}