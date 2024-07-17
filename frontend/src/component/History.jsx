import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/history.css';

const History = () => {
    const [history, setHistory] = useState(['history1', 'history2', 'history3']);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const goRootPage = () => {
        navigate("/");
    };
    const goHistoryPage = () => {
        navigate("/history");
    }

    return (
        <main className="main">
            <aside className="sidebar">
                <nav className="nav">
                    <ul>
                        <li><a href="#" >사용 내역</a></li>
                    </ul>
                </nav>
            </aside>
        </main>
    );
};

export default History;
