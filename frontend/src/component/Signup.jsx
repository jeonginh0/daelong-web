import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/button.css';
import '../style/screen.css';
import '../style/signup.css'; // 스타일 파일을 import

const SignUpForm = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기서 회원가입 로직을 구현합니다.
        // id, password, name, nickname, email을 가지고 서버로 전송하거나
        // 다른 처리를 수행합니다.
        console.log("회원가입 정보:", id, password, name, nickname, email);
        // 회원가입 후 다른 페이지로 이동하고 싶다면 navigate 함수를 이용합니다.
        navigate('/'); // 이동할 페이지 경로를 지정합니다.
    }

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
        <div className="signup-container">
            <div className="head_screen">
                <div className="logo_wrapper">
                    <img src="/teamlogo.png" alt="로고" width="200px" height="90px" onClick={goRootPage}/>
                </div>
                <div className="myPageBtn" onClick={goMyPage}>마이페이지</div>
                <div className="loginBtn" onClick={goLoginPage}>로그인</div>
                <div className="signupBtn" onClick={goSignUpPage}>회원가입</div>
            </div>
            <div className="signup-form">
                <div className="text-size">
                    <h1>회원가입 | SIGN UP</h1>
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
                <input
                    type="nickname"
                    value={nickname}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="닉네임"
                />
                <input
                    type="e-mail"
                    value={email}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="email"
                />
                <button onClick={handleSubmit}>가입하기</button>
            </div>
        </div>
    );
};

export default SignUpForm;
