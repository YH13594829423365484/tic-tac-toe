import React, { useState } from 'react';
import { gameMode } from '../../modeData/index';
import ChessBoardClass from '../../components/chessBoardClass/index';
import './inedx.css';
/**
*  app
* @returns {JSX.Element}
*/
const Home = () => {
    const [mode, setMode] = useState<GameMode>(gameMode[0]);
    /**
    *点击选择游戏模式
    * @param {React.MouseEvent<HTMLElement>}
    */
    function choose (index: number) {
        setMode(gameMode[index]);
    }

    return (
        <>
            <div className='home-page'>
                <div>
                    <div>请选择你要进行的游戏模式</div>
                    <div className='home-game'>
                        {gameMode.map((mode, index) => (
                            <button className='home-button' key={index} onClick={() => choose(index)}>{mode.name.slice(0, mode.name.length - 2)}</button>
                        ))}
                    </div>
                </div>
            </div>
            <ChessBoardClass value={mode}></ChessBoardClass>
        </>
    );
};

export default Home;
