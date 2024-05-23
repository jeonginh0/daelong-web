import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './component/Map';
import MainPage from "./component/MainPage";
import './styles/style.css';
import './styles/button.css';
import Signup from "./component/Signup";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/map" element={<Map />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
