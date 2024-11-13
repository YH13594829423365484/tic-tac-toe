import React, { useState, useEffect, useCallback } from 'react';
import Cell from '../cell';
import win from '../../utills/win';
import './index.css';
interface ChessBoardProps {
    value: GameMode;
}
/**
 *  棋盘组件
 * @returns {JSX.Element}
 */
const ChessBoard: React.FC<ChessBoardProps> = ({ value }) => {
    // 获胜者
    const [winner, setWinner] = useState<string | null>(null);
    // 棋盘上方文字提示
    const [text, setText] = useState<string | null>(null);
    // 棋盘
    const [squares, setSquares] = useState<(string | null)[][]>(value ? Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null))
        : Array.from({ length: 15 }, () => Array(15).fill(null)));
    // 每一步的历史记录
    const [history, setHistory] = useState<(string | null)[][][]>([]);
    // 步数
    const [stepNumber, setStepNumber] = useState<number>(0);
    // 初始化
    useEffect(() => {
        resume();
    }, [value]);
    // 监听棋盘判断胜利或平局
    useEffect(() => {
        let ifOver = 0;
        let res = false;
        for (let row = 0; row < squares.length; row++) {
            for (let col = 0; col < squares.length; col++) {
                if (squares[row][col]) {
                    ifOver++;
                }
                const lastSquares = history[history.length - 2]?.[row]?.[col];
                if (lastSquares !== undefined && lastSquares !== squares[row][col]) {
                    if (win(row, col, squares[row][col], squares, value)) {
                        setWinner(squares[row][col]);
                        setText(`恭喜${squares[row][col]}方获胜`);
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
    }, [squares]);
    // 使用 useCallback 来确保 callback 不会频繁变化
    const memoizedCallback = useCallback(
        (row: number, col: number) => {
            callback(row, col);
        },
        [callback]
    );
    /**
     *
     * 下棋操作
     */
    function callback (rowIndex: number, colIndex: number) {
        if (squares[rowIndex][colIndex] || winner) return;
        const newSquares = JSON.parse(JSON.stringify(squares));
        if (stepNumber % 2 === 0) {
            newSquares[rowIndex][colIndex] = value ? value.player[0] : null;
            setText(`请 ${value.player[1]} 方落子`);
        } else {
            newSquares[rowIndex][colIndex] = value ? value.player[1] : null;
            setText(`请 ${value.player[0]} 方落子`);
        }
        setSquares(newSquares);
        const newHistory = [...history.slice(0, stepNumber + 1), newSquares];
        setHistory(newHistory);
        setStepNumber(newHistory.length - 1);
    }
    /**
     *
     * 重新开始
     */
    function resume () {
        setHistory([Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null))]);
        setSquares(Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null)));
        setWinner(null);
        setStepNumber(0);
        setText(`请 ${value.player[0]} 方落子`);
    }
    /**
     *
     * 返回
     */
    function back (stepValue: (string | null)[][], index: number) {
        setSquares(stepValue);
        setStepNumber(index);
        if (index === 0 && value) {
            setWinner(null);
            setText(`请 ${value.player[0]} 方落子`);
            setSquares(Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null)));
            return;
        }
        if (index === history.length - 1) {
            if (text === '平局') {
                return;
            }
            if (winner) return;
        }
        if (index % 2 === 1) {
            setText(value ? `请 ${value.player[1]} 方落子` : null);
        } else {
            setText(value ? `请 ${value.player[0]} 方落子` : null);
        }
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
                    <Cell
                        key={colIndex}
                        value={squares[rowIndex]?.[colIndex] ?? ''}
                        onClick={() => memoizedCallback(rowIndex, colIndex)}
                    />
                ))}
            </tr>
        );
    };
    return (
        <>
            <div className='head-text'>{value ? value.name : ''}</div>
            <div className='head'>
                <div className='head-left'>{text}</div>
                {value && <button className='head-right' onClick={resume}>重新开始</button>}
            </div>
            <div className='body'>
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
