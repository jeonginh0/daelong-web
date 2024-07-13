import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/mypage.css';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [friends, setFriends] = useState(['friend1', 'friend2', 'friend3']);
    const [history, setHistory] = useState(['history1', 'history2', 'history3']);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const goRootPage = () => {
        navigate("/");
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

    const goUseInfoPage = () => {
        navigate("/useInfo");
    }

    const goEditInfoPage = () => {
        navigate("/editinfo/");
    }

    return (
        <main className="main">
            <aside className="sidebar">
                <nav className="nav">
                    <ul>
                        <li
                            className="active"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <a href="#" onClick={goEditInfoPage}>내 정보 변경</a>
                            {isHovered && (
                                <ul className="sub-menu">
                                    <li><a href="#">아이디 변경</a></li>
                                    <li><a href="#">비밀번호 변경</a></li>
                                    <li><a href="#">이메일 변경</a></li>
                                    <li><a href="#">닉네임 변경</a></li>
                                </ul>
                            )}
                        </li>
                        <li><a href="#" onClick={goUseInfoPage}>사용 내역</a></li>
                    </ul>
                </nav>
            </aside>
        </main>
    );
};

export default MyPage;
