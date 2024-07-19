import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/history.css';

// history.jsx
const History = () => {
    const [history, setHistory] = useState(['history1', 'history2', 'history3']);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const goRootPage = () => {
        navigate("/");
    };

    return (
        <div className="vid-container1">
            <div className="inner-container1">
                <div className="box3">
                    <div
                        onClick={goRootPage}
                        style={{cursor: 'pointer', textAlign: 'center', marginBottom: '30px'}}
                    >
                        {/* Root 페이지로 이동하는 버튼 */}
                    </div>
                    <h1 style={{textAlign: 'center', marginBottom: '30px'}}>히스토리</h1>
                    <div className="large-box">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
