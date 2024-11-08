import './Table.css';
import React,{ useState } from 'react';
const row = 15;
const col = 15;
function Table() {
    const [win, setWin] = useState<string | null>("请 ⚫ 落子")
    const [type, setType] = useState(true)
    const [squares, setSquares] = useState<(string | null)[][]>(Array.from({ length: 15 }, () => Array(15).fill(null)));
    const [history, setHistory] = useState<(string | null)[][][]>([squares]);
    const [stepNumber, setStepNumber] = useState<number>(0);
    // 下棋操作
    function callback(rowIndex: number, colIndex: number) {
        if (winner(squares) || squares[rowIndex][colIndex]) return
        const arr = JSON.parse(JSON.stringify(squares));
        if (type) {
            arr[rowIndex][colIndex] = "⚫"
            setWin("请 ⚪ 落子")
        } else {
            arr[rowIndex][colIndex] = "⚪"
            setWin("请 ⚫ 落子")
        }
        setSquares(arr)
        setType(!type)
        const newHistory = [...history.slice(0, stepNumber + 1), arr];
        setHistory(newHistory);
        setStepNumber(newHistory.length - 1);
        let ifOver = 0
        squares.forEach((Element) => {
            Element.forEach((element) => {
                if (typeof element === "string") {
                    ifOver++
                }
                if (ifOver === 224) {
                    return setWin("平局")
                }
            })
        })
        if (winner(arr) === "⚫") {
            return setWin("⚫方获胜")
        } else if (winner(arr) === "⚪") {
            return setWin("⚪方获胜")
        }
    }
    // 判断是否获胜
    function winner(squares: (string | null)[][]): string | null {
        // 判断某一点上的棋子是否能够五连
        function find(row: number, col: number) {
            const value = squares[row][col]
            let a = 1, b = 1, c = 1, d = 1
            for (let i = 1; i < 5; i++) {
                if (col + i < 15 && squares[row][col + i] === value) a++;
                if (col - i >= 0 && squares[row][col - i] === value) a++;
                if (row + i < 15 && squares[row + i][col] === value) b++;
                if (row - i >= 0 && squares[row - i][col] === value) b++;
                if (row - i >= 0 && col - i >= 0 && squares[row - i][col - i] === value) c++;
                if (row + i < 15 && col + i < 15 && squares[row + i][col + i] === value) c++;
                if (row - i >= 0 && col + i < 15 && squares[row - i][col + i] === value) d++;
                if (row + i < 15 && col - i >= 0 && squares[row + i][col - i] === value) d++;
                const max = Math.max(a, b, c, d)
                if (max >= 5) return value
            }
        }
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (squares[i][j]) {
                    const result = find(i, j);
                    if (result) return result;
                }
            }
        }
        return null
    }
    // 重新开始
    function resume() {
        setHistory([Array.from({ length: 15 }, () => Array(15).fill(null))])
        setSquares(Array.from({ length: 15 }, () => Array(15).fill(null)));
        setWin("请 ⚫ 落子")
        setType(true)
    }
    // 返回
    function back(value: (string | null)[][], index: number) {
        setSquares(value)
        setStepNumber(index);
        const val: number = index % 2
        if (val === 1) {
            setType(false)
            setWin("请 ⚪ 落子")
        } else {
            setType(true)
            setWin("请 ⚫ 落子")
        }
        if (winner(value)) return setWin(winner(value) + "方获胜")
        let ifOver = 0
        squares.forEach((Element) => {
            Element.forEach((element) => {
                if (typeof element === "string") {
                    ifOver++
                }
                if (ifOver === 225) {
                    return setWin("平局")
                }
            })
        })
    }
    const renderRow = (rowIndex: number) => {
        return (
            <tr key={rowIndex}>
                {[...Array(col)].map((_, colIndex) => (
                    <td key={colIndex} onClick={() => callback(rowIndex, colIndex)}>{squares[rowIndex][colIndex]}</td>
                ))}
            </tr>
        );
    };
    return (
        <>
            <h2 style={{ textAlign: 'center' }}>五子棋游戏</h2>
            <div className='head'>
                <div className='headLeft'>{win}</div>
                <button className='headRight' onClick={resume}>重新开始</button>
            </div>
            <div className='content'>
                <table>
                    <tbody>
                        {[...Array(row)].map((_, rowIndex) => renderRow(rowIndex))}
                    </tbody>
                </table>
                <div>
                    {history.map((value, index) => (
                        <div key={index}>
                            <button onClick={() => back(value, index)}>返回第{index}步</button>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
}

export default Table;