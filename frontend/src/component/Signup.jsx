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
    const [agreeTerms, setAgreeTerms] = useState(false); // 약관 동의 상태 추가
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기서 회원가입 로직을 구현합니다.
        if (!agreeTerms) {
            alert('회원약관 및 개인정보 수집 및 이용에 동의해야 합니다.');
            return;
        }

        console.log("회원가입 정보:", id, password, name, nickname);
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

    const toggleAgreeTerms = () => {
        setAgreeTerms(!agreeTerms);
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
                <div className="box2">
                    <h1 style={{textAlign: 'center', marginBottom: '30px'}}>회원가입 | Sign Up</h1>
                    <h2 style={{textAlign: 'center', marginBottom: '30px', marginRight: "1000px"}}>기본정보</h2>
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
                        placeholder="Password"
                    />
                    <input
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                    />
                    <input
                        type="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="NickName"
                    />
                    <h3 style={{textAlign: 'center', marginBottom: '20px', marginRight: '1000px'}}>약관동의</h3>
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
                    <button onClick={handleSubmit}>가입하기</button>
                    <p><span className="signup" onClick={goLoginPage}>로그인 | Login</span></p>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
