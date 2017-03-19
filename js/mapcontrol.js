function queryTimeseries(e, queryString){
	var lngSym = 'E', latSym = 'N', lat, lng, decimLat, wholeLat, wholeLon, latitude, longitude, decimLat, decimLng

	lat = e.lngLat.lat
	lng = e.lngLat.lng

	while (lng > 180){
		lng = lng - 360
	}

	while (lng < -180){
		lng = lng + 360
	}

	// Get lat and lon signs, then make positive:
	if (lng < 0) { lng = -lng; lngSym = 'W'; }
	if (lat < 0) { lat = -lat; latSym = 'S'; }

	decimLng = lng % 1.0;
	wholeLng = lng - decimLng;
	decimLat = lat % 1.0;
	wholeLat = lat - decimLat;

	if (decimLat > 0.5){
		wholeLat += 1
	}
	if (decimLng > 0.5){
		wholeLng += 1
	}

	if (lngSym === 'W') { wholeLng = - wholeLng; }
	if (latSym === 'S') { wholeLat = - wholeLat; }

	queryString = wholeLat + '_' + wholeLng + '_' + rcpScenario + queryString

    $.get(apiLoc + "/projection_api?latlonloc=" + queryString  , function(data, status){
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
			plotFillProjection(data, "Sea level projection for " + wholeLng + 'E'+ ', ' + wholeLat + 'N')
			maximizePlot();
			}
  });
}

// setPopupAndCenter :: When a new plot is requested, reset the Map Popup.
function setPopupAndCenter(e) {
    "use strict";
    var popupText, jsonAltimetryLocation, jsonLat, jsonLon, latitude, longitude, geojson;

    if (marker) {
        marker.remove();
    }

    jsonAltimetryLocation = getLatLonGridLocation(e.lngLat.lng, e.lngLat.lat);
    jsonLat = jsonAltimetryLocation[0];
    jsonLon = jsonAltimetryLocation[1];
    latitude = jsonAltimetryLocation[2];
    longitude = jsonAltimetryLocation[3];

    geojson = getAltimetryLocationBox(jsonLat, jsonLon);

    if (altimetry_outlined === true) {
        map.removeLayer('altimetry-location-box');
        map.removeSource('altimetry-location-box');
        outlineAltimetry(geojson);
    } else {
        outlineAltimetry(geojson);
    }


    popupText = "<div class='altimetry-popup'><h2>Altimetry</h2>" +
        "<span class='bold'>Lat:</span> " + jsonLat + "<br><span class='bold'>Lon:</span> " + jsonLon + "</div>";

    marker = new mapboxgl.Popup({anchor: "top-left"})
        .setLngLat({ lng: (longitude + 0.08333), lat: (latitude - 0.08333) })
        .setHTML(popupText)
        .addTo(map);

    if (gauge_marker) {
        gauge_marker.addTo(map);
    }

    centerMap({ lng: longitude, lat: latitude });
}

function centerMap(lngLat) {
    "use strict";
    if (map.getZoom() < 5.5) {
        map.jumpTo({ "center": lngLat, "zoom": 5.5 });
    } else {
        map.jumpTo({ "center": lngLat });
    }
}

function updateMapYear(){
	var year = document.getElementById('display-year').value
	map.setLayoutProperty('oneDeg2025', 'visibility', 'none')
	map.setLayoutProperty('oneDeg2050', 'visibility', 'none')
	map.setLayoutProperty('oneDeg2075', 'visibility', 'none')
	map.setLayoutProperty('oneDeg2100', 'visibility', 'none')
	map.setLayoutProperty('twoDeg2025', 'visibility', 'none')
	map.setLayoutProperty('twoDeg2050', 'visibility', 'none')
	map.setLayoutProperty('twoDeg2075', 'visibility', 'none')
	map.setLayoutProperty('twoDeg2100', 'visibility', 'none')
    var layerOneDict = {2025:"oneDeg2025", 2050:"oneDeg2050",2075:"oneDeg2075", 2100:"oneDeg2100"}
    var layerTWoDict = {2025:"twoDeg2025", 2050:"twoDeg2050",2075:"twoDeg2075", 2100:"twoDeg2100"}
    map.setLayoutProperty(layerOneDict[year], 'visibility', 'visible')
    map.setLayoutProperty(layerTWoDict[year], 'visibility', 'visible')
	maximizePlot();
	minimizePlot();
}

// Add sources for both 1deg and 2deg grids and coast scatter
function initializeTiles(){
    map.addSource("twoDegreeData", {
        "type":"geojson",
        "data": twoDegGrid
            });

    map.addSource("oneDegreeData", {
            "type": "geojson",
            "data": oneDegGrid
                });
}

// Add coast scatter to map
function addCoastScatter(){
	map.addLayer({
            "id": "coastPoints",
            "type": "circle",
            "source": "coastScatter",
			"z-index":999,
            "layout": {
                    'visibility': 'visible'},
			"paint": {
				"circle-color": {
				type:'exponential',
					property: 'sl2100',
					stops: getColorbarStops('spectral', dMin, dMax)
					}}
            });
}

function coastPointInteractions() {
    "use strict";
	map.on('click', function(e) {
	        // set bbox as 5px reactangle area around clicked point
	        var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
	        var features = map.queryRenderedFeatures(bbox, { layers: ['coastPoints'] });
			console.log(features)
		});
}

function loadCustomLayers(){
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

// initializeMap :: loads background and interactive maps and starts page listeners.
function initializeMap() {
    "use strict";
    // Initialize Mapbox Interactive Map:
    mapboxgl.accessToken = 'pk.eyJ1IjoiamxhcnNvbjYzMCIsImEiOiJjaXh3ZWMxcDcwMDI1MndyeTM0cGt4NzNqIn0.7_AO6fr8Cwl7x-XSPylN-w';

    if (!mapboxgl.supported()) {
        alert('Your browser does not support Mapbox GL. Please try a different browser, or make sure that you have WebGL enabled on your current browser.');
    } else {
        map = new mapboxgl.Map({
            version: 6,
            container: 'map-div',
            style: 'mapbox://styles/jlarson630/cj0be6ppp001y2snxtd6slir6',
            center: [-88.137, 35.13],
            zoom: 2,
            maxZoom: 5,
            minZoom: 1.0,
			attributionControl: false
        })};
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left')
        map.on('click', function (e) { queryTimeseries(e, constructQueryArray());});

}
