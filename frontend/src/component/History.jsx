import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/history.css';
import axios from "axios";

const History = () => {
    const [histories, setHistories] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistories = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8000/api/user/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = response.data;
                console.log('User data:', user);  // 데이터 확인을 위한 로깅

                if (user.history) {
                    try {
                        const historyArray = JSON.parse(user.history);
                        console.log('Parsed history:', historyArray);  // 파싱된 데이터 확인

                        if (Array.isArray(historyArray)) {
                            setHistories(historyArray);
                        } else {
                            console.error('History is not an array:', historyArray);
                            setHistories([]);  // 잘못된 형식일 경우 빈 배열로 설정
                        }
                    } catch (e) {
                        console.error('Failed to parse history:', e);
                        setHistories([]);  // 파싱 실패 시 빈 배열로 설정
                    }
                } else {
                    setHistories([]);  // history 필드가 없을 경우 빈 배열로 설정
                }
            } catch (error) {
                console.error('Error fetching histories:', error.response?.data || error.message);
                setHistories([]);  // 에러 발생 시 빈 배열로 설정
            }
        };

        const updateDateTime = () => {
            const now = new Date();
            const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
            setCurrentDateTime(formattedDateTime);
        };

        updateDateTime(); // 초기 설정
        const intervalId = setInterval(updateDateTime, 1000); // 매 초 업데이트

        fetchHistories();
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
    }, []);

    const handleLinkClick = (url) => {
        navigate(url);
    };
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
                    <h1 style={{textAlign: 'center', marginBottom: '30px'}}>사용기록</h1>
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                        {currentDateTime}
                    </div>
                    <div className="large-box">
                        <ul className="history-list">
                            {histories.length > 0 ? (
                                histories.map((url, index) => (
                                    <li key={index} className="history-item">
                                        <span className="history-id">{index + 1}</span>
                                        <a href="#" className="history-datetime" onClick={() => handleLinkClick(url)}>
                                            사용기록 {index + 1}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li>No saved URLs</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;