import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/button.css';
// import { basicCenterAlgorithm } from './utils';


const MainPage = () => {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isUsagePopupOpen, setIsUsagePopupOpen] = useState(false);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();
    const popupRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closeUsagePopup();
                closeAddressPopup();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handleSubmit = () => {
        navigate('/map/' + addresses.map(address => encodeURIComponent(address)).join(','));
    };

    const handleChange = (index, e) => {
        const newAddresses = [...addresses];
        newAddresses[index] = e.target.value;
        setAddresses(newAddresses);
    };

    const openUsagePopup = () => {
        setIsUsagePopupOpen(true);
    };

    const closeUsagePopup = () => {
        setIsUsagePopupOpen(false);
    };

    const openAddressPopup = () => {
        setIsAddressPopupOpen(true);
    };

    const closeAddressPopup = () => {
        setIsAddressPopupOpen(false);
    };

    const handleAddAddress = () => {
        setAddresses([...addresses, ""]);
    };

    return (
        <main>
            <div className="expServiceBtn" onClick={openUsagePopup}>
                사용방법
            </div>
            <div className="startServiceBtn" onClick={openAddressPopup}>
                사용하기
            </div>
            {isUsagePopupOpen && (
                <div className="popup" ref={popupRef}>
                    <div className="popup-content">
                        <span className="close" onClick={closeUsagePopup}>&times;</span>
                        <p>여기에 사용 방법에 대한 내용을 작성합니다.</p>
                    </div>
                </div>
            )}
            {isAddressPopupOpen && (
                <div className="popup" ref={popupRef}>
                    <div className="popup-content">
                        {addresses.map((address, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    placeholder="주소를 입력해주세요."
                                />
                                {index !== addresses.length - 1 && <br />}
                            </div>
                        ))}
                        <button onClick={handleAddAddress}>+ 추가</button>
                        <button onClick={handleSubmit}>지도로 보기</button>
                        <span className="close" onClick={closeAddressPopup}>&times;</span>
                    </div>
                </div>
            )}
        </main>
    );
};

export default MainPage;
