import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import React from 'react';
import Home from "../src/views/home"
import Gobang from "../src/views/gobang"
import Tictactoe from "../src/views/tictactoe"
import './App.css'

function App() {

  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tictactoe" element={<Tictactoe />} />
          <Route path="/gobang" element={<Gobang />} />
        </Routes>
      </>
    </Router>
  )
}

export default App
