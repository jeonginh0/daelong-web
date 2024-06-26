import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from "./component/MainPage";
import MyPage from "./component/MyPage";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Map from './component/Map';
import './style/map.css';
import './style/button.css'

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/map" element={<Map />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;