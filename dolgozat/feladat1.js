function stonePaperScissorsWinner(player1, player2) {
    if((player1 == 0 && player2 == 1) || (player1 == 1 && player2 == 2) || (player1 == 2 && player2 == 0)) {
        return 'The first player wins.';
    }
    else if((player1 == 1 && player2 == 0) || (player1 == 2 && player2 == 1) || (player1 == 0 && player2 == 2)) {
        return 'The second player wins.';
    }
    else if((player1 == 0 && player2 == 0) || (player1 == 1 && player2 == 1) || (player1 == 2 && player2 == 2)) {
        return 'The game is a tie.';
    }
}