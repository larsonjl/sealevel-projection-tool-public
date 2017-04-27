function queryTimeseries(e){
	var lngSym = 'E', latSym = 'N', lat, lng, decimLat, wholeLat, wholeLon, latitude, longitude, decimLat, decimLng

	lat = e.lngLat.lat + 0.5;
	lng = e.lngLat.lng + 0.5;

	while (lng > 180){
		lng = lng - 360
	};

	while (lng < -180){
		lng = lng + 360
	};

	// Get lat and lon signs, then make positive:
	if (lng < 0) { lng = -lng; lngSym = 'W'; };
	if (lat < 0) { lat = -lat; latSym = 'S'; };

	decimLng = lng % 1.0;
	wholeLng = lng - decimLng;
	decimLat = lat % 1.0;
	wholeLat = lat - decimLat;

	if (decimLat > 0.5){
		wholeLat += 1
	};
	if (decimLng > 0.5){
		wholeLng += 1
	};

	if (lngSym === 'W') { wholeLng = - wholeLng; };
	if (latSym === 'S') { wholeLat = - wholeLat; };

    $.get(apiLoc + "/projection_api?latlonloc=" + wholeLat + '_' + wholeLng + '_' + queryString  , function(data, status){
		//If selected land... else...
		if (data.hasOwnProperty('locTS')){
			scrollPopup = document.getElementById('error-popup');
			scrollPopup.style.zIndex = 5000;
			scrollPopup.style.transition = "opacity 1s";
			scrollPopup.style.opacity = 1;
			setTimeout(function () {
				scrollPopup.style.opacity = 0;
				scrollPopup.style.zIndex = 0;
			}, 3000);
		}
		else{
			plotFillProjection(data, -999, "Absolute sea level projection for " + wholeLng + 'E'+ ', ' + wholeLat + 'N')
			maximizePlot();
			}
  });
};

function queryCoastLoc(indxNum, vcm, loc){
	$.get(apiLoc + "/projection_api?coastLoc=" + indxNum + '_' + queryString  , function(data, status){
		var wholeLon = loc[0] - loc[0]%1
		var wholeLat = loc[1] - loc[1]%1
		plotFillProjection(data, vcm, "Relative sea level projection for " + wholeLon + 'E'+ ', ' + wholeLat +  'N');
		maximizePlot();
	});
};

function centerMap(lngLat) {
    "use strict";
    if (map.getZoom() < 5.5) {
        map.jumpTo({ "center": lngLat, "zoom": 5.5 });
    } else {
        map.jumpTo({ "center": lngLat });
    }
}

// Updates map year of data displayed
function updateMapYear(){
	var year = document.getElementById('display-year').value
	removeAllVisibility();
	switch(displayMode){
		case 'relative':
			map.setLayoutProperty(coastLayerNames[year], 'visibility', 'visible')
			map.setLayoutProperty(coastLayerNames[year]+'-hover', 'visibility', 'visible')
			break;
		case 'absolute':
			map.setLayoutProperty(oneDegGridLayers[year], 'visibility', 'visible')
			map.setLayoutProperty(twoDegGridLayers[year], 'visibility', 'visible')
			break;
		case 'crust':
			map.setLayoutProperty(vcmLayerNames[year], 'visibility', 'visible')
			break;
	}
};

function addCrustLandSource(){
	"use strict";
	map.addSource('vcmLand', {
        type: "vector",
        url: 'mapbox://jlarson630.67mxd7i0'
            });
};

function removeCrustLandLayer(){
	"use strict";
	if (map.getLayer('vcmLand2100') !== undefined){
		map.removeLayer('vcmLand2100')
	};
};

function loadCrustLandLayer(){
	"use strict";
	dMin = -15;
	dMax = 25;
	removeRelativeLayers();
	removeAbsoluteLayers();
	map.addLayer({
            "id": "vcmLand2100",
            "type": "fill",
            "source": "vcmLand",
			"z-index":999,
			'source-layer': "vcmHalfgeojson",
            "layout": {
                    'visibility': 'visible'
            },
            "paint": {
                "fill-color": {
                    property: 'sl2100',
                    stops: getColorbarStops('spectral', dMin, dMax)
                    }, 'fill-opacity': 1.0}
            }, 'water');

	map.addLayer({
            "id": "vcmLand2075",
            "type": "fill",
            "source": "vcmLand",
			"z-index":999,
			'source-layer': "vcmHalfgeojson",
            "layout": {
                    'visibility': 'none'
            },
            "paint": {
                "fill-color": {
                    property: 'sl2075',
                    stops: getColorbarStops('spectral', dMin, dMax)
                    }, 'fill-opacity': 1.0}
            }, 'water');

	map.addLayer({
            "id": "vcmLand2050",
            "type": "fill",
            "source": "vcmLand",
			"z-index":999,
			'source-layer': "vcmHalfgeojson",
            "layout": {
                    'visibility': 'none'
            },
            "paint": {
                "fill-color": {
                    property: 'sl2050',
                    stops: getColorbarStops('spectral', dMin, dMax)
                    }, 'fill-opacity': 1.0}
            }, 'water');

	map.addLayer({
            "id": "vcmLand2025",
            "type": "fill",
            "source": "vcmLand",
			"z-index":999,
			'source-layer': "vcmHalfgeojson",
            "layout": {
                    'visibility': 'none'
            },
            "paint": {
                "fill-color": {
                    property: 'sl2025',
                    stops: getColorbarStops('spectral', dMin, dMax)
                    }, 'fill-opacity': 1.0}
            }, 'water');
};
// Add all relative sea level layers (i.e. one for each year)
function removeRelativeLayers(){
	"use strict";
	if (map.getLayer('rel2025') !== undefined){
		map.removeLayer('rel2025')
		map.removeLayer('rel2050')
		map.removeLayer('rel2075')
		map.removeLayer('rel2100')
		map.removeLayer('rel2025-hover')
		map.removeLayer('rel2050-hover')
		map.removeLayer('rel2075-hover')
		map.removeLayer('rel2100-hover')
	}
};

function loadCustomRelative(){
	"use strict";
	removeRelativeLayers();
	removeCrustLandLayer();
	map.addLayer({
            "id": "rel2025",
            "type": "circle",
            "source": "coastScatter",
			"z-index":999,
            "layout": {
                    'visibility': 'none'},
			"paint":	{
					"circle-radius": 6,
					"circle-color": {
	                    property: 'sl2025',
	                    stops: getColorbarStops('spectral', dMin, dMax)
                    }
				}
            });

	map.addLayer({
			"id": "rel2050",
			"type": "circle",
			"source": "coastScatter",
			"z-index":999,
			"layout":{
					'visibility': 'none'},
			"paint":{
					"circle-radius": 6,
					"circle-color": {
						property: 'sl2050',
						stops: getColorbarStops('spectral', dMin, dMax)
					}
				}
			});

	map.addLayer({
			"id": "rel2075",
			"type": "circle",
			"source": "coastScatter",
			"z-index":999,
			"layout": {
					'visibility': 'none'},
			"paint":{
					"circle-radius": 6,
					"circle-color": {
						property: 'sl2075',
						stops: getColorbarStops('spectral', dMin, dMax)
					}
				}
			});

	map.addLayer({
			"id": "rel2100",
			"type": "circle",
			"source": "coastScatter",
			"z-index":999,
			"layout": {
					'visibility': 'none'},
			"paint":{
					"circle-radius": 6,
					"circle-color": {
						property: 'sl2100',
						stops: getColorbarStops('spectral', dMin, dMax)
					}
				}
			});
	// Hover layers
	map.addLayer({
			"id": "rel2025-hover",
			"type": "circle",
			"source": "coastScatter",
			"z-index":999,
			"layout": {
					'visibility': 'none'},
			"paint":	{
					"circle-radius": 12,
					"circle-color": {
						property: 'sl2025',
						stops: getColorbarStops('spectral', dMin, dMax)
					}
				},
			 "filter": ["==", "name", ""]
			});

	map.addLayer({
			"id": "rel2050-hover",
			"type": "circle",
			"source": "coastScatter",
			"z-index":999,
			"layout": {
					'visibility': 'none'},
			"paint":	{
				"circle-radius": 12,
					"circle-color": {
						property: 'sl2050',
						stops: getColorbarStops('spectral', dMin, dMax)
					}
				},
			 "filter": ["==", "name", ""]
			});

	map.addLayer({
			"id": "rel2075-hover",
			"type": "circle",
			"source": "coastScatter",
			"z-index":999,
			"layout": {
					'visibility': 'none'},
			"paint":	{
				"circle-radius": 12,
					"circle-color": {
						property: 'sl2075',
						stops: getColorbarStops('spectral', dMin, dMax)
					}
				},
			 "filter": ["==", "name", ""]
			});

	map.addLayer({
			"id": "rel2100-hover",
			"type": "circle",
			"source": "coastScatter",
			"z-index":999,
			"layout": {
					'visibility': 'none'},
			"paint":	{
				"circle-radius": 12,
					"circle-color": {
						property: 'sl2100',
						stops: getColorbarStops('spectral', dMin, dMax)
					}
				},
			 "filter": ["==", "name", ""]
		});
}

// Add all grid layers (i.e. one for each year)
function removeAbsoluteLayers(){
	if (map.getLayer('oneDeg2025') !== undefined){
		map.removeLayer('oneDeg2025')
		map.removeLayer('twoDeg2025')
		map.removeLayer('oneDeg2050')
		map.removeLayer('twoDeg2050')
		map.removeLayer('oneDeg2075')
		map.removeLayer('twoDeg2075')
		map.removeLayer('oneDeg2100')
		map.removeLayer('twoDeg2100')
	}
}

function loadGridLayers(){
	removeAbsoluteLayers();
	removeCrustLandLayer()
    map.addLayer({
            "id": "oneDeg2025",
            "type": "fill",
            "source": "oneDegreeData",
            "layout": {
                    'visibility': 'none'
            },
            'minzoom': 3,
            "paint": {
                "fill-color": {
                    property: 'sl2025',
                    stops: getColorbarStops('spectral', dMin, dMax)
                    }, 'fill-opacity': 1.0}
            }, 'landcover');

        map.addLayer({
                "id": "twoDeg2025",
                "type": "fill",
                "source": "twoDegreeData",
                'maxzoom': 3,
                "layout": {
                        'visibility': 'none'
                },
                "paint": {
                    "fill-color": {
                    type:'exponential',
                    property: 'sl2025',
                    stops: getColorbarStops('spectral', dMin, dMax)
                    }, 'fill-opacity': 1.0}
            }, 'landcover');

        map.addLayer({
                "id": "oneDeg2050",
                "type": "fill",
                "source": "oneDegreeData",
                "layout": {
                        'visibility': 'none'
                },
                'minzoom': 3,
                "paint": {
                    "fill-color": {
                        property: 'sl2050',
                        stops: getColorbarStops('spectral', dMin, dMax)
                        }, 'fill-opacity': 1.0}
                }, 'landcover');

            map.addLayer({
                    "id": "twoDeg2050",
                    "type": "fill",
                    "source": "twoDegreeData",
                    'maxzoom': 3,
                    "layout": {
                            'visibility': 'none'
                    },
                    "paint": {
                        "fill-color": {
                        type:'exponential',
                            property: 'sl2050',
                            stops: getColorbarStops('spectral', dMin, dMax)
                            }, 'fill-opacity': 1.0}
                }, 'landcover');

            map.addLayer({
                    "id": "oneDeg2075",
                    "type": "fill",
                    "source": "oneDegreeData",
                    "layout": {
                            'visibility': 'none'
                    },
                    'minzoom': 3,
                    "paint": {
                        "fill-color": {
                            property: 'sl2075',
                            stops: getColorbarStops('spectral', dMin, dMax)
                            }, 'fill-opacity': 1.0}
                    }, 'landcover');

                map.addLayer({
                        "id": "twoDeg2075",
                        "type": "fill",
                        "source": "twoDegreeData",
                        'maxzoom': 3,
                        "layout": {
                                'visibility': 'none'
                        },
                        "paint": {
                            "fill-color": {
                                type:'exponential',
                                property: 'sl2075',
                                stops: getColorbarStops('spectral', dMin, dMax)
                                }, 'fill-opacity': 1.0}
                    }, 'landcover');

                map.addLayer({
                        "id": "oneDeg2100",
                        "type": "fill",
                        "source": "oneDegreeData",
                        "layout": {
                                'visibility': 'visible'
                        },
                        'minzoom': 3,
                        "paint": {
                            "fill-color": {
                                property: 'sl2100',
                                stops: getColorbarStops('spectral', dMin, dMax)
                                }, 'fill-opacity': 1.0}
                        }, 'landcover');

                    map.addLayer({
                            "id": "twoDeg2100",
                            "type": "fill",
                            "source": "twoDegreeData",
                            'maxzoom': 3,
                            "layout": {
                                    'visibility': 'visible'
                            },
                            "paint": {
                                "fill-color": {
                                    type:'exponential',
                                    property: 'sl2100',
                                    stops: getColorbarStops('spectral', dMin, dMax)
                                    }, 'fill-opacity': 1.0}
                        }, 'landcover');

}
*/
// CoastLocs Hover functionality
function coastHover(e) {
	var zoom = map.getZoom();
	if (zoom>1.0){
		if (map.getLayer('rel2025') !== undefined){
			var year = document.getElementById('display-year').value
			var features = map.queryRenderedFeatures(e.point, { layers: ["rel" + year] });
			if (features.length) {
				map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
				map.setFilter("rel" + year+ "-hover", ["==", "data_index", features[0].properties.data_index]);
			} else {
				map.setFilter("rel" + year+ "-hover", ["==", "data_index", ""]);
			}
		}
	}
};

//map.on("mouseout", function() {
//   map.setFilter("rel2100-hover", ["==", "data_index", ""]);
// });

function clickDecider(e, status){
	"use strict";
	var year = document.getElementById("display-year").value
	switch(displayMode){
		case 'relative':
			var features = map.queryRenderedFeatures(e.point, { layers: ["rel" + year + "-hover"]});
			if (features.length > 0){
				currentLocation = features[0].properties.data_index
				currentVCM = features[0].properties.vcm_mmyr
				currentLatLon = features[0].geometry.coordinates
				queryCoastLoc(currentLocation, currentVCM, currentLatLon);
			};
			break;
		case 'absolute':
			queryTimeseries(e);
			break;
		case 'crust':
			break;
	};
};

// initializeMap :: loads background and interactive maps and starts page listeners.
function initializeMap() {
    "use strict";
    // Initialize Mapbox Interactive Map:
    mapboxgl.accessToken = 'pk.eyJ1IjoiamxhcnNvbjYzMCIsImEiOiJjaXh3ZWMxcDcwMDI1MndyeTM0cGt4NzNqIn0.7_AO6fr8Cwl7x-XSPylN-w';
    if (!mapboxgl.supported()) {
        alert('Your browser does not support Mapbox GL. Please try a different browser, or make sure that you have WebGL enabled on your current browser.');
    } else {
		var bounds = [
    			[-720, -70], // Southwest coordinates
    			[720.0, 75]  // Northeast coordinates
				];
        map = new mapboxgl.Map({
            version: 6,
            container: 'map-div',
            style: 'mapbox://styles/jlarson630/cj0my6omj006i2smrucl0x43c',
            center: [-88.137, 35.13],
            zoom: 2,
            maxZoom: 5,
            minZoom: 1.0,
			attributionControl: false,
			maxBounds: bounds
        })};
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left');
		map.on("mousemove", function (e) {coastHover(e)});
		map.on('click', function (e, status) {clickDecider(e, status)});
}
