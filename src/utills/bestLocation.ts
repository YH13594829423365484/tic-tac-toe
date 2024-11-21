import win from './win';

/**
 * 通过遍历得到棋盘的每个空位，对每个空位调用 minMax 函数来获取该位置的最佳得分，然后根据每个空位的最佳得分来判断最佳落子点。
 * @param aiPlayer AI 的棋子类型
 * @param player 玩家的棋子类型
 * @param value 游戏模式配置
 * @param squares 棋盘
 * @returns 最佳落子点
 */
function bestLocation (aiPlayer: string, player: string, value: GameMode, squares: (string | null)[][]) {
    const availSpots = emptyIndexies(squares, value);
    let bestScore = -Infinity;
    let move: [number, number] = [-1, -1]; // 初始化 move 为一个无效位置
    availSpots.forEach(([row, col]) => {
        squares[row][col] = aiPlayer;
        const score = minMax(squares, 0, false, aiPlayer, player, value, -Infinity, Infinity, [row, col]);
        squares[row][col] = null;
        if (score > bestScore) {
            bestScore = score;
            move = [row, col];
        }
    });
    return move;
}

/**
 * 递归调用 minMax 函数从而得到最终结果，然后根据最终结果来获取该位置的得分，如果该步是 AI 落子则判取极大值，如果是玩家落子则取极小值。
 * @param squares 棋盘
 * @param depth 深度（即步数）
 * @param isMaximizing 判断下棋者是 AI 还是玩家
 * @param aiPlayer AI 的棋子类型
 * @param player 玩家的棋子类型
 * @param value 游戏模式配置
 * @param alpha Alpha 剪枝值 当前路径上最大的最小值
 * @param beta Beta 剪枝值 当前路径上最小的最大值
 * @returns 该位置的得分
 */
function minMax (
    squares: (string | null)[][],
    depth: number,
    isMaximizing: boolean,
    aiPlayer: string,
    player: string,
    value: GameMode,
    alpha: number,
    beta: number,
    next: [number, number]
): number {
    const availSpots = emptyIndexies(squares, value);
    const winner = checkWin(next[0], next[1], squares, value);
    const maxDepth = Math.pow(value.chessBoard, 2) + 1;
    if (winner === aiPlayer) {
        return maxDepth - depth;
    } else if (winner === player) {
        return depth - maxDepth;
    } else if (availSpots.length === 0) {
        return 0;
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (const [row, col] of availSpots) {
            squares[row][col] = aiPlayer;
            const score = minMax(squares, depth + 1, false, aiPlayer, player, value, alpha, beta, [row, col]);
            squares[row][col] = null;
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
                break; // Beta cut-off
            }
        }
        return bestScore;
    }
    let bestScore = Infinity;
    for (const [row, col] of availSpots) {
        squares[row][col] = player;
        const score = minMax(squares, depth + 1, true, aiPlayer, player, value, alpha, beta, [row, col]);
        squares[row][col] = null;
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) {
            break; // Alpha cut-off
        }
    }
    return bestScore;
}

/**
 * 获取棋盘的所有空位
 * @param squares 棋盘
 * @param value 游戏模式配置
 * @returns 空位数组
 */
function emptyIndexies (squares: (string | null)[][], value: GameMode): [number, number][] {
    const res: [number, number][] = [];
    for (let row = 0; row < value.chessBoard; row++) {
        for (let col = 0; col < value.chessBoard; col++) {
            if (!squares[row][col]) {
                res.push([row, col]);
            }
        }
    }
    return res;
}

/**
 * 检查棋盘是否获胜
 * @param squares 棋盘
 * @param value 游戏模式配置
 * @returns 获胜者
 */
function checkWin (row: number, col: number, squares: (string | null)[][], value: GameMode): string | null {
    if (win(row, col, squares[row][col], squares, value)) return squares[row][col];
    return null;
}

export default bestLocation;
