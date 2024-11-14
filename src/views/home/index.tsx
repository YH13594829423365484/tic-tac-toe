import React, { useState } from 'react';
import { gameMode, componentMode } from '../../modeData/index';
import ChessBoard from '../../components/chessBoard/index';
import ChessBoardClass from '../../components/chessBoardClass/index';
import './inedx.css';
/**
 *  app
 * @returns {JSX.Element}
 */
const Home = () => {
    // 游戏模式
    const [mode, setMode] = useState<GameMode>(gameMode[0]);
    // 组件模式
    const [component, setComponent] = useState<string>(componentMode[0]);
    /**
    *点击选择游戏模式
    * @param {React.MouseEvent<HTMLElement>}
    */
    function choose (index: number) {
        setMode(gameMode[index]);
    }
    /**
     * 点击选择组件模式
     * @param index
     */
    function change (index:number) {
        setComponent(componentMode[index]);
    }

    return (
        <>
            <div className='home-page'>
                <div>
                    <div className='component-mode'>请选择你要进行的组件模式
                        <div>
                            {componentMode.map((component, index) => (
                                <button className='home-button' key={index} onClick={() => change(index)}>{component}</button>
                            ))}
                        </div>
                    </div>
                    <div className='text'>
                        {component}
                    </div>
                    <div className='component-mode'>请选择你要进行的游戏模式
                        <div>
                            {gameMode.map((mode, index) => (
                                <button className='home-button' key={index} onClick={() => choose(index)}>{mode.name.slice(0, mode.name.length - 2)}</button>
                            ))}
                        </div>
                    </div>
                    <div className='text'>
                        {mode.name}
                    </div>
                </div>
            </div>
            {component === 'hooks' ? <ChessBoard value={mode}></ChessBoard> : <ChessBoardClass value={mode}></ChessBoardClass>}
        </>
    );
};

export default Home;
