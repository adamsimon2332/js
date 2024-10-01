function calculateFactorial() {
    const number = parseInt(document.getElementById('number').value);
    let factorial = 1;

    if (number < 0) {
        document.getElementById('result').innerText = "Please enter a non-negative integer.";
        return;
    }

    for (let i = 1; i <= number; i++) {
        factorial *= i;
    }

    document.getElementById('result').innerText = `${number} factorial is ${factorial}.`;
}