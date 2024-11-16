import React from 'react';
import { connect } from 'react-redux';
import { setHistory, setWinner, setText, setStepNumber, setSquares } from '../../actions';
import Cell from '../cell';
import win from '../../utills/win';
import './index.css';

interface HistoryItem {
    squares: (string | null)[][];
}
// 组件接收的数据
interface ChessBoardProps {
    value: GameMode;
    history: HistoryItem[];
    winner: string | null;
    text: string | null;
    stepNumber: number;
    squares: (string | null)[][];
    dispatch: (action: any) => void;
}

// 组件内部的数据
interface ChessBoardState {
}
/**
* class模式的chessboard
*/
class ChessBoardClass extends React.Component<ChessBoardProps, ChessBoardState> {
    constructor (props: ChessBoardProps) {
        super(props);
    }

    // 初始化
    componentDidMount () {
        this.resume();
    }

    /**
    * 数据更新时 prevProps和prevState为更新前的数据
    * @param prevProps
    * @param prevState
    */
    componentDidUpdate (prevProps: ChessBoardProps) {
        if (prevProps.value !== this.props.value) {
            this.resume();
        }
        this.checkWin();
        this.checkDraw();
    }

    /**
    *
    * @returns 检查是否获胜
    */
    checkWin = () => {
        const { value, squares, winner, history, dispatch } = this.props;
        for (let row = 0; row < squares.length; row++) {
            for (let col = 0; col < squares.length; col++) {
                if (squares[row][col] && !winner) {
                    const lastSquares = history[history.length - 2]?.squares;
                    if (lastSquares !== undefined && lastSquares[row][col] !== squares[row][col]) {
                        if (win(row, col, squares[row][col], squares, value)) {
                            dispatch(setText(`恭喜${squares[row][col]}方获胜`));
                            dispatch(setWinner(squares[row][col]));
                        }
                    }
                }
            }
        }
    };
    /**
    * 检查是否平局
    */
    checkDraw = () => {
        const { squares, value, winner, dispatch } = this.props;
        const ifOver = squares.reduce((count, row) => count + row.filter(cell => cell).length, 0);
        if (ifOver === Math.pow(value.chessBoard, 2) && !winner) {
            dispatch(setText('平局'));
        }
    };
    /**
    * 下棋操作
    * @param rowIndex
    * @param colIndex
    * @returns
    */
    callback = (rowIndex: number, colIndex: number) => {
        const { squares, value, winner, dispatch, stepNumber, history } = this.props;
        if (squares[rowIndex][colIndex] || winner) return;
        const newSquares = JSON.parse(JSON.stringify(squares));
        const [firstPlayer, secondPlayer] = value.player;
        if (stepNumber % 2 === 0) {
            newSquares[rowIndex][colIndex] = firstPlayer;
            dispatch(setText(`请 ${secondPlayer} 方落子`));
        } else {
            newSquares[rowIndex][colIndex] = secondPlayer;
            dispatch(setText(`请 ${firstPlayer} 方落子`));
        }
        dispatch(setSquares(newSquares));
        const newHistory = [
            ...history.slice(0, stepNumber),
            { squares: newSquares },
        ];
        dispatch(setHistory(newHistory));
        dispatch(setStepNumber(newHistory.length));
    };
    /**
    * 重置
    */
    resume = () => {
        const { value, dispatch } = this.props;
        dispatch(setHistory([]));
        dispatch(setSquares(Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null))));
        dispatch(setWinner(null));
        dispatch(setStepNumber(0));
        dispatch(setText(`请 ${value.player[0]} 方落子`));
    };
    /**
    * 返回操作
    * @param stepValue
    * @param index
    * @returns
    */
    back = (stepValue: (string | null)[][], index: number) => {
        const {  value, winner, dispatch, text } = this.props;
        dispatch(setSquares(stepValue));
        dispatch(setStepNumber(index + 1));
        dispatch(setWinner(null));
        if (index === 0) {
            dispatch(setWinner(null));
            dispatch(setText(`请 ${value.player[0]} 方落子`));
            dispatch(setSquares(Array.from({ length: value.chessBoard }, () => Array(value.chessBoard).fill(null))));
            return;
        }
        if (index === history.length - 1) {
            if (text === '平局') return;
            if (winner) return;
        }
        index % 2 === 0 ? dispatch(setText(`请 ${value.player[1]} 方落子`)) : dispatch(setText(`请 ${value.player[0]} 方落子`));
    };
    /**
    * 渲染棋盘
    * @param rowIndex
    * @returns
    */
    renderRow = (rowIndex: number) => {
        const { squares, value } = this.props;
        const boardSize = value.chessBoard;
        return (
            <tr key={rowIndex}>
                {[...Array(boardSize)].map((__, colIndex) => (
                    <Cell
                        key={colIndex}
                        row={rowIndex}
                        col={colIndex}
                        value={squares[rowIndex]?.[colIndex] ?? ''}
                        onClick={this.callback}
                    />
                ))}
            </tr>
        );
    };

    render () {
        return (
            <>
                <div className='head'>
                    <div className='head-left'>{this.props.text}</div>
                    <button className='head-right' onClick={this.resume}>重新开始</button>
                </div>
                <div className='body'>
                    <div>
                        <div className='content'>
                            <table>
                                <tbody>
                                    {[...Array(this.props.value.chessBoard)].map((__, rowIndex) => this.renderRow(rowIndex))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='history'>
                        {this.props.history.map((stepValue: any, index: number) => (
                            <div key={index}>
                                <button onClick={() => this.back(stepValue.squares, index)}>返回第{index + 1}步</button>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}
/**
* 获取store中的数据
* @param state
* @returns
*/
const stateProps = (state: any) => ({
    history: state.history,
    squares: state.squares,
    winner: state.winner,
    stepNumber: state.stepNumber,
    text: state.text,
});

/**
* 对store中的数据进行修改
* @param dispatch
* @returns
*/
const dispatchProps = (dispatch: any) => ({ dispatch });

export default connect(stateProps, dispatchProps)(ChessBoardClass);