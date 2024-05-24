import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/button.css';
import '../style/screen.css';

const MainPage = () => {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();
    const usageModalRef = useRef();
    const startModalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (usageModalRef.current && !usageModalRef.current.contains(event.target)) {
                setIsUsageModalOpen(false);
            }
            if (startModalRef.current && !startModalRef.current.contains(event.target)) {
                setIsStartModalOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = () => {
        navigate('/map/' + addresses.map(address => encodeURIComponent(address)).join(','));
    };

    const handleChange = (index, value) => {
        const newAddresses = [...addresses];
        newAddresses[index] = value;
        setAddresses(newAddresses);
    };

    const handleAddAddress = () => {
        setAddresses([...addresses, ""]);
    };

    const goMyPage = () => {
        navigate("/mypage/");
    }

    const goLoginPage = () => {
        navigate("/login/");
    }

    const goSignUpPage = () => {
        navigate("/signup/");
    }

    return (
        <main>
            <div className="head_screen">
                <div className="logo_wrapper">
                    <img src="/teamlogo.png" alt="로고" width="200px" height="90px"/>
                </div>
                <div className="myPageBtn" onClick={goMyPage}>마이페이지</div>
                <div className="loginBtn" onClick={goLoginPage}>로그인</div>
                <div className="signupBtn" onClick={goSignUpPage}>회원가입</div>
            </div>
            <div className="main_screen">
                <img src="/mapd.png" alt="메인이미지" className="background_image" />
                <div className="text_screen">
                    <div className="overlay">
                        <h1 className="main_text">Meeting Service</h1>
                        <p className="sub_text1">Team Do-Dam Web Application</p>
                        <div className="expServiceBtn" onClick={() => setIsUsageModalOpen(true)}>
                            사용방법
                        </div>
                        <div className="startServiceBtn" onClick={() => setIsStartModalOpen(true)}>
                            사용하기
                        </div>
                    </div>
                </div>
                {isUsageModalOpen && (
                    <div className={`modal ${isUsageModalOpen ? 'show' : ''}`} ref={usageModalRef}>
                        <div className="modal-background" onClick={() => setIsUsageModalOpen(false)}></div>
                        <div className={`modal-content ${isUsageModalOpen ? 'show' : ''}`}>
                            <span className="close" onClick={() => setIsUsageModalOpen(false)}>&times;</span>
                            <p>여기에 사용 방법에 대한 내용을 작성합니다.</p>
                        </div>
                    </div>
                )}
                {isStartModalOpen && (
                    <div className={`modal ${isStartModalOpen ? 'show' : ''}`} ref={startModalRef}>
                        <div className="modal-background" onClick={() => setIsStartModalOpen(false)}></div>
                        <div className={`modal-content ${isStartModalOpen ? 'show' : ''}`}>
                            <span className="close" onClick={() => setIsStartModalOpen(false)}>&times;</span>
                            {addresses.map((address, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        placeholder="주소를 입력해주세요."
                                    />
                                    {index !== addresses.length - 1 && <br />}
                                </div>
                            ))}
                            <button onClick={handleAddAddress}>+ 추가</button>
                            <button onClick={handleSubmit}>여기서 만나자!</button>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <p className="sub_text2">daelongdaelong.official</p>
            </div>
        </main>
    );
};

export default MainPage;