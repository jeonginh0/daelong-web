import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/button.css';
import '../style/screen.css';
import '../style/signin.css';
import axios from "axios";
import Error from "../utils/error";

const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState({ detail: [] });
    let [islogin, setIslogin] = useState(false);

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
                onLogin(username); // 부모 컴포넌트에 로그인 상태 전달
                navigate('/'); // 로그인 성공 시 리다이렉트
                window.location.reload();
            } else {
                throw new Error('로그인 중 오류가 발생했습니다.');
            }

            const result = await response.json();
            localStorage.setItem('access_token', result.access_token);
            localStorage.setItem('username', result.username);

        } catch (error) {
            setError({ detail: [error.message || '로그인 중 오류가 발생했습니다.'] });
        }
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
            <div className="inner-container">
                <div className="box">
                    <h1 style={{textAlign: 'center', marginBottom: '30px'}}>로그인 | Login</h1>
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
                    <p><span className="signup" onClick={goSignUpPage}>sns 계정으로 로그인</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;