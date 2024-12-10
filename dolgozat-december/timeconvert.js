function convertTime(minutes) {
    if (minutes <= 0) {
        return "00:00";
    } else {
        let hours = (minutes - minutes % 60) / 60;
        let remainingMinutes = minutes % 60;
        return `0${hours}:${remainingMinutes}`;
    }

}

console.log(convertTime(342));