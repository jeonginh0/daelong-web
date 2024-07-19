import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from "./component/MainPage";
import History from "./component/History";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Map from './component/Map';
import './style/map.css';
import './style/button.css';
import Navbar from "./component/Navigation";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Router>
                <div className="App">
                    <Navbar/>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/history" element={<History />} />
                            <Route path="/login"
                                   element={<Login onLogin={(username) => console.log("Logged in as", username)}/>}/>
                            <Route path="/signup" element={<Signup/>}/>
                            <Route path="/map" element={<Map/>}/>
                        </Routes>
                </div>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
