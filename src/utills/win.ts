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
    let count = 1;
    for (const direction of directions) {
        const { dx, dy } = direction;
        count = Math.max((getLineCount(dx, dy) + getLineCount(dx * (-1), dy * (-1))) - 1, count);
    }
    /**
     *
     * @param dx 行
     * @param dy 列
     * @returns 获取方向上的棋子数量
     */
    function getLineCount (dx: number, dy: number) {
        let count = 1;
        while (
            row + dx >= 0 &&
            row + dx < value.chessBoard &&
            col + dy >= 0 &&
            col + dy < value.chessBoard &&
            squares[row + dx][col + dy] === player
        ) {
            if (dx > 0) dx++;
            if (dx < 0) dx--;
            if (dy > 0) dy++;
            if (dy < 0) dy--;
            count++;
        }
        return count;
    }
    return count >= value.winRule;
}
export default win;
