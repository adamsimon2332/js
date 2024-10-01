function calculateGrade() {
    const score = parseFloat(document.getElementById('score').value);
    let grade = '';

    if (score >= 90 && score <= 100) {
        grade = 'A';
    } else if (score >= 80) {
        grade = 'B';
    } else if (score >= 70) {
        grade = 'C';
    } else if (score >= 60) {
        grade = 'D';
    } else if (score < 60 && score >= 0) {
        grade = 'F';
    } else {
        grade = 'Invalid score';
    }

    document.getElementById('grade').textContent = `Your Grade: ${grade}`;
}