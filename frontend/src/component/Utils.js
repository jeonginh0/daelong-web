export function basicCenterAlgorithm(markers) {
    // 마커들의 위치 정보를 추출합니다.
    const positions = markers.map(marker => marker.getPosition());

    // 위도와 경도의 총 합을 초기화합니다.
    let totalLat = 0;
    let totalLng = 0;

    // 모든 마커의 위도와 경도를 합산합니다.
    positions.forEach(position => {
        totalLat += position.getLat();
        totalLng += position.getLng();
    });

    // 마커들의 중간 지점을 계산합니다.
    const centerLat = totalLat / positions.length;
    const centerLng = totalLng / positions.length;

    return {
        lat: centerLat,
        lon: centerLng
    };
}
