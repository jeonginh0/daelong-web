import React, { useState, useEffect } from 'react';
import FriendList from "./FriendList";
import History from "./History";
import '../style/mypage.css';
import { useNavigate } from "react-router-dom";

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

    // 회원가입 후 로컬 스토리지에 저장된 사용자 정보를 불러옵니다
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    return (
        <div className="mypage">
            <div className="user-info">
                <div className="MyPagehead_screen">
                    <img src="/teamlogo.png" alt="로고" width="200px" height="90px" onClick={goRootPage}/>
                </div>
                <h2>사용자 정보</h2>
                {userInfo ? (
                    <>
                        <div>아이디: {userInfo.username}</div>
                        <div>비밀번호: {userInfo.password}</div>
                        <div>이름: {userInfo.name}</div>
                        <div>닉네임: {userInfo.nickname}</div>
                        <div>이메일: {userInfo.email}</div>
                    </>
                ) : (
                    <div>로그인이 필요합니다.</div>
                )}
            </div>
            <div className="sidebar">
                <div className="friends-section">
                    <h2>친구 목록</h2>
                    <FriendList friends={friends} />
                </div>
                <div className="history-section">
                    <h2>최근 이용내역</h2>
                    <History history={history} />
                </div>
            </div>
        </div>
    );
};

export default MyPage;
