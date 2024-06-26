import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/button.css';
import '../style/screen.css';

const images = [
    '/use1.png',
    '/use2.png'
    // '/image2.jpg',
    // '/image3.jpg',
    // '/image4.jpg',
];

const { kakao } = window;

const MainPage = () => {
    const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [addresses, setAddresses] = useState(["", ""]);
    const [markerCoords, setMarkerCoords] = useState([]);
    const navigate = useNavigate();
    const usageModalRef = useRef();
    const startModalRef = useRef();
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);

    const handlePrevClick = () => {
        sliderRef.current.scrollBy({
            left: -sliderRef.current.offsetWidth, // 한 이미지 너비만큼 왼쪽으로 스크롤
            behavior: 'smooth', // 부드러운 스크롤 적용
        });
    };

    const handleNextClick = () => {
        sliderRef.current.scrollBy({
            left: sliderRef.current.offsetWidth, // 한 이미지 너비만큼 오른쪽으로 스크롤
            behavior: 'smooth', // 부드러운 스크롤 적용
        });
    };

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

    const handleImageClick = () => {
        setShowDropdown(!showDropdown);
    };

    const closeDropdown = (e) => {
        if (!e.target.closest('.dropdown-menu') && !e.target.closest('.signImg')) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener('click', closeDropdown);
        } else {
            document.removeEventListener('click', closeDropdown);
        }

        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, [showDropdown]);

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
        navigate("/mypage");
    };

    const goLoginPage = () => {
        navigate("/login");
    };

    const goSignUpPage = () => {
        navigate("/signup");
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
                    <img src="/human.png" alt="sign Image" width="50px" height="50px" onClick={handleImageClick}/>
                    {showDropdown && (
                        <div className="dropdown-menu show">
                            <ul>
                                <li><a onClick={goLoginPage}>로그인</a></li>
                                <li><a onClick={goSignUpPage}>회원가입</a></li>
                                <li><a onClick={goMyPage}>마이페이지</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="main_screen" style={{overflow: 'auto'}}>
                <img src="/mainpage_Img.png" alt="메인이미지" width="1920px" height="728px"/>
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
            <div className="sub_screen" style={{overflow: 'auto'}}>
                <h1 className="usage-text">대롱대롱 사용방법</h1>
                <div className="image-gallery">
                    <div className="gallery-content">
                        <img src="/use1.png" alt="Image 1"/>
                        <img src="/use2.png" alt="Image 2"/>
                        <img src="/use3.png" alt="Image 3"/>
                        <img src="/use4.png" alt="Image 4"/>
                        {/* 추가 이미지들 */}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MainPage;