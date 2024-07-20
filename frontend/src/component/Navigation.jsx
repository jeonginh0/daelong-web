import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMouseOverLogo, setIsMouseOverLogo] = useState(false);

    const kakao_token= process.env.REACT_APP_KAKAO_TOKEN_KEY;

    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoading(true);
            setError('');
            const accessToken = localStorage.getItem('access_token');
            const   storedUsername = localStorage.getItem('username');

            if (storedUsername) {
                setUsername(storedUsername);
                setIsLoading(false);
                return;
            }

            if (accessToken) {
                try {
                    const response = await axios.get("http://localhost:8000/api/user/kakao-user/{kakao_id}", {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });

                    if (response.data && response.data.nickname) {
                        setUsername(response.data.nickname);
                        localStorage.setItem('username', response.data.nickname);
                    } else {
                        setError("사용자 정보를 가져오는데 실패했습니다.");
                    }
                } catch (error) {
                    console.error("Error fetching user info", error);
                    setError("사용자 정보를 가져오는데 실패했습니다.");
                }
            }
            setIsLoading(false);
        };

        fetchUserInfo();

        // Kakao SDK 초기화
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;
        script.onload = () => {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init(kakao_token);
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleLogout = () => {
        if (window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                console.log("카카오 로그아웃 완료");
            });
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        setUsername('');
        navigate("/");
    };

    const goMyPage = () => navigate("/mypage/");
    const goLoginPage = () => navigate("/login/");
    const goSignUpPage = () => navigate("/signup/");
    const goMainPage = () => navigate("/");
    const goHistoryPage = () => navigate("/history/");
    const handleMouseEnter = () => {setIsMouseOverLogo(true);};
    const handleMouseLeave = () => {setIsMouseOverLogo(false);};

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="head_screen">
                <div
                    className={`logo_wrapper ${isMouseOverLogo ? 'grab-cursor' : ''}`}
                    style={{
                        width: '200px',
                        height: '90px',
                        cursor: 'pointer',
                        objectFit: 'cover',
                        backgroundImage: `url('/teamlogo.png')`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                    onClick={goMainPage}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
                <div className="signImg">
                    <div className="welcome-message">
                        {error ? (
                            <span>{error}</span>
                        ) : username ? (
                            <span>안녕하세요, {username}님!</span>
                        ) : (
                            <span>로그인이 필요합니다</span>
                        )}
                    </div>
                    <img src="/human.png" alt="sign" width="50" height="50"/>
                    <div className="hoverBox">
                        {username ? (
                            <>
                                <button className="button" onClick={handleLogout}>로그아웃</button>
                                <button className="button" onClick={goHistoryPage}>사용 기록</button>
                            </>
                        ) : (
                            <>
                                <button className="button" onClick={goLoginPage}>로그인</button>
                                <button className="button" onClick={goSignUpPage}>회원가입</button>
                                <button className="button" onClick={goHistoryPage}>사용 기록</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;