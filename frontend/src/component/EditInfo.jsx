import React, { useState } from 'react';
// EditInfo.jsx
const EditInfo = ({ userInfo, setUserInfo, closeModal }) => {
    const [username, setUsername] = useState(userInfo?.username || '');
    const [email, setEmail] = useState(userInfo?.email || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUserInfo = { ...userInfo, username, email };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        setUserInfo(updatedUserInfo);
        closeModal();
    };

    return (
        <div>
            <h2>내 정보 변경</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label><br />
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
                <label htmlFor="email">Email:</label><br />
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                <button type="submit">저장</button>
                <button type="button" onClick={closeModal}>취소</button>
            </form>
        </div>
    );
};

export default EditInfo;
