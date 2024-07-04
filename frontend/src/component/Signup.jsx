import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from "../utils/error";
import '../style/button.css';
import '../style/screen.css';
import '../style/signup.css';
import axios from "axios"; // 스타일 파일을 import

const SignUpForm = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [history, setHistory] = useState('');
    const [error, setError] = useState({ detail: [] });
    const [agreeTerms, setAgreeTerms] = useState(false); // 약관 동의 상태 추가

    const navigate = useNavigate();

    const postUser = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!name || !username || !password1 || !password2 || !email) {
            setError({ detail: ['모든 필드를 입력하세요.'] });
            return;
        }

        if (password1 !== password2) {
            setError({ detail: ['비밀번호가 일치하지 않습니다.'] });
            return;
        }

        // Example URL and API call
        let url = "http://localhost:8000/api/user/create";
        const params = {
            name: name,
            username: username,
            password1: password1,
            password2: password2,
            email: email,
            history: history
        };

        try {
            const response = await axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204) {
                navigate('/login/'); // Redirect upon successful signup
            } else {
                throw new Error('회원 가입 중 오류가 발생했습니다.');
            }
        } catch (error) {
            setError({ detail: [error.message || '회원 가입 중 오류가 발생했습니다.'] });
        }
    };

    const handleKakaoLogin = () => {
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;
        window.location.href = KAKAO_AUTH_URL;
    };

    const handleNaverLogin = () => {
        const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_NAVER_REDIRECT_URI}&state=STATE_STRING`;
        window.location.href = NAVER_AUTH_URL;
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

    const toggleAgreeTerms = () => {
        setAgreeTerms(!agreeTerms);
    };


    return (
        <div className="vid-container">
            <div className="inner-container">
                <div className="box2">
                    <h1 style={{textAlign: 'center', marginBottom: '30px'}}>회원가입 | Sign Up</h1>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름"
                    />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디 입력"
                    />
                    <input
                        type="password"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        placeholder="패스워드 입력"
                    />
                    <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        placeholder="패스워드 확인"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 입력"
                    />
                    <div className="agree-container">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={toggleAgreeTerms}
                            id="agreeTerms"
                        />
                        <label htmlFor="agreeTerms">
                            대롱대롱 회원약관, 개인정보 수집 및 이용에 모두 동의합니다.
                        </label>
                    </div>
                    <button type="submit" onClick={postUser}>가입하기</button>
                    <div className="social-login">
                        <button onClick={handleKakaoLogin} className="kakao-login-btn">
                            카카오로 회원가입
                        </button>
                        <button onClick={handleNaverLogin} className="naver-login-btn">
                            네이버로 회원가입
                        </button>
                    </div>
                    <p><span className="signup" onClick={goLoginPage}>로그인 | Login</span></p>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;