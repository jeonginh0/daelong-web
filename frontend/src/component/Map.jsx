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
                const myLocationMarkerImage = new kakao.maps.MarkerImage('/img_1.png', new kakao.maps.Size(22, 30));
                const marker = new kakao.maps.Marker({
                    map: newMap,
                    position: locPosition,
                    image: myLocationMarkerImage
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
        if (!currCategory) {
            return;
        }
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
        // currCategory에 해당하는 카테고리의 엘리먼트가 존재하는지 확인
        const categoryElement = document.getElementById(currCategory);
        if (!categoryElement) {
            console.error(`Element with id ${currCategory} does not exist.`);
            return;
        }

        // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
        // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
        var order = categoryElement.getAttribute('data-order');

        // 나머지 코드는 그대로 유지합니다
        for ( var i=0; i<places.length; i++ ) {
            var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);
            (function(marker, place) {
                kakao.maps.event.addListener(marker, 'click', function() {
                    displayPlaceInfo(place);
                });
            })(marker, places[i]);
        }
    };

    const addMarker = (position, order) => {
        const imageSrc = 'data:image/png;base64,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';
        const imageSize = new kakao.maps.Size(27, 28);
        const imgOptions = {
            spriteSize: new kakao.maps.Size(72, 208), // 스프라이트 이미지의 전체 크기
            spriteOrigin: new kakao.maps.Point(46, order * 36), // 스프라이트 이미지에서 해당 마커 이미지의 위치
            offset: new kakao.maps.Point(11, 28)
        };
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        const marker = new kakao.maps.Marker({
            position: position,
            image: markerImage
        });

        marker.setMap(map);
        setMarkers(prevMarkers => [...prevMarkers, marker]);

        return marker;
    }

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
        // 현재 클릭된 카테고리의 id와 선택된 카테고리의 id를 비교하여
        // 같으면 .on 클래스를 추가하고, 다르면 .on 클래스를 제거합니다.
        const categoryItems = document.querySelectorAll('#category li');
        categoryItems.forEach(item => {
            if (item.id === id) {
                item.classList.add('on');
            } else {
                item.classList.remove('on');
            }
        });

        // 선택된 카테고리를 상태에 저장합니다.
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
                <img src="/teamlogo.png" alt="로고" width="200px" height="90px" onClick={goRootPage}
                     style={{cursor: 'pointer'}}/>
                <div className="myPageBtn" onClick={goMyPage}>마이페이지</div>
                <div className="loginBtn" onClick={goLoginPage}>로그인</div>
                <div className="signupBtn" onClick={goSignUpPage}>회원가입</div>
            </div>
            <div id="map" className="map"></div>
            <ul id="category">
            <li id="FD6" className={currCategory === 'FD6' ? 'on' : ''} data-order="0"
                    onClick={() => onClickCategory('FD6')}>
                    <span className="category_bg food"></span>
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
