
const tictactoeMode: GameMode = {
  name: "三子棋游戏",
  path: "tictactoe",
  chessBoard: 3,
  player: ["X", "O"],
  winRule: 3,
  id: 1,
};

const gobangMode: GameMode = {
  name: "五子棋游戏",
  path: "gobang",
  chessBoard: 15,
  player: ["⚫", "⚪"],
  winRule: 5,
  id: 2,
};

const gameMode: GameMode[] = [tictactoeMode, gobangMode];

export { gameMode };