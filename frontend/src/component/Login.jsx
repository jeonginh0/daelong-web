import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/button.css';
import '../style/screen.css';
import '../style/signin.css';
import axios from "axios";
import KakaoLogin from 'react-kakao-login';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState({ detail: [] });
    const [islogin, setIslogin] = useState(false);
    const [kakaoToken, setKakaoToken] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;
        script.onload = () => {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init('de7b3ca4ec3d00acac60215fbce08dc5');
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let url = "http://localhost:8000/api/user/login";
        const params = {
            username: username,
            password: password
        };

        try {
            const response = await axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (response.status === 200) {
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('username', response.data.username);
                setIslogin(true);
                onLogin(username);
                navigate('/');
                window.location.reload();
            } else {
                throw new Error('로그인 중 오류가 발생했습니다.');
            }

        } catch (error) {
            setError({ detail: [error.message || '로그인 중 오류가 발생했습니다.'] });
        }
    };

    const kakaoLoginSuccess = useCallback(async (response) => {
        console.log(response);
        setKakaoToken(response.response.access_token);

        try {
            const serverResponse = await axios.post('http://localhost:8000/api/user/kakao-login', {
                access_token: response.response.access_token
            });

            if (serverResponse.status === 200) {
                localStorage.setItem('access_token', serverResponse.data.access_token);
                localStorage.setItem('username', serverResponse.data.username);
                setIslogin(true);
                onLogin(serverResponse.data.username);
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            setError({ detail: [error.message || '카카오 로그인 중 오류가 발생했습니다.'] });
        }
    }, [navigate, onLogin]);

    const kakaoLoginFailure = useCallback((error) => {
        console.log(error);
        setError({ detail: ['카카오 로그인 실패'] });
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

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    return (
        <div className="vid-container">
            <div className="inner-container">
                <div className="box">
                    <div onClick={goRootPage} style={{ cursor: 'pointer', textAlign: 'center', marginBottom: '30px' }}>
                    </div>
                    <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>로그인 | Login</h1>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <button type="submit" onClick={handleSubmit}>로그인</button>
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
                    <p>
                        <KakaoLogin
                            token='de7b3ca4ec3d00acac60215fbce08dc5'
                            onSuccess={kakaoLoginSuccess}
                            onFail={kakaoLoginFailure}
                            render={({ onClick }) => (
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '10px',
                                }}>
                                    <img
                                        src="/kakao_login_small.png"
                                        alt="카카오 로그인"
                                        onClick={onClick}
                                        style={{
                                            cursor: 'pointer',
                                            maxWidth: '50px',
                                            height: 'auto',
                                            transform: 'translateX(-25px)', // 왼쪽으로 20px 이동 (이 값을 조절하여 원하는 만큼 이동)
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
