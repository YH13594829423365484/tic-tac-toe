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
    gameMode: string;
    sequence: string;
}
/**
* class模式的chessboard
*/
class ChessBoardClass extends React.Component<ChessBoardProps, ChessBoardState> {
    constructor(props: ChessBoardProps) {
        super(props);
        this.state = {
            gameMode: 'AI模式',
            sequence: '先手',
        };
    }

    // 初始化
    componentDidMount() {
        this.resume();
    }

    /**
    * 数据更新时 prevProps和prevState为更新前的数据
    * @param prevProps
    * @param prevState
    */
    componentDidUpdate(prevProps: ChessBoardProps) {
        if (prevProps.value !== this.props.value) {
            this.resume();
        }
        if (this.state.gameMode === 'AI模式' && this.props.value.chessBoard === 3) {
            this.aiPlayer();
        }
        this.checkWin();
        this.checkDraw();
    }
    /**
     * 根据先手后顺序来判断第一步需要怎么落子
     * 优先落子棋盘中间位置
     * 否则落子四个角落
     */
    aiPlayer = () => {
        const { value, squares, stepNumber } = this.props;
        if (!value || !squares || stepNumber === undefined) return;
        if (this.state.sequence === '后手') {
            if (stepNumber === 0) {
                this.callback(1, 1);
            } else if (stepNumber % 2 === 0) {
                if (stepNumber === 2 && squares[0][1] === value.player[1]) {
                    this.callback(2, 0);
                } else {
                    const [row, col] = this.aiWin(value.player[0], value.player[1]);
                    this.callback(row, col);
                }
            }
        } else {
            const [row, col] = this.aiWin(value.player[1], value.player[0]);
            if (stepNumber === 1) {
                squares[1][1] === null ? this.callback(1, 1) : this.callback(row, col);
            } else if (stepNumber % 2 === 1) {
                this.callback(row, col);
            }
        }
    };
    /**
     * 判断AI落子位置
     * 当下一步为AI落子时判断玩家和AI是否存在可以获胜的可能
     * 如果AI可以获胜则直接获胜
     * 否则如果玩家可以获胜则拦截
     * 最后再考虑是否需要营造获胜机会
     */
    aiWin = (ai: string, player: string) => {
        const { value, squares, stepNumber } = this.props;
        if (!value || !squares || stepNumber === undefined) return [1, 1];
        // 拦截位置
        let interception: [number, number] = [1, 1];
        for (let row = 0; row < value.chessBoard; row++) {
            for (let col = 0; col < value.chessBoard; col++) {
                if (squares[row][col] === null) {
                    if (stepNumber >= 2) {
                        // ai获胜
                        if (win(row, col, ai, squares, value)) {
                            return [row, col];
                        }
                        // 玩家获胜
                        if (win(row, col, player, squares, value)) {
                            interception = [row, col];
                        }
                    }
                }
            }
        }
        if (!(interception[0] === 1 && interception[1] === 1)) {
            return interception;
        }
        const optimalMoves = [
            [0, 0], [0, 2], [2, 0], [2, 2], // 角落
            [0, 1], [1, 0], [1, 2], [2, 1], // 边缘
        ];
        for (const move of optimalMoves) {
            const [row, col] = move;
            if (squares[row][col] === null) {
                return [row, col];
            }
        }
        return [1, 1];
    };
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
        const { value, winner, dispatch, text } = this.props;
        dispatch(setSquares(stepValue));
        dispatch(setStepNumber(index + 1));
        if (index !== history.length - 1) {
            dispatch(setWinner(null));
        } else {
            if (text === '平局') return;
            if (winner) return;
        }
        index % 2 === 0 ? dispatch(setText(`请 ${value.player[1]} 方落子`)) : dispatch(setText(`请 ${value.player[0]} 方落子`));
    };
    /**
     *选择游戏模式
     */
    changePlayMode() {
        this.state.gameMode === 'AI模式' ? this.setState({ gameMode: '玩家对战' }) : this.setState({ gameMode: 'AI模式' });
        this.resume();
    }
    /**
     * 选择下棋顺序
     */
    changeSequence() {
        this.state.sequence === '先手' ? this.setState({ sequence: '后手' }) : this.setState({ sequence: '先手' });
        this.resume();
    }
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

    render() {
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
                    {this.props.value.chessBoard === 3 && (
                        <div>
                            <div className='playMode'>
                                <span>请选择对战模式</span>
                                <button className='middle' disabled={this.state.gameMode === 'AI模式'} onClick={() => this.changePlayMode()}>{'AI模式'}</button>
                                <button disabled={this.state.gameMode === '玩家对战'} onClick={() => this.changePlayMode()}>{'玩家对战'}</button>
                            </div>
                            <div className='sequence'>
                                <span>请选择下棋顺序</span>
                                <button className='middle' disabled={!(this.state.gameMode === 'AI模式' && this.state.sequence === '后手')} onClick={() => this.changeSequence()}>{'先手'}</button>
                                <button disabled={!(this.state.gameMode === 'AI模式' && this.state.sequence === '先手')} onClick={() => this.changeSequence()}>{'后手'}</button>
                            </div>
                        </div>
                    )}
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
