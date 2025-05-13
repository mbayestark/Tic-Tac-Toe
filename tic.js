const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

let games = {};  // In-memory storage for simplicity

// Start a new game
app.post('/start', (req, res) => {
  const id = Date.now().toString();
  games[id] = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null
  };
  res.json({ gameId: id, board: games[id].board });
});

// Make a move
app.post('/move', (req, res) => {
  const { gameId, index, player } = req.body;
  const game = games[gameId];

  if (!game) return res.status(404).json({ error: 'Game not found' });
  if (game.board[index] !== null || game.winner || game.currentPlayer !== player)
    return res.status(400).json({ error: 'Invalid move' });

  game.board[index] = player;
  game.winner = checkWinner(game.board);
  game.currentPlayer = player === 'X' ? 'O' : 'X';

  res.json({ board: game.board, winner: game.winner, nextPlayer: game.currentPlayer });
});

function checkWinner(board) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
  ];
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : 'Draw';
}

const PORT = 3002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
