import win from './win';
/**
 * 通过遍历得到棋盘的每个空位，对每个空位调用minMAx函数来获取该位置的最佳得分，然后根据每个空位的最佳得分来判断最佳落子点。
 * @param aiPlayer ai的棋子类型
 * @param player 玩家的棋子类型
 * @param value
 * @param squares 棋盘
 * @returns 最佳落子点
 */
function bestLocation(aiPlayer: string, player: string, value: GameMode, squares: (string | null)[][]) {
    let bestScore = -Infinity;
    let move: [number, number] = [-1, -1]; // 初始化 move 为一个无效位置
    // 找到当前棋盘中分数最高的空位，即最佳落子点
    for (let row = 0; row < value.chessBoard; row++) {
        for (let col = 0; col < value.chessBoard; col++) {
            if (!squares[row][col]) {
                squares[row][col] = aiPlayer;
                const score = minMax(squares, 0, false, aiPlayer, player, value);
                squares[row][col] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = [row, col];
                }
            }
        }
    }
    return move;
    /**
     * 递归调用minMax函数从而得到最终结果，然后根据最终结果来获取该位置的得分，如果该步是ai落子则判取极大值，如果是玩家落子则取极小值。
     *
     * @param squares 棋盘
     * @param depth 深度（即步数）
     * @param isMaximizing 判断下棋者是AI还是玩家
     * @param aiPlayer ai的棋子类型
     * @param player 玩家的棋子类型
     * @param value
     * @returns 该位置的得分
     */
    function minMax(squares: (string | null)[][], depth: number, isMaximizing: boolean, aiPlayer: string, player: string, value: GameMode): number {
        const winner = checkWin(value, squares);
        const deep = Math.pow(value.chessBoard, 2) + 1;
        if (winner === aiPlayer) {
            return deep - depth;
        } else if (winner === player) {
            return depth - deep;
        } else if (isBoardFull(squares)) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let row = 0; row < value.chessBoard; row++) {
                for (let col = 0; col < value.chessBoard; col++) {
                    if (!squares[row][col]) {
                        squares[row][col] = aiPlayer;
                        const score = minMax(squares, depth + 1, false, aiPlayer, player, value);
                        squares[row][col] = null;
                        bestScore = Math.max(bestScore, score);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let row = 0; row < value.chessBoard; row++) {
                for (let col = 0; col < value.chessBoard; col++) {
                    if (!squares[row][col]) {
                        squares[row][col] = player;
                        const score = minMax(squares, depth + 1, true, aiPlayer, player, value);
                        squares[row][col] = null;
                        bestScore = Math.min(bestScore, score);
                    }
                }
            }
            return bestScore;
        }
    }
}

/**
 * 检查棋盘是否获胜
 * @param value
 * @param squares
 * @returns 获胜者
 */
function checkWin(value: GameMode, squares: (string | null)[][]) {
    for (let row = 0; row < squares.length; row++) {
        for (let col = 0; col < squares.length; col++) {
            if (squares[row][col]) {
                if (win(row, col, squares[row][col], squares, value)) {
                    return squares[row][col];
                }
            }
        }
    }
    return null;
}

/**
 * 检查棋盘是否平局
 * @param squares
 * @returns 是否平局
 */
function isBoardFull(squares: (string | null)[][]): boolean {
    for (let row = 0; row < squares.length; row++) {
        for (let col = 0; col < squares[row].length; col++) {
            if (!squares[row][col]) {
                return false;
            }
        }
    }
    return true;
}

export default bestLocation;
