import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fastapi from '../utils/fastapi';
import '../style/button.css';
import '../style/screen.css';
import '../style/signup.css'; // 스타일 파일을 import

const SignUpForm = () => {
    const navigate = useNavigate();
    const history = useState(null);
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');

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

    const postUser = (event) => {
        event.preventDefault();
        const url = "/api/user/create";
        const params = {
            username: username,
            password1: password1,
            password2: password2,
            email: email
        };
        try {
            const response =  axios.post(url, params);
            console.log(response.data);
            history.push('/login'); // 회원가입 후 로그인 페이지로 리다이렉트
        } catch (error) {
            console.error('There was an error!', error);
        }
        // fastapi('post', url, params,
        //     (json) => {
        //         history.push('/login');
        //     },
        // );
    };

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
                    <h1>회원가입 | SIGN UP</h1>
                    <form method="post" onSubmit={postUser}>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="이름 | Name"
                        />
                        <input
                            type="password"
                            id="password1"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            placeholder="비밀번호 입력 | Password"
                        />
                        <input
                            type="password"
                            id="password1"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="비밀번호 확인 | Password"
                        />
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일 | Email"
                        />
                        <button type="submit">가입하기</button>
                        <p>이미 회원이신가요? <span className="signup" onClick={goLoginPage}>로그인 | Login</span></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
