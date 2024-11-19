function cuboid(a, b, c) {
    const surfaceArea = 2 * (a * b + a * c + b * c);
    const volume = a * b * c;
    
    return [parseFloat(surfaceArea.toFixed(2)), parseFloat(volume.toFixed(2))];
}