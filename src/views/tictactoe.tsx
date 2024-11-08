import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import Square from '../components/square';
import "../components/squaree.css"
const Tictactoe = () => {
    const [win, setWin] = useState<string | null>("请 X方 落子")
    const [type, setType] = useState(true)
    const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null));
    const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
    const [stepNumber, setStepNumber] = useState<number>(0);
    // 下棋操作
    function clickCallback(index: number) {
        if (winner(squares) || squares[index]) return
        const arr = [...squares]
        if (type) {
            arr[index] = "X"
            setWin("请 O方 落子")
        } else {
            arr[index] = "O"
            setWin("请 X方 落子")
        }
        setSquares(arr)
        setType(!type)
        const newHistory = [...history.slice(0, stepNumber + 1), arr];
        setHistory(newHistory);
        setStepNumber(newHistory.length - 1);
        console.log(history);
        let ifOVer = 0
        squares.forEach((Element) => {
            if (typeof Element === "string") {
                ifOVer++
            }
            if (ifOVer === 8) {
                return setWin("平局")
            }
        })
        if (winner(arr) === "X") {
            return setWin("X方获胜")
        } else if (winner(arr) === "O") {
            return setWin("O方获胜")
        }
    }
    return (
        <>
            <Link to="/">返回首页</Link>
            <h2 style={{ textAlign: 'center' }}>井字棋游戏</h2>
            <div className='head'>
                <div className='headLeft'>{win}</div>
                <button onClick={resume}>重新开始</button>
            </div>
            <div className='content'>
                <div>
                    <div className='row'>
                        <Square value={squares[0]} callback={() => clickCallback(0)}></Square>
                        <Square value={squares[1]} callback={() => clickCallback(1)}></Square>
                        <Square value={squares[2]} callback={() => clickCallback(2)}></Square>
                    </div>
                    <div className='row'>
                        <Square value={squares[3]} callback={() => clickCallback(3)}></Square>
                        <Square value={squares[4]} callback={() => clickCallback(4)}></Square>
                        <Square value={squares[5]} callback={() => clickCallback(5)}></Square>
                    </div>
                    <div className='row'>
                        <Square value={squares[6]} callback={() => clickCallback(6)}></Square>
                        <Square value={squares[7]} callback={() => clickCallback(7)}></Square>
                        <Square value={squares[8]} callback={() => clickCallback(8)}></Square>
                    </div>
                </div>
                <div style={{marginRight:"10px"}}>
                    {history.map((value, index) => (
                        <div key={index}>
                            <button onClick={() => back(value, index)}>返回第{index}步</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
    // 判断获胜方
    function winner(squares: Array<string | null>): string | null {
        const arr = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < arr.length; i++) {
            const [a, b, c] = arr[i]
            if (squares[a] === squares[b] && squares[a] === squares[c] && squares[a]) {
                return squares[a]
            }
        }
        return null
    }
    // 重新开始
    function resume() {
        setSquares(Array(9).fill(null))
        setWin("请 X方 落子")
        setType(true)
        setHistory([Array(9).fill(null)])
    }
    // 返回某一步
    function back(value: (string | null)[], index: number) {
        setSquares(value)
        setStepNumber(index);
        const val: number = index % 2
        if (val === 1) {
            setType(false)
            setWin("请 O方 落子")
        } else {
            setType(true)
            setWin("请 X方 落子")
        }
        if (winner(value)) return setWin(winner(value) + "方获胜")
        let ifOVer = 0
        value.forEach((Element) => {
            if (typeof Element === "string") {
                ifOVer++
            }
            if (ifOVer === 9) {
                return setWin("平局")
            }
        })
    }
};

export default Tictactoe;