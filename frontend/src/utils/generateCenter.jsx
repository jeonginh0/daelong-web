import * as coordsHandler from './coordsHandler'

export const generateCenter = (wgsCoords) => {
    const wtmCoords = coordsHandler.convertWgsToWtmOfList(wgsCoords)

    const splitedCoords = {
        leftCoords: coordsHandler.splitWtmCoords(wtmCoords).leftList,
        rightCoords: coordsHandler.splitWtmCoords(wtmCoords).rightList,
    }

    const sortedCoords = {
        ascCoords: coordsHandler.sortCoordY(splitedCoords.leftCoords).asc,
        desCoords: coordsHandler.sortCoordY(splitedCoords.rightCoords).des,
    }

    const polyCoords = sortedCoords.ascCoords.concat(sortedCoords.desCoords)

    if (wtmCoords.length === 2) {
        var centerX = coordsHandler.getCenteroid(polyCoords).x2,
            centerY = coordsHandler.getCenteroid(polyCoords).y2
    }
    else {
        var centerX = coordsHandler.getCenteroid(polyCoords).x,
            centerY = coordsHandler.getCenteroid(polyCoords).y
    }
    const centerLat = coordsHandler.convertWtmToWgs(centerX, centerY).lat,
        centerLng = coordsHandler.convertWtmToWgs(centerX, centerY).lng

    return { centerLat, centerLng }
}

export default generateCenter;