const player1Choice = parseInt(await input("Enter the first player's choice"));
const player2Choice = parseInt(await input("Enter the second player's choice"));
let result = '';

if (isNaN(player1Choice) || isNaN(player2Choice) || 
    player1Choice < 0 || player1Choice > 2 || 
    player2Choice < 0 || player2Choice > 2) {
    result = 'Invalid input! Please enter 0, 1, or 2.';
} else if (player1Choice === player2Choice) {
    result = 'The game is a tie.';
} else if (
    (player1Choice === 0 && player2Choice === 2) ||
    (player1Choice === 1 && player2Choice === 0) ||
    (player1Choice === 2 && player2Choice === 1)
) {
    result = 'The first player wins.';
} else {
    result = 'The second player wins.';
}

console.log(`Result: ${result}`)