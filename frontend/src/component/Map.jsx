import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import generateCenter from '../utils/generateCenter';
import "../style/map.css";
import "../style/screen.css";
import "../style/button.css";

const { kakao } = window;

const Map = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const coords = JSON.parse(params.get('coords'));

    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [currCategory, setCurrCategory] = useState('');
    const [placeOverlay, setPlaceOverlay] = useState(null);
    const [center, setCenter] = useState({ lat: 35.1435, lng: 129.0335 }); // 기본 중심 좌표
    const [destination, setDestination] = useState(null); // 목적지 좌표 상태 변수
    const [path, setPath] = useState(null); // 경로 상태 변수

    const navigate = useNavigate(); // useNavigate를 초기화합니다

    useEffect(() => {
        const contentNode = document.createElement('div');
        contentNode.className = 'placeinfo_wrap';

        const mapContainer = document.getElementById('map');
        const mapOptions = {
            center: new kakao.maps.LatLng(center.lat, center.lng),
            level: 8
        };
        const map = new kakao.maps.Map(mapContainer, mapOptions);
        setMap(map);

        const overlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
        overlay.setContent(contentNode);
        setPlaceOverlay(overlay);

        coords.forEach(coord => {
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(coord[0], coord[1])
            });
            marker.setMap(map);
        });

        const { centerLat, centerLng } = generateCenter(coords); // center * 중심 좌표로 지정

        const centerMarkerImage = new kakao.maps.MarkerImage('/centerM.png', new kakao.maps.Size(90, 59));
        const centerPosition = new kakao.maps.LatLng(centerLat, centerLng);
        const centerMarker = new kakao.maps.Marker({
            position: centerPosition,
            image: centerMarkerImage
        });
        centerMarker.setMap(map);

        // 중심을 설정한 후에 다시 지도의 중심을 중심지점으로 설정
        map.setCenter(centerPosition);

        kakao.maps.event.addListener(map, 'idle', searchPlaces);

        return () => {// 내 위치 가져오기
            kakao.maps.event.removeListener(map, 'idle');
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
        const { centerLat, centerLng } = generateCenter(coords);

        const ps = new kakao.maps.services.Places();
        const centerPosition = new kakao.maps.LatLng(centerLat, centerLng); // 중심 좌표
        const options = {
            location: centerPosition,
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
        const imageSrc = 'allmarker.png';
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
                <li id="SW8" className={currCategory === 'SW8' ? 'on' : ''} data-order="4"
                    onClick={() => onClickCategory('SW8')}>
                    <span className="category_bg station"></span>
                    지하철
                </li>
                <li id="FD6" className={currCategory === 'FD6' ? 'on' : ''} data-order="0"
                    onClick={() => onClickCategory('FD6')}>
                    <span className="category_bg food"></span>
                    음식점
                </li>
                <li id="CE7" className={currCategory === 'CE7' ? 'on' : ''} data-order="1"
                    onClick={() => onClickCategory('CE7')}>
                    <span className="category_bg cafe"></span>
                    카페
                </li>
                <li id="CS2" className={currCategory === 'CS2' ? 'on' : ''} data-order="2"
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