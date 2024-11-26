function rockPaperScissors(player1, player2) {
    if (player1 === player2) return "Draw!";
    const wins = {
        rock: "scissors",
        scissors: "paper",
        paper: "rock"
    };
    return wins[player1] === player2 ? "Player 1 won!" : "Player 2 won!";
}