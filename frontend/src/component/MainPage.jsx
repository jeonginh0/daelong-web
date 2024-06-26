import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/button.css';
import '../style/screen.css';

const { kakao } = window;

const MainPage = () => {
    const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [addresses, setAddresses] = useState(["", ""]);
    const [markerCoords, setMarkerCoords] = useState([]);
    const navigate = useNavigate();
    const usageModalRef = useRef();
    const startModalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (usageModalRef.current && !usageModalRef.current.contains(event.target)) {
                setIsUsageModalOpen(false);
            }
            if (startModalRef.current && !startModalRef.current.contains(event.target)) {
                setIsStartModalOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = () => {
        const promises = addresses.map(address => {
            return new Promise((resolve, reject) => {
                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(address, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        resolve([coords.getLat(), coords.getLng()]);
                    } else {
                        reject(status);
                    }
                });
            });
        });

        Promise.all(promises)
            .then(coordsArray => {
                const url = `/map?coords=${JSON.stringify(coordsArray)}`;
                navigate(url);
            })
            .catch(error => {
                console.error('Error converting address to coordinates:', error);
            });
    };

    const handleAddAddress = () => {
        setAddresses([...addresses, ""]);
    };

    const handleRemoveAddress = (index) => {
        const newAddresses = addresses.filter((_, addrIndex) => addrIndex !== index);
        setAddresses(newAddresses);
    };

    const openAddressSearch = (index) => {
        new window.daum.Postcode({
            oncomplete: (data) => {
                setAddresses(prevAddresses => {
                    const newAddresses = [...prevAddresses];
                    newAddresses[index] = data.address;
                    return newAddresses;
                });
            }
        }).open();
    };

    const goMyPage = () => {
        navigate("/mypage/");
    };

    const goLoginPage = () => {
        navigate("/login/");
    };

    const goSignUpPage = () => {
        navigate("/signup/");
    };

    const handleChange = (index, value) => {
        const newAddresses = [...addresses];
        newAddresses[index] = value;
        setAddresses(newAddresses);
    };

    return (
        <main>
            <div className="head_screen">
                <div className="logo_wrapper">
                    <img src="/teamlogo.png" alt="로고" width="200px" height="90px"/>
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

            <div className="main_screen" style={{overflow: 'auto'}}>
                <img src="/mainpage_Img.png" alt="메인이미지" width="1920px" height="1080px"/>
                <div className="text_screen">
                    <div className="overlay">
                            <h1 className="main_text">대롱대롱</h1>
                            <p className="sub_text1">중간지점 찾기 및 일정관리 서비스</p>
                            <div className="startServiceBtn" onClick={() => setIsStartModalOpen(true)}>
                                사용하기
                            </div>
                        </div>
                    </div>
                    {isUsageModalOpen && (
                        <div className={`modal ${isUsageModalOpen ? 'show' : ''}`} ref={usageModalRef}>
                            <div className="modal-background" onClick={() => setIsUsageModalOpen(false)}></div>
                            <div className={`modal-content ${isUsageModalOpen ? 'show' : ''}`}>
                                <span className="close" onClick={() => setIsUsageModalOpen(false)}>&times;</span>
                                <p>여기에 사용 방법에 대한 내용을 작성합니다.</p>
                            </div>
                        </div>
                    )}
                    {isStartModalOpen && (
                        <div className={`modal ${isStartModalOpen ? 'show' : ''}`} ref={startModalRef}>
                            <div className="modal-background" onClick={() => setIsStartModalOpen(false)}></div>
                            <div className={`modal-content ${isStartModalOpen ? 'show' : ''}`}>
                                <span className="close" onClick={() => setIsStartModalOpen(false)}>&times;</span>
                                {addresses.map((address, index) => (
                                    <div className="address-input-container" key={index}>
                                        <input
                                            type="text"
                                            value={addresses[index]}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            placeholder="주소를 입력해주세요."
                                            className="input-field" onClick={() => openAddressSearch(index)}
                                        />
                                        <button className="delete-button" onClick={() => handleRemoveAddress(index)}>-
                                        </button>
                                        <br/>
                                    </div>

                                ))}
                                <button className="add-button" onClick={handleAddAddress}>만날 사람 추가하기!</button>
                                <button className="meet-button" onClick={handleSubmit}>여기서 만나자!</button>
                            </div>

                        </div>
                    )}
                </div>
                <div className="sub_screen" style={{overflow: 'auto'}}>
                    <h1 style={{fontSize: '5em'}}>대롱대롱 사용방법</h1>
                </div>
                {/*<div>*/}
                {/*    <p className="sub_text2">daelongdaelong.official</p>*/}
                {/*</div>*/}
        </main>
);
};

export default MainPage;