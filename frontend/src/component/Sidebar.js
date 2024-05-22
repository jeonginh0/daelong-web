import React, { useState } from 'react';
import '../styles/sidebar.css'; // sidebar.css 파일을 불러옴
import '../styles/addressInput.css'
import '../styles/playbtn.css'
const Sidebar = () => {
    const [addresses, setAddresses] = useState(['']); // 주소 배열을 상태로 관리

    const handleAddressChange = (index, e) => {
        const newAddresses = [...addresses];
        newAddresses[index] = e.target.value;
        setAddresses(newAddresses);
    };

    const handleAddAddress = () => {
        setAddresses([...addresses, '']);
    };

    const handleRemoveAddress = (index) => {
        const newAddresses = [...addresses];
        newAddresses.splice(index, 1);
        setAddresses(newAddresses);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 주소 입력 완료 시 할 작업 추가
        console.log('주소 입력 완료:', addresses);
    };

    return (
        <div className="sidebar">
            <h2>대롱대롱</h2>
            <p>여기는 사이드바 입니다.</p>
            {addresses.map((address, index) => (
                <div className="input-container" key={index}>
                    <label htmlFor={`addressInput-${index}`}>주소 입력:</label>
                    <input
                        type="text"
                        id={`addressInput-${index}`}
                        value={address}
                        onChange={(e) => handleAddressChange(index, e)}
                        placeholder="주소를 입력하세요"
                    />
                    {index > 0 && ( // 첫 번째 주소 입력 창은 "-" 버튼을 표시하지 않음
                        <button type="button" onClick={() => handleRemoveAddress(index)}>-</button>
                    )}
                    {index === addresses.length - 1 && ( // 마지막 주소 입력 창일 때만 + 버튼 표시
                        <button type="button" onClick={handleAddAddress}>+</button>
                    )}
                </div>
            ))}
            <button type="submit" className="btn" onClick={handleSubmit}>여기서 만나요!</button>
        </div>
    );
};

export default Sidebar;
