import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/button.css';
import '../style/screen.css';
import '../style/login.css';
import KakaoLogin from 'react-kakao-login';

// login.jsx //
const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState({ detail: [] });
    const [isLogin, setIsLogin] = useState(false);
    const [kakaoToken, setKakaoToken] = useState(null);

    const navigate = useNavigate();

    // 구글 클라이언트 ID
    const clientId = '982220892235-jejvh9eltrp07aacmhhn0fvrks1fk9as.apps.googleusercontent.com';

    // 구글 로그인 성공 시 실행할 함수
    const googleLoginSuccess = useCallback(async (response) => {
        console.log(response);

        try {
            // 구글에서 받은 ID Token을 서버로 전송하여 백엔드에서 검증할 수 있습니다.
            const serverResponse = await axios.post('http://localhost:8000/api/user/google-login', {
                id_token: response.tokenId,
            });

            if (serverResponse.status === 200) {
                localStorage.setItem('access_token', serverResponse.data.access_token);
                localStorage.setItem('username', serverResponse.data.username);
                setIsLogin(true);
                onLogin(serverResponse.data.username);
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            setError({ detail: [error.message || '구글 로그인 중 오류가 발생했습니다.'] });
        }
    }, [navigate, onLogin]);

    // 구글 로그인 실패 시 실행할 함수
    const googleLoginFailure = useCallback((error) => {
        console.log(error);
        setError({ detail: ['구글 로그인 실패'] });
    }, []);

    // 아이디 저장 체크박스 토글 함수
    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    // 로그인 버튼 클릭 시 실행할 함수
    const handleSubmit = async (event) => {
        event.preventDefault();

        let url = 'http://localhost:8000/api/user/login';
        const params = {
            username: username,
            password: password,
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
                setIsLogin(true);
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

    // 카카오 로그인 성공 시 실행할 함수
    const kakaoLoginSuccess = useCallback(async (response) => {
        console.log(response);
        setKakaoToken(response.response.access_token);

        try {
            const serverResponse = await axios.post('http://localhost:8000/api/user/kakao-login', {
                access_token: response.response.access_token,
            });

            if (serverResponse.status === 200) {
                localStorage.setItem('access_token', serverResponse.data.access_token);
                localStorage.setItem('username', serverResponse.data.username);
                setIsLogin(true);
                onLogin(serverResponse.data.username);
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            setError({ detail: [error.message || '카카오 로그인 중 오류가 발생했습니다.'] });
        }
    }, [navigate, onLogin]);

    // 카카오 로그인 실패 시 실행할 함수
    const kakaoLoginFailure = useCallback((error) => {
        console.log(error);
        setError({ detail: ['카카오 로그인 실패'] });
    }, []);

    // 루트 페이지로 이동하는 함수
    const goRootPage = () => {
        navigate('/');
    };

    // 회원가입 페이지로 이동하는 함수
    const goSignUpPage = () => {
        navigate('/signup/');
    };

    // 구글 로그인 팝업 열기
    const openGoogleLoginPopup = () => {
        const width = 500;
        const height = 600;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;

        const url = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=id_token&scope=email%20profile&nonce=12345`;

        window.open(url, '구글 로그인', `width=${width},height=${height},left=${left},top=${top}`);
    };

    return (
        <div className="vid-container">
            <div className="inner-container">
                <div className="box">
                    <div
                        onClick={goRootPage}
                        style={{cursor: 'pointer', textAlign: 'center', marginBottom: '30px'}}
                    >
                        {/* Root 페이지로 이동하는 버튼 */}
                    </div>
                    <h1 style={{textAlign: 'center', marginBottom: '30px'}}>로그인</h1>
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
                    <button type="submit" onClick={handleSubmit}>
                        로그인
                    </button>
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
                    <div className="login-buttons">
                        {/* 카카오 로그인 버튼 */}
                        <KakaoLogin
                            token="de7b3ca4ec3d00acac60215fbce08dc5"
                            onSuccess={kakaoLoginSuccess}
                            onFail={kakaoLoginFailure}
                            render={({onClick}) => (
                                <img
                                    src="/kakao_login_small.png"
                                    alt="카카오 로그인"
                                    onClick={onClick}
                                    className="login-button"
                                />
                            )}
                        />
                        {/* 구글 로그인 버튼 */}
                        <img
                            src="/google_login_small.png"
                            alt="구글 로그인"
                            onClick={openGoogleLoginPopup}
                            className="login-button"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
