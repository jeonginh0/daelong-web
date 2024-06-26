import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/button.css';
import '../style/screen.css';
import '../style/signin.css';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        // 로그인 로직을 여기에 추가하세요.
        console.log('로그인 정보:', {id, password, rememberMe});
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

    // const goFindIdPage = () => {
    //     navigate("/findid/");
    // };
    //
    // const goFindPasswordPage = () => {
    //     navigate("/findpassword/");
    // };
    //
    // const goSnsLoginPage = () => {
    //     navigate("/snslogin/");
    // };

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    return (
        <div className="vid-container">
            <div className="head_screen">
                <div className="logo_wrapper">
                    <img src="/teamlogo.png" alt="로고" width="200px" height="90px" onClick={goRootPage}/>
                </div>
                <div className="signImg">
                    <img src="/human.png" alt="sign Image" width="50px" height="50px"/>
                    <div className="hoverBox">
                        <button className="button" onClick={goLoginPage}>로그인</button>
                        <button className="button" onClick={goSignUpPage}>회원가입</button>
                        <button className="button" onClick={goMyPage}>마이페이지</button>
                    </div>
                </div>
            </div>
            <div className="inner-container">
                <div className="box">
                    <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>로그인 | Login</h1>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="ID"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="PW"
                    />
                    <div className="remember-container" onClick={toggleRememberMe}>
                        <div className={`remember-checkbox ${rememberMe ? 'checked' : ''}`}></div>
                        <label>아이디 저장</label>
                    </div>
                    <button onClick={handleLogin}>로그인</button>
                    <div className="row">
                        <span className="signup" onClick={goSignUpPage}>
                            아이디 찾기
                        </span>
                        <span className="signup" onClick={goSignUpPage}>
                            비밀번호 찾기
                        </span>
                        <span className="signup" onClick={goSignUpPage}>
                            회원가입
                        </span>
                    </div>
                    <p><span className="signup" onClick={goSignUpPage}>sns 계정으로 로그인</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
