import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import Home from '../src/views/home/index';

/**
 * The main application component.
 * @returns {JSX.Element} The rendered App component.
 */
function App () {
    return (
        <Router>
            <>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </>
        </Router>
    );
}

export default App;
