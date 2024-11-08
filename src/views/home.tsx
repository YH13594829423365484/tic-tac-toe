import {
    Link
} from 'react-router-dom';
import React from 'react';
const Home = () => {
    return (
        <>
            <div className='homePage'>
                <ul>
                    <div>请选择你要进行的游戏模式</div>
                    <li>
                        <Link to="/tictactoe">井字棋</Link>
                    </li>
                    <li>
                        <Link to="/gobang">五子棋</Link>
                    </li>
                </ul>
            </div>
        </>
    )
};

export default Home;