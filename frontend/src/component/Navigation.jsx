import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        setUsername('');
        navigate("/");
        window.location.reload(); // 페이지 새로고침
    };

    const goMyPage = () => {
        navigate("/mypage/");
    };

    const goLoginPage = () => {
        navigate("/login/");
    };

    const goSignUpPage = () => {
        navigate("/signup/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="head_screen">
                <div className="logo_wrapper">
                    <img src="/teamlogo.png" alt="로고" width="200px" height="90px"/>
                </div>
                <div className="signImg">
                    <div className="welcome-message">
                        {username && (
                            <span>안녕하세요, {username}님!</span>
                        )}
                    </div>
                    <img src="/human.png" alt="sign Image" width="50px" height="50px"/>
                    <div className="hoverBox">
                        {username ? (
                            <>
                                <button className="button" onClick={handleLogout}>로그아웃</button>
                                <button className="button" onClick={goMyPage}>마이페이지</button>
                            </>
                        ) : (
                            <>
                                <button className="button" onClick={goLoginPage}>로그인</button>
                                <button className="button" onClick={goSignUpPage}>회원가입</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;