import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import FriendList from "./FriendList";
import History from "./History";
import EditInfo from "./EditInfo";
import '../style/mypage.css';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [friends, setFriends] = useState(['friend1', 'friend2', 'friend3']);
    const [history, setHistory] = useState(['history1', 'history2', 'history3']);
    const navigate = useNavigate(); // useNavigate를 초기화합니다

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 불러오기
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

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

    const goEditInfoPage = () => {
        navigate("/editinfo/");
    }


    // 회원가입 후 로컬 스토리지에 저장된 사용자 정보를 불러옵니다
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    return (
        <main class="main">
            <aside class="sidebar">
                <nav class="nav">
                    <ul>
                        <li class="active"><a href="#" onClick={goMyPage}>마이페이지</a></li>
                        <li><a href="#" onClick={goEditInfoPage}>내 정보 변경</a></li>
                        <li><a href="#">친 구</a></li>
                        <li><a href="#">사용 내역</a></li>
                    </ul>
                </nav>
            </aside>
        </main>
    );
};

export default MyPage;