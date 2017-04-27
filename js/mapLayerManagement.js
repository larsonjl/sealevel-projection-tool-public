/*
The functions here are used to add and remove all the sources and layers used by the
web tool.
*/

// Add sources for 1deg, 2deg ocean grids, coast scatter layer, crustal motion
function initializeTiles(){
	"use strict";
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
        url: 'mapbox://jlarson630.965yd3n2'
            });
};

// Removes all grid (i.e. absolute sea level) layer visibility
function removeGridVisibility(){
	"use strict";
	if (map.getLayer('oneDeg2025') !== undefined){
		for (var years in oneDegGridLayers){
			var layers = oneDegGridLayers[years]
			map.setLayoutProperty(layers, 'visibility', 'none')
		};
		for (var years in twoDegGridLayers){
			var layers = twoDegGridLayers[years]
			map.setLayoutProperty(layers, 'visibility', 'none')
		};
	};
};

// Removes all crust layer visibility
function removeCrustalVisibility(){
	"use strict";
	if (map.getLayer('vcmLand2100') !== undefined){
		for (var years in vcmLayerNames){
			var layers = vcmLayerNames[years]
			map.setLayoutProperty(layers, 'visibility', 'none')
		};
	};
};

// Removes all coast scatter visibility
function removeScatterVisibility(){
	"use strict";
	if (map.getLayer('rel2025') !== undefined){
		for (var jj in coastLayerNames){
			var layers = coastLayerNames[jj]
			map.setLayoutProperty(layers, 'visibility', 'none')
		};
	};
};


function removeAllVisibility(){
	removeScatterVisibility();
	removeCrustalVisibility();
	removeGridVisibility();
};

// Loads vertical crustal motion layers
function loadCrustLandLayer(){
	"use strict";
	dMin = -15;
	dMax = 25;
	for (var years in vcmLayerNames){
		var layers = vcmLayerNames[years]
		map.addLayer({
	            "id": layers,
	            "type": "fill",
	            "source": "vcmLand",
				"z-index":999,
				'source-layer': "vcmHalfgeojson",
	            "layout": {
	                    'visibility': 'visible'
	            },
	            "paint": {
	                "fill-color": {
	                    property: 'sl' + years,
	                    stops: getColorbarStops('spectral', dMin, dMax)
	                    }, 'fill-opacity': 1.0}
	            }, 'water');
		};
};

// Load relative sea level (i.e. scatter along coast)
function loadCustomRelative(){
	"use strict";
	for (var years in coastLayerNames){
		var layers = coastLayerNames[years]
		map.addLayer({
				"id": layers + '-hover',
				"type": "circle",
				"source": "coastScatter",
				"z-index":999,
				"layout": {
						'visibility': 'none'},
				"paint":	{
					"circle-radius": 12,
						"circle-color": {
							property: 'sl' + years,
							stops: getColorbarStops('spectral', dMin, dMax)
						}
					},
				 "filter": ["==", "name", ""]
			});
		map.addLayer({
				"id": layers,
				"type": "circle",
				"source": "coastScatter",
				"z-index":999,
				"layout": {
						'visibility': 'none'},
				"paint":	{
						"circle-radius": 6,
						"circle-color": {
							property: 'sl' + years,
							stops: getColorbarStops('spectral', dMin, dMax)
							}
						}
					});
			}
};


function loadGridLayers(){
	"use strict";
	for (var years in oneDegGridLayers){
		var layers = oneDegGridLayers[years]
	    map.addLayer({
	            "id": layers,
	            "type": "fill",
	            "source": "oneDegreeData",
	            "layout": {
	                    'visibility': 'none'
	            },
	            'minzoom': 3,
	            "paint": {
	                "fill-color": {
	                    property: 'sl' + years,
	                    stops: getColorbarStops('spectral', dMin, dMax)
	                    }, 'fill-opacity': 1.0}
	            }, 'landcover');
	};
	for (var years in twoDegGridLayers){
		var layers = twoDegGridLayers[years]
	    map.addLayer({
	            "id": layers,
	            "type": "fill",
	            "source": "twoDegreeData",
	            "layout": {
	                    'visibility': 'none'
	            },
	            'maxzoom': 3,
	            "paint": {
	                "fill-color": {
	                    property: 'sl' + years,
	                    stops: getColorbarStops('spectral', dMin, dMax)
	                    }, 'fill-opacity': 1.0}
	            }, 'landcover');
	};
};
