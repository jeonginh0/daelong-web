import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/history.css';

const History = () => {
    const [history, setHistory] = useState([
        { id: 1, dateTime: '2024.07.19 17:00', activity: '사용자 로그인' },
        { id: 2, dateTime: '2024.07.19 17:05', activity: '프로필 업데이트' },
        { id: 3, dateTime: '2024.07.19 17:10', activity: '사용자 로그아웃' }
    ]);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
            setCurrentDateTime(formattedDateTime);
        };

        updateDateTime(); // 초기 설정
        const intervalId = setInterval(updateDateTime, 1000); // 매 초 업데이트

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
    }, []);

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
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                        {currentDateTime}
                    </div>
                    <div className="large-box">
                        <ul className="history-list">
                            {history.map((item) => (
                                <li key={item.id} className="history-item">
                                    <span className="history-id">{item.id}</span>
                                    <span className="history-datetime">{item.dateTime}</span>
                                    <span className="history-activity">{item.activity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
