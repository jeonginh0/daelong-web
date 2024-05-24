import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/mypage.css';
import '../style/screen.css';

const MyPage = () => {
    const navigate = useNavigate();

    const goRootPage = () => {
        navigate("/"); // "/" 경로로 이동합니다
    };

    return (
        <div className="container">
            <div className="sidebar">
                <h2>마이페이지</h2>
                <ul>
                    <li><Link to="/mypage/profile">프로필</Link></li>
                    <li><Link to="/mypage/history">친구</Link></li>
                    <li><Link to="/mypage/settings">설정</Link></li>

                </ul>
            </div>

            <div className="content">
                <div className="head_screen">
                    <div className="logo_wrapper" onClick={goRootPage}>
                        <img src="/teamlogo.png" alt="로고" width="200px" height="90px" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
