// Add sources for 1deg, 2deg ocean grids, coast scatter layer, crustal motion
function initializeTiles(){
    map.addSource("twoDegreeData", {
        "type":"geojson",
        "data": twoDegGrid
            });

    map.addSource("oneDegreeData", {
            "type": "geojson",
            "data": oneDegGrid
                });

	map.addSource("coastScatter", {
			"type": "geojson",
			"data": coastLocs
	});

	map.addSource('vcmLand', {
        type: "vector",
        url: 'mapbox://jlarson630.1d0a9p4k'
            });
};
