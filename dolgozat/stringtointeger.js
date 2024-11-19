function myParseInt(str) {
    const trimmed = str.Trim();
    return /^\d+$/.test(trimmed) ? parseInt(trimmed, 10) : NaN;
}