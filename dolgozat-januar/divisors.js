function divisors(n) {
    let result = [];

    for (let i = 2; i < n; i++) {
        if (n % i === 0) {
            result.push(i);
        }
    }

    return result.length > 0 ? result : `${n} is prime`;
}