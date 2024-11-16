import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import configureStore from './store/index';
import { Provider } from 'react-redux';
import Home from '../src/views/home/index';

const store = configureStore();
/**
* The main application component.
* @returns {JSX.Element} The rendered App component.
*/
function App() {
    return (
        <Provider store={store}>
            <Router>
                <>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </>
            </Router>
        </Provider>
    );
}

export default App;
