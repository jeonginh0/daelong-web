const { kakao } = window;

export const convertWgsToWtmOfList = (wgsCoords) => {
    const wtmPoints = [];

    for (let i = 0; i < wgsCoords.length; i++) {
        let latlng = new kakao.maps.LatLng(wgsCoords[i][0], wgsCoords[i][1]),
            coords = latlng.toCoords();
        wtmPoints.push([coords.getX() * 0.4, coords.getY() * 0.4]);
    }

    return wtmPoints;
}

export const convertWgsToWtm = (centerLat, centerlng) => {
    let latlng = new kakao.maps.LatLng(centerLat, centerlng),
        coords = latlng.toCoords();
    return {
        x: coords.getX() * 0.4,
        y: coords.getY() * 0.4
    };
}

export const convertWtmToWgs = (centerX, centerY) => {
    let coords = new kakao.maps.Coords(centerX * 2.5, centerY * 2.5),
        latlng = coords.toLatLng();

    return {
        lat: latlng.getLat(),
        lng: latlng.getLng()
    };
}

export const splitWtmCoords = (wtmCoords) => {
    let xList = [],  // x좌표들 중심 찾기위해서 x좌표만 뽑은 리스트
        leftList = [],   // 중심 선 기준 왼쪽 리스트
        rightList = [];   // 중심 선 기준 오른쪽 리스트

    for (let i = 0; i < wtmCoords.length; i++) {    // x좌표만 xList에 담음
        let xCoord = wtmCoords[i];
        xList[i] = xCoord[0];
    }

    const result = xList.sort(function (a, b) {   // xList 오름차순 정렬
        return a - b;
    });

    let centerOfX = (result[0] + result[wtmCoords.length - 1]) / 2   // x 중심좌표

    let left = 0,
        right = 0;
    for (let i = 0; i < wtmCoords.length; i++) {   // 중심 선 기준 리스트 나누기
        let coord = wtmCoords[i];
        if (coord[0] < centerOfX) {
            leftList[left] = coord;
            left++;
        }
        else if (coord[0] >= centerOfX) {
            rightList[right] = coord;
            right++;
        }
    }
    return {
        leftList,
        rightList
    };
}

export const sortCoordY = (coordY) => {
    if (coordY.length === 0) {
        return [];
    }
    let middle = coordY[0][1],
        middle_t = [coordY[0]],
        len = coordY.length,
        left = [],
        right = [];

    for (let i = 1; i < len; ++i) {
        if (coordY[i][1] < middle)
            left.push(coordY[i]);

        else
            right.push(coordY[i]);
    }

    let lmr = left.concat(middle_t, right),
        rml = right.concat(middle_t, left);

    return {
        asc: lmr,
        des: rml
    };
}

export const getCenteroid = (polyCoords) => {
    let area = 0,
        cx = 0,
        cy = 0,
        cx2 = 0,
        cy2 = 0;

    for (let i = 0; i < polyCoords.length; i++) {
        let j = (i + 1) % polyCoords.length;

        let pt1 = polyCoords[i],
            pt2 = polyCoords[j];

        let x1 = pt1[0],
            x2 = pt2[0],
            y1 = pt1[1],
            y2 = pt2[1];

        area += x1 * y2;
        area -= y1 * x2;

        cx += ((x1 + x2) * ((x1 * y2) - (x2 * y1)));
        cy += ((y1 + y2) * ((x1 * y2) - (x2 * y1)));

        cx2 = (x1 + x2) / 2;
        cy2 = (y1 + y2) / 2;
    }

    area /= 2;
    area = Math.abs(area);

    cx = cx / (6.0 * area);
    cy = cy / (6.0 * area);

    return {
        x: Math.abs(cx),
        y: Math.abs(cy),
        x2: Math.abs(cx2),
        y2: Math.abs(cy2)
    };
}