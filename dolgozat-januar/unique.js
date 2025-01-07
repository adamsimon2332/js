function hasUniqueCharacters(str) {
    const seen = new Set();
    for (let char of str) {
        if (seen.has(char)) {
            return false;
        }
        seen.add(char);
    }

    return true;
}