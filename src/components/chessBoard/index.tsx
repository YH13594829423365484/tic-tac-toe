import React, { useState, useEffect } from 'react';
import './index.css';
interface ChessBoardProps {
    value: GameMode | null;
}
/**
 *  棋盘组件
 * @returns {JSX.Element}
 */
const ChessBoard: React.FC<ChessBoardProps> = ({ value }) => {
    const [winner, setWinner] = useState<string | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [type, setType] = useState(true);
    const [squares, setSquares] = useState<(string | null)[][]>(value ? Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null))
        : Array.from({ length: 15 }, () => Array(15).fill(null)));
    const [history, setHistory] = useState<(string | null)[][][]>([]);
    const [stepNumber, setStepNumber] = useState<number>(0);
    // 初始化
    useEffect(() => {
        if (value) {
            resume();
        }
    }, [value]);
    // 监听棋盘判断胜利
    useEffect(() => {
        if (value) {
            let ifOver = 0;
            let res = false;
            for (let row = 0; row < squares.length; row++) {
                for (let col = 0; col < squares.length; col++) {
                    if (squares[row][col]) {
                        ifOver++;
                        if (win(row, col, squares[row][col], squares)) {
                            res = true;
                            break;
                        }
                    }
                }
            }
            if (ifOver === Math.pow(value.chessBoard, 2)) {
                return setText('平局');
            }
            if (!res) {
                setWinner(null);
            }
        }
    }, [squares]);
    /**
     *
     * 下棋操作
     */
    function callback(rowIndex: number, colIndex: number) {
        if (squares[rowIndex][colIndex] || winner) return;
        const newSquares = JSON.parse(JSON.stringify(squares));
        if (value) {
            if (type) {
                newSquares[rowIndex][colIndex] = value ? value.player[0] : null;
                setText(`请 ${value.player[1]} 方落子`);
            } else {
                newSquares[rowIndex][colIndex] = value ? value.player[1] : null;
                setText(`请 ${value.player[0]} 方落子`);
            }
        }
        setSquares(newSquares);
        setType(!type);
        const newHistory = [...history.slice(0, stepNumber + 1), newSquares];
        setHistory(newHistory);
        setStepNumber(newHistory.length - 1);
    }
    /**
     *
     * 重新开始
     */
    function resume() {
        if (value) {
            setHistory([Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null))]);
            setSquares(Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null)));
            setType(true);
            setWinner(null);
            setStepNumber(0);
            setText(`请 ${value.player[0]} 方落子`);
        }
    }
    /**
     *
     * 返回
     */
    function back(stepValue: (string | null)[][], index: number) {
        setSquares(stepValue);
        setStepNumber(index);
        if (index === 0 && value) {
            setWinner(null);
            setText(`请 ${value.player[0]} 方落子`);
            setType(true);
            setSquares(Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null)));
            return;
        }
        const val: number = index % 2;
        if (index === history.length - 1) {
            if (text === '平局') {
                return;
            }
            if (winner) return;
        }
        if (value) {
            if (val === 1) {
                setType(false);
                setText(value ? `请 ${value.player[1]} 方落子` : null);
            } else {
                setType(true);
                setText(value ? `请 ${value.player[0]} 方落子` : null);
            }
        }
    }
    /**
     *
     * 判断获胜
     */
    function win(row: number, col: number, player: string | null, squares: (string | null)[][]): boolean {
        if (!value || !player) return false;
        if (value) {
            const directions = [
                { dx: 0, dy: 1 },  // 水平
                { dx: 1, dy: 0 },  // 垂直
                { dx: 1, dy: 1 },  // 右上
                { dx: -1, dy: 1 },  // 左上
            ];

            for (const { dx, dy } of directions) {
                let count = 1;

                // 检查方向
                for (let playerNum = 0; playerNum < 2; playerNum++) {
                    for (let winNum = 1; winNum < value.winRule; winNum++) {
                        let newRow; let newCol;
                        if (playerNum === 0) {
                            newRow = row + (winNum * dx);
                            newCol = col + (winNum * dy);
                        } else {
                            newRow = row - (winNum * dx);
                            newCol = col - (winNum * dy);
                        }
                        if (
                            newRow >= 0 &&
                            newRow < (value.chessBoard) &&
                            newCol >= 0 &&
                            newCol < (value.chessBoard) &&
                            squares[newRow][newCol] === player
                        ) {
                            count++;
                        } else {
                            break;
                        }
                    }
                }

                if (count >= (value.winRule)) {
                    setWinner(player);
                    if (value) setText(`恭喜${player}方获胜`);
                    return true;
                }
            }
        }
        return false;
    }
    /**
    * 渲染棋盘
    */
    const renderRow = (rowIndex: number) => {
        // 检查 value 和 chessBoard 是否存在
        const boardSize = value?.chessBoard ?? 0;
        return (
            <tr key={rowIndex}>
                {[...Array(boardSize)].map((__, colIndex) => (
                    <td key={colIndex} onClick={() => callback(rowIndex, colIndex)}>
                        {squares[rowIndex]?.[colIndex] ?? ''}
                    </td>
                ))}
            </tr>
        );
    };
    return (
        <>
            <div style={{ textAlign: 'center', margin: '5px 0' }}>{value ? value.name : ''}</div>
            <div className='head'>
                <div className='headLeft'>{text}</div>
                {value && <button className='headRight' onClick={resume}>重新开始</button>}
            </div>
            <div className='body' style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    <div className='content'>
                        <table>
                            <tbody>
                                {value ? [...Array(value?.chessBoard)].map((__, rowIndex) => renderRow(rowIndex)) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='history'>
                    {history.map((stepValue, index) => (
                        <div key={index}>
                            <button onClick={() => back(stepValue, index)}>返回第{index}步</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
export default ChessBoard;
