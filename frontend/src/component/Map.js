import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import "../styles/style.css"
import "../styles/button.css"
import "./Utils"

const { kakao } = window;

const Map = () => {
    const { addresses } = useParams();
    const [map, setMap] = useState(null);
    // 카테고리 상태 선언
    const [category, setCategory] = useState("맛집");

    //처음 지도 그리기
    useEffect(()=>{
        // 마커를 담을 배열입니다
        var markers = [];

        var mapContainer = document.getElementById("map"), // 지도를 표시할 div
            mapOption = {
                center: new kakao.maps.LatLng(35.1435, 129.0335), // 지도의 중심좌표
                level: 5, // 지도의 확대 레벨
            };

        // 지도를 생성합니다
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 카테고리 선택 버튼을 지도 상단에 배치하기 위한 요소
        var categorySelector = document.createElement('div');
        categorySelector.innerHTML = `
            <button onClick={() => setCategory('맛집')}>맛집</button>
            <button onClick={() => setCategory('카페')}>카페</button>
        `;
        mapContainer.appendChild(categorySelector);

        setMap(map);

        // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
        var mapTypeControl = new kakao.maps.MapTypeControl();

        // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
        // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 장소 검색 객체를 생성합니다
        var ps = new kakao.maps.services.Places();

        // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        // 마커 이미지 설정
        var imageSrc = 'https://cdn4.iconfinder.com/data/icons/symbol-blue-set-1/100/Untitled-2-09-1024.png',
            imageSize = new kakao.maps.Size(30, 30),
            imageOption = {offset: new kakao.maps.Point(13, 35)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        function displayMarker(locPosition) {
            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                map: map,
                image: markerImage,
                position: locPosition
            });

            // 지도 중심좌표를 접속위치로 변경합니다
            map.setCenter(locPosition);
        }

        const getCurrentCoordinate = async () => {
            console.log("getCurrentCoordinate 함수 실행!!!");

            return new Promise((res, rej) => {
                // HTML5의 geolocaiton으로 사용할 수 있는지 확인합니다.
                if (navigator.geolocation) {
                    // GeoLocation을 이용해서 접속 위치를 얻어옵니다.
                    navigator.geolocation.getCurrentPosition(function (position) {
                        console.log(position);
                        const lat = position.coords.latitude; // 위도
                        const lon = position.coords.longitude; // 경도

                        const coordinate = new kakao.maps.LatLng(lat, lon);
                        displayMarker(coordinate);
                        res(coordinate) ;
                    });
                } else {
                    rej(new Error("현재 위치를 불러올 수 없습니다."));
                }
            });
        };

        // 키워드로 장소를 검색합니다
        searchPlaces();

        // 키워드 검색을 요청하는 함수입니다
        async function searchPlaces() {
            console.log("searchPlaces 실행!!!");
            var keyword = `내 주변 ${category}`;
            const currentCoordinate = await getCurrentCoordinate();
            console.log(currentCoordinate);
            var options = {
                location: currentCoordinate,
                radius: 10000,
                sort: kakao.maps.services.SortBy.DISTANCE,
            };

            // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
            ps.keywordSearch(keyword, placesSearchCB, options);
        }

        // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                // 정상적으로 검색이 완료됐으면
                // 검색 목록과 마커를 표출합니다
                displayPlaces(data);

                // 페이지 번호를 표출합니다
                displayPagination(pagination);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert("검색 결과가 존재하지 않습니다.");
                return;
            } else if (status === kakao.maps.services.Status.ERROR) {
                alert("검색 결과 중 오류가 발생했습니다.");
                return;
            }
        }

        // 검색 결과 목록과 마커를 표출하는 함수입니다
        function displayPlaces(places) {
            var listEl = document.getElementById("placesList"),
                menuEl = document.getElementById("menu_wrap"),
                fragment = document.createDocumentFragment(),
                bounds = new kakao.maps.LatLngBounds(),
                listStr = "";

            // 검색 결과 목록에 추가된 항목들을 제거합니다
            removeAllChildNods(listEl);

            // 지도에 표시되고 있는 마커를 제거합니다
            removeMarker();

            for (var i = 0; i < places.length; i++) {
                // 마커를 생성하고 지도에 표시합니다
                var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addMarker(placePosition, i),
                    itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                bounds.extend(placePosition);

                // 마커와 검색결과 항목에 mouseover 했을때
                // 해당 장소에 인포윈도우에 장소명을 표시합니다
                // mouseout 했을 때는 인포윈도우를 닫습니다
                (function (marker, title) {
                    kakao.maps.event.addListener(marker, "mouseover", function () {
                        displayInfowindow(marker, title);
                    });

                    kakao.maps.event.addListener(marker, "mouseout", function () {
                        infowindow.close();
                    });

                    itemEl.onmouseover = function () {
                        displayInfowindow(marker, title);
                    };

                    itemEl.onmouseout = function () {
                        infowindow.close();
                    };
                })(marker, places[i].place_name);

                fragment.appendChild(itemEl);
            }

            // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
            listEl.appendChild(fragment);
            menuEl.scrollTop = 0;

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            map.setBounds(bounds);
        }

        // 검색결과 항목을 Element로 반환하는 함수입니다
        function getListItem(index, places) {
            var el = document.createElement("li"),
                itemStr =
                    '<span class="markerbg marker_' +
                    (index + 1) +
                    '"></span>' +
                    '<div class="info">' +
                    "   <h5>" +
                    places.place_name +
                    "</h5>";

            if (places.road_address_name) {
                itemStr +=
                    "    <span>" +
                    places.road_address_name +
                    "</span>" +
                    '   <span class="jibun gray">' +
                    places.address_name +
                    "</span>";
            } else {
                itemStr += "    <span>" + places.address_name + "</span>";
            }

            itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";

            el.innerHTML = itemStr;
            el.className = "item";

            return el;
        }

        // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
        function addMarker(position, idx, title) {
            var imageSrc =
                    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
                imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
                imgOptions = {
                    spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                    spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new kakao.maps.MarkerImage(
                    imageSrc,
                    imageSize,
                    imgOptions
                ),
                marker = new kakao.maps.Marker({
                    position: position, // 마커의 위치
                    image: markerImage,
                });

            marker.setMap(map); // 지도 위에 마커를 표출합니다
            markers.push(marker); // 배열에 생성된 마커를 추가합니다

            return marker;
        }

        // 지도 위에 표시되고 있는 마커를 모두 제거합니다
        function removeMarker() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }

        // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
        function displayPagination(pagination) {
            var paginationEl = document.getElementById("pagination"),
                fragment = document.createDocumentFragment(),
                i;

            // 기존에 추가된 페이지번호를 삭제합니다
            while (paginationEl.hasChildNodes()) {
                paginationEl.removeChild(paginationEl.lastChild);
            }

            for (i = 1; i <= pagination.last; i++) {
                var el = document.createElement("a");
                el.href = "#";
                el.innerHTML = i;

                if (i === pagination.current) {
                    el.className = "on";
                } else {
                    el.onclick = (function (i) {
                        return function () {
                            pagination.gotoPage(i);
                        };
                    })(i);
                }

                fragment.appendChild(el);
            }
            paginationEl.appendChild(fragment);
        }

        // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
        // 인포윈도우에 장소명을 표시합니다
        function displayInfowindow(marker, title) {
            var content = '<div class="infowindow">' + title + '</div>';
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }

        // 검색결과 목록의 자식 Element를 제거하는 함수입니다
        function removeAllChildNods(el) {
            while (el.hasChildNodes()) {
                el.removeChild(el.lastChild);
            }
        }
    }, [category]);

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
    };

    return (
        <div className="map_wrap">
            {/* 카테고리 버튼들 */}
            <div className="category_selectorBtn">
                <button onClick={() => handleCategoryChange("맛집")}>맛집</button>
                <button onClick={() => handleCategoryChange("카페")}>카페</button>
            </div>
            <div id="map" className="map"></div>
            <div id="menu_wrap" className="bg_white">
                <hr />
                <ul id="placesList"></ul>
                <div id="pagination"></div>
            </div>
        </div>
    );
};

export default Map;