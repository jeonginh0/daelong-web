import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/button.css';
import '../style/screen.css';

const { kakao } = window;

const MainPage = () => {
    const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [addresses, setAddresses] = useState(["", ""]);
    const navigate = useNavigate();
    const usageModalRef = useRef();
    const startModalRef = useRef();
    const usageContainerRef = useRef();
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

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

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - usageContainerRef.current.offsetLeft;
        scrollLeft.current = usageContainerRef.current.scrollLeft;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const x = e.pageX - usageContainerRef.current.offsetLeft;
        const walk = (x - startX.current) * 2   ; // 2 is the speed factor
        usageContainerRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
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
            <h1 style={{fontSize: '5em', marginLeft: '600px'}}>대롱대롱 사용방법</h1>
            <div className="sub_screen" style={{overflow: 'auto'}}>
                <div
                    className="usage-instructions"
                    ref={usageContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}>
                    <div className="usage-image">
                        <img src="/use1.png" alt="사용방법 1"/>
                    </div>
                    <div className="usage-image">
                        <img src="/use2.png" alt="사용방법 2"/>
                    </div>
                    <div className="usage-image">
                        <img src="/use3.png" alt="사용방법 3"/>
                    </div>
                    <div className="usage-image">
                        <img src="/use4.png" alt="사용방법 4"/>
                    </div>
                </div>
            </div>
            {/*<div>*/}
            {/*    <p className="sub_text2">daelongdaelong.official</p>*/}
            {/*</div>*/}
        </main>
    );
};

export default MainPage;
