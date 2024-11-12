import React, { useState } from 'react';
import { gameMode } from '../../modeData/index';
import ChessBoard from '../../components/chessBoard/index';
import './inedx.css';
/**
 *  app
 * @returns {JSX.Element}
 */
const Home = () => {
    const [mode, setMode] = useState<GameMode | null>(null);
    /**
    *点击选择游戏模式
    * @param {React.MouseEvent<HTMLElement>}
    */
    function choose (index: number) {
        setMode(gameMode[index]);
    }

    return (
        <>
            <div className='homePage'>
                <div>
                    <div>请选择你要进行的游戏模式</div>
                    <div className='homeGame'>
                        {gameMode.map((mode, index) => (
                            <button style={{ margin: '0 10px' }} key={index} onClick={() => choose(index)}>{mode.name.slice(0, mode.name.length - 2)}</button>
                        ))}
                    </div>
                </div>
            </div>
            <ChessBoard value={mode}></ChessBoard>
        </>
    );
};

export default Home;
