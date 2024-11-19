function seconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const totalSeconds = 24 * 60 * 60;
    const elapsedSeconds = (hours * 3600) + (minutes * 60) + seconds;

    return totalSeconds - elapsedSeconds;
}