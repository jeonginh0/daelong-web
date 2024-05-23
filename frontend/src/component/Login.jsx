import React, { useState } from 'react'
import {useNavigate} from "react-router-dom";
import goMyPage from "./MainPage";
import goLoginPage from "./MainPage";
import '../style/button.css';
import '../style/screen.css';
import '../style/login.css'; // 스타일 파일을 import


const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        // 로그인 로직을 여기에 추가하세요.
        console.log('로그인 정보:', {id, password});
        navigate('/');
    };

    const goRootPage = () => {
        navigate("/"); // "/" 경로로 이동합니다
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
        <div className="login-container">
            <div className="head_screen">
                <div className="logo_wrapper">
                    <img src="/teamlogo.png" alt="로고" width="200px" height="90px" onClick={goRootPage}/>
                </div>
                <div className="myPageBtn" onClick={goMyPage}>마이페이지</div>
                <div className="loginBtn" onClick={goLoginPage}>로그인</div>
                <div className="signupBtn" onClick={goSignUpPage}>회원가입</div>
            </div>
            <div className="login-form">
                <div className="text-size">
                    <h1>로그인 | LOGIN</h1>
                </div>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="아이디"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                />
                <button onClick={handleLogin}>로그인</button>
            </div>
        </div>
    );
};

export default Login;