function calculateCuboid() {
    const length = 10.4;
    const width = 13.5;
    const height = 8.2;

    const surfaceArea = 2 * (length * width + width * height + height * length);
    const volume = length * width * height;

    document.getElementById('surface-area').textContent = `Surface Area: ${surfaceArea.toFixed(2)}`;
    document.getElementById('volume').textContent = `Volume: ${volume.toFixed(2)}`;
}