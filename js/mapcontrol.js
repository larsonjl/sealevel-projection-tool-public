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

	queryString = wholeLat + '_' + wholeLng + '_' + queryString

    $.get(apiLoc + "/projection_api?latlonloc=" + queryString  , function(data, status){
		plotFillProjection(data, "Sea level projection for " + wholeLng + 'E'+ ', ' + wholeLat + 'N')
  });
}


function getLatLonGridLocation(lng, lat) {
    "use strict";
    var lngSym = 'E', latSym = 'N', latitude, longitude,
        decimLng, wholeLng, decimLat, wholeLat, jsonLon, jsonLat;

    // Get lat and lon signs, then make positive:
    if (lng < 0) { lng = -lng; lngSym = 'W'; }
    if (lat < 0) { lat = -lat; latSym = 'S'; }

    // Latitude and Longitude Whole and Part:
    decimLng = lng % 1.0;
    wholeLng = lng - decimLng;
    decimLat = lat % 1.0;
    wholeLat = lat - decimLat;

    // Round lng to nearest location & get lng filename:
    //   -> Decimals: .0833, .2500, .4167, .5833, .7500, .9167
    if (decimLng >= 0 && decimLng < 0.166667) {
        jsonLon = wholeLng.toFixed(0) + '.0833°' + lngSym;
        longitude = wholeLng + 0.083333;
    } else if (decimLng >= 0.166667 && decimLng < 0.333333) {
        jsonLon = wholeLng.toFixed(0) + '.2500°' + lngSym;
        longitude = wholeLng + 0.25;
    } else if (decimLng >= 0.333333 && decimLng < 0.5) {
        jsonLon = wholeLng.toFixed(0) + '.4167°' + lngSym;
        longitude = wholeLng + 0.416667;
    } else if (decimLng >= 0.5 && decimLng < 0.666667) {
        jsonLon = wholeLng.toFixed(0) + '.5833°' + lngSym;
        longitude = wholeLng + 0.583333;
    } else if (decimLng >= 0.666667 && decimLng < 0.833333) {
        jsonLon = wholeLng.toFixed(0) + '.7500°' + lngSym;
        longitude = wholeLng + 0.75;
    } else {
        jsonLon = wholeLng.toFixed(0) + '.9167°' + lngSym;
        longitude = wholeLng + 0.916667;
    }

    // Round lat to nearest location & get lat filename:
    if (decimLat >= 0 && decimLat < 0.166667) {
        jsonLat = wholeLat.toFixed(0) + '.0833°' + latSym;
        latitude = wholeLat + 0.083333;
    } else if (decimLat >= 0.166667 && decimLat < 0.333333) {
        jsonLat = wholeLat.toFixed(0) + '.2500°' + latSym;
        latitude = wholeLat + 0.25;
    } else if (decimLat >= 0.333333 && decimLat < 0.5) {
        jsonLat = wholeLat.toFixed(0) + '.4167°' + latSym;
        latitude = wholeLat + 0.416667;
    } else if (decimLat >= 0.5 && decimLat < 0.666667) {
        jsonLat = wholeLat.toFixed(0) + '.5833°' + latSym;
        latitude = wholeLat + 0.583333;
    } else if (decimLat >= 0.666667 && decimLat < 0.833333) {
        jsonLat = wholeLat.toFixed(0) + '.7500°' + latSym;
        latitude = wholeLat + 0.75;
    } else {
        jsonLat = wholeLat.toFixed(0) + '.9167°' + latSym;
        latitude = wholeLat + 0.916667;
    }

    if (lngSym === 'W') { longitude = -longitude; }
    if (latSym === 'S') { latitude = -latitude; }

    return [jsonLat, jsonLon, latitude, longitude];
}

// getLatLonJSONfilename :: given a lat/lon pair, returns time series file name.
function getLatLonJSONfilename(lng, lat) {
    "use strict";
    // var signLng = 1, signLat = 1,
    var lngSym = 'E', latSym = 'N',
        decimLng, wholeLng, decimLat, wholeLat, jsonLon, jsonLat, filename;

    // Make sure Longitude is between -180 and 180
    while (lng > 180) { lng -= 360; }
    while (lng < -180) { lng += 360; }

    // Get lat and lon signs, then make positive:
    // if (lng < 0) { signLng = -1; lng = -lng; lngSym = 'W'; }
    // if (lat < 0) { signLat = -1; lat = -lat; latSym = 'S'; }
    if (lng < 0) { lng = -lng; lngSym = 'W'; }
    if (lat < 0) { lat = -lat; latSym = 'S'; }

    // Latitude and Longitude Whole and Part:
    decimLng = lng % 1.0;
    wholeLng = lng - decimLng;
    decimLat = lat % 1.0;
    wholeLat = lat - decimLat;

    // Round lng to nearest location & get lng filename:
    //   -> Decimals: .0833, .2500, .4167, .5833, .7500, .9167
    if (decimLng === 0) {
        jsonLon = (wholeLng - 1).toFixed(0) + '9167' + lngSym;
    } else if (decimLng > 0 && decimLng < 0.166667) {
        jsonLon = wholeLng.toFixed(0) + '0833' + lngSym;
    } else if (decimLng >= 0.166667 && decimLng < 0.333333) {
        jsonLon = wholeLng.toFixed(0) + '2500' + lngSym;
    } else if (decimLng >= 0.333333 && decimLng < 0.5) {
        jsonLon = wholeLng.toFixed(0) + '4167' + lngSym;
    } else if (decimLng >= 0.5 && decimLng < 0.666667) {
        jsonLon = wholeLng.toFixed(0) + '5833' + lngSym;
    } else if (decimLng >= 0.666667 && decimLng < 0.833333) {
        jsonLon = wholeLng.toFixed(0) + '7500' + lngSym;
    } else {
        jsonLon = wholeLng.toFixed(0) + '9167' + lngSym;
    }
    while (jsonLon.length < 8) { jsonLon = '0' + jsonLon; }

    // Round lat to nearest location & get lat filename:
    if (decimLat == 0) {
        jsonLat = (wholeLat - 1).toFixed(0) + '9167' + latSym;
    } else if (decimLat >= 0 && decimLat < 0.166667) {
        jsonLat = wholeLat.toFixed(0) + '0833' + latSym;
    } else if (decimLat >= 0.166667 && decimLat < 0.333333) {
        jsonLat = wholeLat.toFixed(0) + '2500' + latSym;
    } else if (decimLat >= 0.333333 && decimLat < 0.5) {
        jsonLat = wholeLat.toFixed(0) + '4167' + latSym;
    } else if (decimLat >= 0.5 && decimLat < 0.666667) {
        jsonLat = wholeLat.toFixed(0) + '5833' + latSym;
    } else if (decimLat >= 0.666667 && decimLat < 0.833333) {
        jsonLat = wholeLat.toFixed(0) + '7500' + latSym;
    } else {
        jsonLat = wholeLat.toFixed(0) + '9167' + latSym;
    }
    while (jsonLat.length < 7) { jsonLat = '0' + jsonLat; }

    // Concatenate file extension:
    filename = 'api/v2/altimetry/'.concat(jsonLat, '/', jsonLon, '.json');
    return filename;
}

function getAltimetryLocationBox(jsonLat, jsonLon) {
    "use strict";
    // {"type":"Feature","properties":{"mscn_id":1},"geometry":{"type":"Polygon","coordinates":[[[-72.972973,77.500000],[-68.108108,77.500000],[-68.108108,78.500000],[-72.972973,78.500000],[-72.972973,77.500000]]]}}
    var coordinates, minLat, maxLat, minLon, maxLon,
        latParts = jsonLat.split("."),
        latWholeStr = latParts[0],
        latDecimStr = latParts[1].split("°")[0],
        latSignStr = latParts[1].split("°")[1],
        latSign = (latSignStr == "S") ? -1 : 1,
        lonParts = jsonLon.split("."),
        lonWholeStr = lonParts[0],
        lonDecimStr = lonParts[1].split("°")[0],
        lonSignStr = lonParts[1].split("°")[1],
        lonSign = (lonSignStr == "W") ? -1 : 1;

    switch (latDecimStr) {
        case "0833":
            minLat = latSign * Number(latWholeStr + ".000000");
            maxLat = latSign * Number(latWholeStr + ".166667");
            break;
        case "2500":
            minLat = latSign * Number(latWholeStr + ".166667");
            maxLat = latSign * Number(latWholeStr + ".333333");
            break;
        case "4167":
            minLat = latSign * Number(latWholeStr + ".333333");
            maxLat = latSign * Number(latWholeStr + ".500000");
            break;
        case "5833":
            minLat = latSign * Number(latWholeStr + ".500000");
            maxLat = latSign * Number(latWholeStr + ".666667");
            break;
        case "7500":
            minLat = latSign * Number(latWholeStr + ".666667");
            maxLat = latSign * Number(latWholeStr + ".833333");
            break;
        case "9167":
            minLat = latSign * Number(latWholeStr + ".833333");
            maxLat = latSign * (Number(latWholeStr + ".000000") + 1.0);
            break;
    }
    minLat = String(minLat);
    maxLat = String(maxLat);

    switch (lonDecimStr) {
        case "0833":
            minLon = lonSign * Number(lonWholeStr + ".000000");
            maxLon = lonSign * Number(lonWholeStr + ".166667");
            break;
        case "2500":
            minLon = lonSign * Number(lonWholeStr + ".166667");
            maxLon = lonSign * Number(lonWholeStr + ".333333");
            break;
        case "4167":
            minLon = lonSign * Number(lonWholeStr + ".333333");
            maxLon = lonSign * Number(lonWholeStr + ".500000");
            break;
        case "5833":
            minLon = lonSign * Number(lonWholeStr + ".500000");
            maxLon = lonSign * Number(lonWholeStr + ".666667");
            break;
        case "7500":
            minLon = lonSign * Number(lonWholeStr + ".666667");
            maxLon = lonSign * Number(lonWholeStr + ".833333");
            break;
        case "9167":
            minLon = lonSign * Number(lonWholeStr + ".833333");
            maxLon = lonSign * (Number(lonWholeStr + ".000000") + 1.0);
            break;
    }
    minLon = minLon;
    maxLon = maxLon;

    coordinates = [[minLon, minLat], [minLon, maxLat], [maxLon, maxLat],
        [maxLon, minLat], [minLon, minLat]];
    return coordinates;
}

function outlineAltimetry(coords) {
    "use strict";
    map.addLayer({
        'id': 'altimetry-location-box',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coords
                }
            }
        },
        'layout': {
            'line-join': 'bevel',
            'line-cap': 'square'
        },
        'paint': {
            'line-color': '#FFF',
            'line-width': 2
        }
    },'gauges');
    altimetry_outlined = true;
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

function disableAllLayers() {
    "use strict";
    var i, x;

    activeMap = 'none';
    if (marker) { marker.remove(); }

    // Deactivate all map layers
    map.setLayoutProperty('alti-rms-fine',      'visibility', 'none');
    map.setLayoutProperty('alti-rms-coarse',    'visibility', 'none');
    map.setLayoutProperty('alti-trend-fine',    'visibility', 'none');
    map.setLayoutProperty('alti-trend-coarse',  'visibility', 'none');
    map.setLayoutProperty('alti-annual-fine',   'visibility', 'none');
    map.setLayoutProperty('alti-annual-coarse', 'visibility', 'none');

    // Deactivate all toggle buttons
    x = document.getElementsByClassName("data-active");
    for (i = 0; i < x.length; i += 1) { x[i].className = ''; }
}

function showTideGaugeData() {
    "use strict";
    var tideGaugeFile = 'api/v2/tidegauges/' + tideGaugeCode + '.json';
    var request = new XMLHttpRequest();
    request.open('GET', tideGaugeFile, true);
    request.onload = function () {
        var scrollPopup;
        if (request.status >= 200 && request.status < 400) {
            // Success!
            data_tidegauge = JSON.parse(request.responseText);

            data_tidegauge_header = dataHeaderInfo('tidegauge');

            minDate = data_tidegauge.time_yrs[0];
            maxDate = data_tidegauge.time_yrs[data_tidegauge.time_yrs.length - 1];

            altimetry_plotted = false;
            tidegauge_plotted = true;
            hideAltimetryLS();

            selectAltimetry({lngLat:{lng: data_tidegauge.altimetry.lon, lat: data_tidegauge.altimetry.lat}});

        } else {
            // We reached our target server, but it returned an error
            scrollPopup = document.getElementById('error-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.transition = "opacity 1s";
            scrollPopup.style.opacity = 1;
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                scrollPopup.style.zIndex = 0;
            }, 3000);
        }
    };
    request.onerror = function () {
      // There was a connection error of some sort
    };
    request.send();
}

// selectTideGauge :: opens Tide Gauge popup with link to show data
function selectTideGauge(feature) {
    "use strict";
    var request;

    var lng_str = feature.geometry.coordinates[0];
    var lat_str = feature.geometry.coordinates[1];
    tideGaugeCode = feature.properties.code;
    tideGaugeName = feature.properties.title;

    if (lng_str < 0) {
        lng_str = (-lng_str).toFixed(6) + "&deg;W";
    } else if (lng_str === 0) {
        lng_str = "0.000000&deg;";
    } else {
        lng_str = (lng_str).toFixed(6) + "&deg;E";
    }

    if (lat_str < 0) {
        lat_str = (-lat_str).toFixed(6) + "&deg;S";
    } else if (lat_str === 0) {
        lat_str = "0.000000&deg;";
    } else {
        lat_str = (lat_str).toFixed(6) + "&deg;N";
    }

    if (gauge_marker) { gauge_marker.remove(); }
    gauge_marker = new mapboxgl.Popup({anchor: "top-right"})
        .setLngLat({lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1]})
        .setHTML("<div class='tide-gauge-popup'><h2>Tide Gauge</h2>" +
            "<span class='italics'>" + lat_str + ", " + lng_str + "</span>" +
            "<br><span class='bold'>Site:</span> " + feature.properties.title +
            "<br><span class='bold'>Code:</span> " + feature.properties.code + "</div>");
        //.addTo(map);

    showTideGaugeData();

    centerMap({lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1]});
}

function selectAltimetry(e) {
    "use strict";
    var request, lon_range, lat_range, pageWidth;

    // Show altimetry:
    minDate = time.time_yrs[0];
    maxDate = time.time_yrs[time.time_yrs.length - 1];

    if (e.lngLat.lng > 180 && e.lngLat.lng <= 360) { e.lngLat.lng = e.lngLat.lng - 360; }
    if (e.lngLat.lng < -180) { e.lngLat.lng = e.lngLat.lng + 360; }

    LAT = e.lngLat.lat; // store Latitude for quick reference.
    LNG = e.lngLat.lng; // store Longitude for quick reference.

    // Define filename to get:
    jsonFilename = getLatLonJSONfilename(e.lngLat.lng, e.lngLat.lat);

    //jsonFilename = '/altimetry/' + jsonFilename;

    request = new XMLHttpRequest();
    request.open('GET', jsonFilename, true);
    request.onload = function () {
        var scrollPopup;
        if (request.status >= 200 && request.status < 400) {
            // Success!
            data_altimetry = JSON.parse(request.responseText);

            data_altimetry_header = dataHeaderInfo('altimetry');

            if (difference_plotted === true) {
                displayDifference(minDate, maxDate, "new");
                displayDataNavbar();
                setPopupAndCenter(e);
            } else {
                displayDataSeries(minDate, maxDate, "altimetry", "new");
                displayDataNavbar();
                setPopupAndCenter(e);
            }

            // Move center to the right
            lat_range = map.getBounds()._ne.lat - map.getBounds()._sw.lat;
            lon_range = map.getBounds()._ne.lng - map.getBounds()._sw.lng;
            pageWidth = getWidth();
            if (pageWidth > 500) {
                map.jumpTo({ "center": { 'lng': e.lngLat.lng - (0.15*lon_range), 'lat': e.lngLat.lat + (0.3*lat_range) } });
            } else {
                map.jumpTo({ "center": { 'lng': e.lngLat.lng, 'lat': e.lngLat.lat - (0.25*lat_range) } });
            }

        } else {
            // We reached our target server, but it returned an error
            scrollPopup = document.getElementById('error-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.transition = "opacity 1s";
            scrollPopup.style.opacity = 1;
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                scrollPopup.style.zIndex = 0;
            }, 3000);
        }
    };
    request.onerror = function () {
      // There was a connection error of some sort
    };
    request.send();
}

// selectPlotting :: get page click and grabs time series.
function selectPlotting(e, status) {
    "use strict";
    console.log(e.lngLat.lng)
    if (status === "change") {
        if (difference_plotted === true) {
            displayDifference(minDate, maxDate, "change");
        } else {
            displayDataSeries(minDate, maxDate, "", "change");
        }
    } else if (status === "new") {
        // There was a new click on the map. Plot new data!
        var features = map.queryRenderedFeatures(e.point, { layers: ['gauges'] });

        if (features.length > 0) {
            // Show tide gauge:
            selectTideGauge(features[0]);
        } else {
            if (difference_plotted === true) {
                alert('Your plotting mode is set to difference Altimetry and Tide Gauge data. Please select a tide gauge or switch your plotting mode.');
            } else {
                // Show altimetry:
                selectAltimetry(e);
            }
        }
    }
}

function switchMapLayer(this_id) {
    "use strict";
    var fine_id = this_id + '-fine',
        coarse_id = this_id + '-coarse',
        visibility_fine = map.getLayoutProperty(fine_id, 'visibility'),
        evnt = { "lngLat": { "lng": LNG, "lat": LAT } };

    disableAllLayers();

    if (visibility_fine === 'visible') {
        // If the selected map was the one that had been visible, mark it as
        // invisible and do not show any colormaps.
        document.getElementById(this_id).className = '';
        map.setLayoutProperty(fine_id, 'visibility', 'none');
        map.setLayoutProperty(coarse_id, 'visibility', 'none');
        hideColorbars();
    } else {
        // If the selected map was not visible, mark it as visible and show it.
        document.getElementById(this_id).className = 'data-active';
        map.setLayoutProperty(fine_id, 'visibility', 'visible');
        map.setLayoutProperty(coarse_id, 'visibility', 'visible');
        showColorbar(this_id);
    }
}

function addLayer(name, id) {
    "use strict";
    var link, li, layers;

    link = document.createElement('a');
    link.href = '#';
    if (name === 'RMS') {
        link.className = 'data-active';
        document.getElementById(activeColormap + '-colorbar').style.display = 'inline-block';
        document.getElementById('map-cbar-container').style.display = 'block';
    } else {
        link.className = '';
    }
    link.id = id;
    link.textContent = name;

    link.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        switchMapLayer(this.id);
    };

    li = document.createElement('li');
    li.appendChild(link);
    layers = document.getElementById('map-style-menu');
    layers.appendChild(li);
}

function addTrendAnnualRMSmap() {
    "use strict";

    // Fine and Coarse Resolution Grids:
    map.addSource('alti-fine', {
        type: 'vector',
        url: 'mapbox://croteaumj.7wszv78f'
    });

    map.addSource('alti-coarse', {
        type: 'vector',
        url: 'mapbox://croteaumj.divhcoxq'
    });

    // Trend Layers
    map.addLayer({
        'id': 'alti-trend-fine',
        'source': 'alti-fine',
        'source-layer': 'jpl_altimetry_grid_1geojson',
        'minzoom': zoomThreshold,
        'type': 'fill',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': {
                property: 't',
                stops: default_stops
            },
            'fill-opacity': 1.0
        }
    }, 'Land-Mask');

    map.addLayer({
        'id': 'alti-trend-coarse',
        'source': 'alti-coarse',
        'source-layer': 'jpl_altimetry_grid_3geojson',
        'maxzoom': zoomThreshold,
        'type': 'fill',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': {
                property: 't',
                stops: default_stops
            },
            'fill-opacity': 1.0
        }
    }, 'Land-Mask');

    // Annual Layers
    map.addLayer({
        'id': 'alti-annual-fine',
        'source': 'alti-fine',
        'source-layer': 'jpl_altimetry_grid_1geojson',
        'minzoom': zoomThreshold,
        'type': 'fill',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': {
                property: 'a',
                stops: default_stops
            },
            'fill-opacity': 1.0
        }
    }, 'Land-Mask');

    map.addLayer({
        'id': 'alti-annual-coarse',
        'source': 'alti-coarse',
        'source-layer': 'jpl_altimetry_grid_3geojson',
        'maxzoom': zoomThreshold,
        'type': 'fill',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': {
                property: 'a',
                stops: default_stops
            },
            'fill-opacity': 1.0
        }
    }, 'Land-Mask');

    // RMS Layers
    map.addLayer({
        'id': 'alti-rms-fine',
        'source': 'alti-fine',
        'source-layer': 'jpl_altimetry_grid_1geojson',
        'minzoom': zoomThreshold,
        'type': 'fill',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'fill-color': {
                property: 'r',
                stops: default_stops
            },
            'fill-opacity': 1.0
        }
    }, 'Land-Mask');

    map.addLayer({
        'id': 'alti-rms-coarse',
        'source': 'alti-coarse',
        'source-layer': 'jpl_altimetry_grid_3geojson',
        'maxzoom': zoomThreshold,
        'type': 'fill',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'fill-color': {
                property: 'r',
                stops: default_stops
            },
            'fill-opacity': 1.0
        }
    }, 'Land-Mask');

    // Add layers
    addLayer('RMS',    'alti-rms');
    addLayer('Trend',  'alti-trend');
    addLayer('Annual', 'alti-annual');
}

function increaseMapYear(){
	var currentYear = document.getElementById('year-selected').innerHTML
	document.getElementById('year-select-lower').style.color = '#E0E0E0'
	document.getElementById('year-select-higher').style.color = '#E0E0E0'

	if (currentYear<2100){
		document.getElementById('year-selected').innerHTML = Number(currentYear) + 25;
		updateMapYear(Number(currentYear) + 25)
		if (Number(currentYear) + 25 >= 2100){
			document.getElementById('year-select-higher').style.color = '#000000'
		}
	}
}

function decreaseMapYear(){
	var currentYear = document.getElementById('year-selected').innerHTML
	if (currentYear>2025){
		document.getElementById('year-selected').innerHTML = Number(currentYear) - 25;
		updateMapYear(Number(currentYear) - 25)

		document.getElementById('year-select-lower').style.color = '#E0E0E0'
		document.getElementById('year-select-higher').style.color = '#E0E0E0'

		if (Number(currentYear) - 25 <= 2025){
			document.getElementById('year-select-lower').style.color = '#000000'
		}
	}
}


function updateMapYear(year){
    map.base_layers = $.extend(true, {}, map.style._layers)
    for (layers in map.base_layers){
        if (layers!=='background' && layers!=='water'){
            map.setLayoutProperty(layers, 'visibility', 'none')}
    }
    var layerOneDict = {2025:"oneDeg2025", 2050:"oneDeg2050",2075:"oneDeg2075", 2100:"oneDeg2100"}
    var layerTWoDict = {2025:"twoDeg2025", 2050:"twoDeg2050",2075:"twoDeg2075", 2100:"twoDeg2100"}


    map.setLayoutProperty(layerOneDict[year], 'visibility', 'visible')
    map.setLayoutProperty(layerTWoDict[year], 'visibility', 'visible')
}

// Add sources for both grids
function initializeTiles(){
    map.addSource("twoDegreeData", {
        "type":"geojson",
        "data": twoDegGrid
            });

    map.addSource("oneDegreeData", {
            "type": "geojson",
            "data": oneDegGrid
                });

	map.addSource("coastLine", {
            "type": "geojson",
            "data": oneDegGrid
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
            }, 'water');

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
            }, 'water');

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
                }, 'water');

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
                }, 'water');

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
                    }, 'water');

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
                    }, 'water');

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
                        }, 'water');

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
                        }, 'water');

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
            style: 'mapbox://styles/jlarson630/ciyg1s0l9000p2spg93h1qdyv',
			//style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-88.137, 35.13],
            zoom: 1,
            maxZoom: 5,
            minZoom: 1.0
        })};
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-left')
        map.on('click', function (e) { queryTimeseries(e, constructQueryArray());});

}
