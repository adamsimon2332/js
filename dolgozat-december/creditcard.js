function maskify (card) {
    if (card.length > 4) {
        return '#'.repeat(card.length - 4) + card.slice(-4);
    } else {
        return card;
    } 
}
console.log(maskify("53532432432"));