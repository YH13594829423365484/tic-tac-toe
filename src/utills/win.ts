/**
 *
 * 判断获胜
 */
function win (row: number, col: number, player: string | null, squares: (string | null)[][], value: GameMode): boolean {
    if (!value || !player) return false;
    const directions = [
        { dx: 0, dy: 1 },  // 水平
        { dx: 1, dy: 0 },  // 垂直
        { dx: 1, dy: 1 },  // 右上
        { dx: -1, dy: 1 },  // 左上
    ];
    /**
 *
 * @returns 获取相同方向上的相同棋子数量
 */
    function getLineCount () {
        let maxCount = 0;
        for (const { dx, dy } of directions) {
            let count = 1;

            // 检查正方向
            for (let winNum = 1; winNum < value.winRule; winNum++) {
                const rRow = row + (winNum * dx);
                const rCol = col + (winNum * dy);
                if (
                    rRow >= 0 &&
                    rRow < value.chessBoard &&
                    rCol >= 0 &&
                    rCol < value.chessBoard &&
                    squares[rRow][rCol] === player
                ) {
                    count++;
                } else {
                    break;
                }
            }

            // 检查反方向
            for (let winNum = 1; winNum < value.winRule; winNum++) {
                const dRow = row - (winNum * dx);
                const dCol = col - (winNum * dy);
                if (
                    dRow >= 0 &&
                    dRow < value.chessBoard &&
                    dCol >= 0 &&
                    dCol < value.chessBoard &&
                    squares[dRow][dCol] === player
                ) {
                    count++;
                } else {
                    break;
                }
            }
            maxCount = Math.max(maxCount, count);
        }
        return maxCount;
    }
    return getLineCount() >= value.winRule;
}
export default win;

