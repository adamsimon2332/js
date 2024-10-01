function calculateRemainingSeconds() {
    const currentHours = 14;
    const currentMinutes = 34;
    const currentSeconds = 42;

    const totalSecondsInADay = 24 * 60 * 60;
    const elapsedSeconds = (currentHours * 3600) + (currentMinutes * 60) + currentSeconds;
    const remainingSeconds = totalSecondsInADay - elapsedSeconds;

    document.getElementById('remaining-seconds').textContent = `Remaining Seconds: ${remainingSeconds}`;
}