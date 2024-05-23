import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 가져옵니다
import "../style/map.css";
import "../style/screen.css";
import "../style/button.css";

const { kakao } = window;

const Map = () => {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [currCategory, setCurrCategory] = useState('');
    const [placeOverlay, setPlaceOverlay] = useState(null);
    const [center, setCenter] = useState({ lat: 35.1435, lng: 129.0335 }); // 기본 중심 좌표
    const [myMarker, setMyMarker] = useState(null);

    const navigate = useNavigate(); // useNavigate를 초기화합니다

    useEffect(() => {
        const contentNode = document.createElement('div');
        contentNode.className = 'placeinfo_wrap';

        const mapContainer = document.getElementById('map');
        const mapOptions = {
            center: new kakao.maps.LatLng(center.lat, center.lng),
            level: 5
        };
        const newMap = new kakao.maps.Map(mapContainer, mapOptions);
        setMap(newMap);

        const overlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
        overlay.setContent(contentNode);
        setPlaceOverlay(overlay);

        // 내 위치 가져오기
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const locPosition = new kakao.maps.LatLng(lat, lng);
                setCenter({ lat, lng });
                newMap.setCenter(locPosition);

                // 내 위치에 마커 추가
                const marker = new kakao.maps.Marker({
                    map: newMap,
                    position: locPosition
                });
                setMyMarker(marker);
            });
        }

        kakao.maps.event.addListener(newMap, 'idle', searchPlaces);

        return () => {
            kakao.maps.event.removeListener(newMap, 'idle');
            overlay.setMap(null);
            removeMarker();
        };
    }, []);

    useEffect(() => {
        if (currCategory) {
            searchPlaces();
        } else {
            removeMarker();
            if (placeOverlay) {
                placeOverlay.setMap(null);
            }
        }
    }, [currCategory, center]);

    const searchPlaces = () => {
        if (!currCategory) return;

        if (placeOverlay) {
            placeOverlay.setMap(null);
        }
        removeMarker();

        const ps = new kakao.maps.services.Places();
        const locPosition = new kakao.maps.LatLng(center.lat, center.lng);
        const options = {
            location: locPosition,
            radius: 5000, // 5km 반경
            useMapBounds: false
        };

        ps.categorySearch(currCategory, placesSearchCB, options);
    };

    const placesSearchCB = (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            displayPlaces(data);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            // 처리 코드
        } else if (status === kakao.maps.services.Status.ERROR) {
            // 처리 코드
        }
    };

    const displayPlaces = (places) => {
        for (let i = 0; i < places.length; i++) {
            const marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x));
            kakao.maps.event.addListener(marker, 'click', () => displayPlaceInfo(places[i]));
        }
    };

    const addMarker = (position) => {
        const marker = new kakao.maps.Marker({
            position: position
        });
        marker.setMap(map);
        setMarkers(prevMarkers => [...prevMarkers, marker]);
        return marker;
    };

    const removeMarker = () => {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
    };

    const displayPlaceInfo = (place) => {
        if (placeOverlay) {
            const content = `
            <div class="placeinfo">
                <a class="title" href="${place.place_url}" target="_blank" title="${place.place_name}">
                    ${place.place_name}
                </a>
                <span title="${place.road_address_name}">
                    ${place.road_address_name}
                </span>
                <span class="jibun" title="${place.address_name}">
                    (지번 : ${place.address_name})
                </span>
                <span class="tel">
                    ${place.phone}
                </span>
            </div>
            <div class="after"></div>
        `;
            placeOverlay.setContent(content);
            placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
            placeOverlay.setMap(map);
        }
    };

    const onClickCategory = (id) => {
        if (currCategory === id) {
            setCurrCategory('');
        } else {
            setCurrCategory(id);
        }
    };

    const handleRetry = () => {
        navigate("/"); // "/" 경로로 이동합니다
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

    return (
        <div className="map_wrap">
            <div className="maphead_screen">
                <img src="/teamlogo.png" alt="로고" width="200px" height="90px" onClick={goRootPage}/>
                <div className="myPageBtn" onClick={goMyPage}>마이페이지</div>
                <div className="loginBtn" onClick={goLoginPage}>로그인</div>
                <div className="signupBtn" onClick={goSignUpPage}>회원</div>
            </div>
            <div id="map" className="map"></div>
            <ul id="category">
                <li id="BK9" className={currCategory === 'FD6' ? 'on' : ''} data-order="0"
                    onClick={() => onClickCategory('FD6')}>
                    <span className="category_bg bank"></span>
                    음식점
                </li>
                <li id="CE7" className={currCategory === 'CE7' ? 'on' : ''} data-order="4"
                    onClick={() => onClickCategory('CE7')}>
                    <span className="category_bg cafe"></span>
                    카페
                </li>
                <li id="CS2" className={currCategory === 'CS2' ? 'on' : ''} data-order="5"
                    onClick={() => onClickCategory('CS2')}>
                    <span className="category_bg store"></span>
                    편의점
                </li>
            </ul>
            <div id="retry" className="retryBtn" onClick={handleRetry}>새로할래 !</div>
        </div>
    );
};

export default Map;
