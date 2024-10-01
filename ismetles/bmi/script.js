function calculateBMI() {
    const massInKg = 81.2;
    const heightInM = 1.78;

    const bmi = massInKg / (heightInM * heightInM);

    document.getElementById('bmi').textContent = `Your BMI: ${bmi.toFixed(2)}`;
}