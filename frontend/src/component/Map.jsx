import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../style/map.css";
import "../style/screen.css";
import "../style/button.css";

const { kakao } = window;

const Map = () => {
    const { addresses } = useParams();
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [currCategory, setCurrCategory] = useState('');
    const [placeOverlay, setPlaceOverlay] = useState(null);
    const [center, setCenter] = useState({ lat: 35.1435, lng: 129.0335 });

    const navigate = useNavigate();

    //중간지점 좌표 구하기
    useEffect(() => {
        if (addresses && addresses.length > 0) {
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

            const geocoder = new kakao.maps.services.Geocoder();
            const addressArray = addresses.split(',');

            const coordsArray = [];
            addressArray.forEach((address, index) => {
                geocoder.addressSearch(decodeURIComponent(address), (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        coordsArray.push(coords);

                        if (coordsArray.length === addressArray.length) {
                            const midLat = coordsArray.reduce((sum, coords) => sum + coords.getLat(), 0) / coordsArray.length;
                            const midLng = coordsArray.reduce((sum, coords) => sum + coords.getLng(), 0) / coordsArray.length;
                            const midPoint = new kakao.maps.LatLng(midLat, midLng);

                            newMap.setCenter(midPoint);
                            setCenter({ lat: midLat, lng: midLng });

                            const marker = new kakao.maps.Marker({
                                position: midPoint,
                                map: newMap
                            });
                            setMarkers([marker]);
                        }
                    }
                });
            });
        } else {
            // addresses 값이 없을 때의 처리
            console.log('주소 값이 없습니다.');
        }
    }, [addresses]);

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
            radius: 5000,
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
        const categoryElement = document.getElementById(currCategory);
        if (!categoryElement) {
            console.error(`Element with id ${currCategory} does not exist.`);
            return;
        }

        var order = categoryElement.getAttribute('data-order');

        for (var i = 0; i < places.length; i++) {
            var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);
            (function (marker, place) {
                kakao.maps.event.addListener(marker, 'click', function () {
                    displayPlaceInfo(place);
                });
            })(marker, places[i]);
        }
    };

    const addMarker = (position, order) => {
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
        const imageSize = new kakao.maps.Size(27, 28);
        const imgOptions = {
            spriteSize: new kakao.maps.Size(36, 37),
            spriteOrigin: new kakao.maps.Point(0, order * 46),
            offset: new kakao.maps.Point(13, 36)
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
        const categoryItems = document.querySelectorAll('#category li');
        categoryItems.forEach(item => {
            if (item.id === id) {
                item.classList.add('on');
            } else {
                item.classList.remove('on');
            }
        });

        if (currCategory === id) {
            setCurrCategory('');
        } else {
            setCurrCategory(id);
        }
    };

    const handleRetry = () => {
        navigate("/");
    };

    const goRootPage = () => {
        navigate("/");
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
