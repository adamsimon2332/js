function calculateAverage() {
    const number = document.getElementById('number').value;
    let sum = 0;
    let count = 0;

    if (!number || number < 0) {
        document.getElementById('result').innerText = "Please enter a valid non-negative integer.";
        return;
    }

    for (let digit of number) {
        sum += parseInt(digit, 10);
        count++;
    }

    const average = sum / count;
    document.getElementById('result').innerText = `The average of digits is ${average}.`;
}