let count = 0;
const counterEl = document.getElementById("counter");

function change(amount) {
    count += amount;
    counterEl.textContent = count;
}