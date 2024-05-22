import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/button.css';

const Button = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const goToMap = () => {
        navigate('/map');
    };

    return (
        <main>
            <div className="expServiceBtn" onClick={togglePopup}>
                사용방법
            </div>
            <div className="startServiceBtn" onClick={goToMap}>
                지도 보기
            </div>
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={togglePopup}>&times;</span>
                        <p>여기에 사용 방법에 대한 내용을 작성합니다.</p>
                        <button onClick={goToMap}>지도 보기</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Button;
