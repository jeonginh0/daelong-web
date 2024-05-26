import React, { useState } from 'react'
import {useNavigate} from "react-router-dom";
import '../style/button.css';
import '../style/screen.css';
import '../style/signin.css'


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
        <div className="vid-container">
            <div className="head_screen">
                <div className="logo_wrapper">
                    <img src="/teamlogo.png" alt="로고" width="200px" height="90px" onClick={goRootPage}/>
                </div>
                <div className="myPageBtn" onClick={goMyPage}>마이페이지</div>
                <div className="loginBtn" onClick={goLoginPage}>로그인</div>
                <div className="signupBtn" onClick={goSignUpPage}>회원가입</div>
            </div>
            <div className="inner-container">
                <div className="box">
                    <h1>로그인 | LOGIN</h1>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디 | ID"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 | Password"
                    />
                    <button onClick={handleLogin}>로그인</button>
                    <p>회원이 아니신가요? <span className="signup" onClick={goSignUpPage}>회원가입 | Sign Up</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;