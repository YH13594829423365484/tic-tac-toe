import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setHistory, setWinner, setText, setStepNumber, setSquares } from '../../actions';
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
    const dispatch = useDispatch();
    // 获胜者
    const winner = useSelector((state: any) => state.winner);
    // 棋盘上方文字提示
    const text = useSelector((state: any) => state.text);
    // 棋盘
    const squares = useSelector((state: any) => state.squares);
    // 每一步的历史记录
    const history = useSelector((state: any) => state.history);
    // 步数
    const stepNumber = useSelector((state: any) => state.stepNumber);
    // 落子位置
    const [location, setLocation] = useState<number[]>([]);
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
                    const lastSquares = history[history.length - 2] ? history[history.length - 2].squares : undefined;
                    if (lastSquares !== undefined && lastSquares !== squares[row][col]) {
                        if (win(row, col, squares[row][col], squares, value)) {
                            dispatch(setWinner(squares[row][col]));
                            dispatch(setText(`恭喜${squares[row][col]}方获胜`));
                            res = true;
                            break;
                        }
                    }
                }
            }
        }
        if (ifOver === Math.pow(value.chessBoard, 2)) {
            dispatch(setText('平局'));
        }
        if (!res) {
            dispatch(setWinner(null));
        }
    }, [squares]);
    /**
     *
     * 下棋操作
     */
    const callback = useCallback((rowIndex: number, colIndex: number) => {
        setLocation([rowIndex, colIndex]);
    }, []);
    /**
     * 根据落子位置更新数据
     */
    useEffect(() => {
        if (location.length === 0) return;
        if (squares[location[0]][location[1]] || winner) return;
        const newSquares = JSON.parse(JSON.stringify(squares));
        if (stepNumber % 2 === 0) {
            newSquares[location[0]][location[1]] = value ? value.player[0] : null;
            dispatch(setText(`请 ${value.player[1]} 方落子`));
        } else {
            newSquares[location[0]][location[1]] = value ? value.player[1] : null;
            dispatch(setText(`请 ${value.player[0]} 方落子`));
        }
        const newHistory = [...history.slice(0, stepNumber), { squares: newSquares }];
        dispatch(setSquares(newSquares));
        dispatch(setHistory(newHistory));
        dispatch(setStepNumber(newHistory.length));
    }, [location]);
    /**
     *
     * 重新开始
     */
    function resume () {
        setLocation([]);
        dispatch(setHistory([]));
        dispatch(setSquares(Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null))));
        dispatch(setWinner(null));
        dispatch(setStepNumber(0));
        dispatch(setText(`请 ${value.player[0]} 方落子`));
    }
    /**
     *
     * 返回
     */
    function back (stepValue: (string | null)[][], index: number) {
        dispatch(setSquares(stepValue));
        dispatch(setStepNumber(index + 1));
        if (index !== history.length - 1) {
            dispatch(setWinner(null));
        } else {
            if (text === '平局') return;
            if (winner) return;
        }
        index % 2 === 0 ? dispatch(setText(value ? `请 ${value.player[1]} 方落子` : null)) : dispatch(setText(value ? `请 ${value.player[0]} 方落子` : null));
    }
    /**
    * 渲染棋盘
    */
    const renderRow = (rowIndex: number) => {
        // 检查 value 和 chessBoard 是否存在
        const boardSize = value?.chessBoard ?? 0;
        if (squares.length !== boardSize && squares !== 0) return;
        return (
            <tr key={rowIndex}>
                {[...Array(boardSize)].map((__, colIndex) => (
                    <Cell
                        key={colIndex}
                        row={rowIndex}
                        col={colIndex}
                        value={squares[rowIndex][colIndex]}
                        onClick={callback}
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
                    {history.map((stepValue: any, index: number) => (
                        <div key={index}>
                            <button onClick={() => back(stepValue.squares, index)}>返回第{index}步</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
export default ChessBoard;


