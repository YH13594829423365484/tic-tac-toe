export const SET_HISTORY = 'REPLACE_HISTORY';
export const SET_WINNER = 'SET_WINNER';
export const SET_TEXT = 'SET_TEXT';
export const SET_STEPNUMBER = 'SET_STEPNUMBER';
export const SET_SQUARES = 'SET_SQUARES';


export interface HistoryItem {
    squares: (string | null)[][];
}
/**
*
* @param history 修改历史记录
* @returns
*/
export const setHistory = (history: HistoryItem[]) => ({
    type: SET_HISTORY,
    payload: { history },
});
/**
 *
 * @param winner 修改获胜者
 * @returns
 */
export const setWinner = (winner: string | null) => ({
    type: SET_WINNER,
    payload: { winner },
});
/**
 *
 * @param text 修改提示文本
 * @returns
 */
export const setText = (text: string | null) => ({
    type: SET_TEXT,
    payload: { text },
});
/**
 *
 * @param stepNumber 修改步数
 * @returns
 */
export const setStepNumber = (stepNumber: number) => ({
    type: SET_STEPNUMBER,
    payload: { stepNumber },
});
/**
 *
 * @param squares 修改棋盘
 * @returns
 */
export const setSquares = (squares: (string | null)[][]) => ({
    type: SET_SQUARES,
    payload: { squares },
});
