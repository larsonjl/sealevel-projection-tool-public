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
    filename = 'v2/JSON/'.concat(jsonLat, '/', jsonLon, '.json');
    return filename;
}

// setPopupAndCenter :: When a new plot is requested, reset the Map Popup.
function setPopupAndCenter(e) {
    "use strict";
    var popupText, jsonAltimetryLocation, jsonLat, jsonLon, latitude, longitude;

    if (marker) {
        marker.remove();
    }

    jsonAltimetryLocation = getLatLonGridLocation(e.lngLat.lng, e.lngLat.lat);
    jsonLat = jsonAltimetryLocation[0];
    jsonLon = jsonAltimetryLocation[1];
    latitude = jsonAltimetryLocation[2];
    longitude = jsonAltimetryLocation[3];

    popupText = "<div class='tide-gauge-popup'><h2 class='center'>Altimetry</h2>" +
        "<span class='bold'>Lat:</span> " + jsonLat + "<br><span class='bold'>Lon:</span> " + jsonLon + "</div>";

    marker = new mapboxgl.Popup({anchor: "top-left"})
        .setLngLat({ lng: longitude, lat: latitude })
        .setHTML(popupText)
        .addTo(map);

    if (gauge_marker) {
        gauge_marker.addTo(map);
    }

    centerMap({ lng: longitude, lat: latitude });
}

function centerMap(lngLat) {
    "use strict";
    if (map.getZoom() < 3) {
        map.jumpTo({ "center": lngLat, "zoom": 3 });
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
    var tideGaugeFile = 'http://ccar.colorado.edu/altimetry/api/v1/tidegauges/JSON/' + tideGaugeCode + '.json';
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

            // displayDataSeries(minDate, maxDate, "tidegauges", "new");
            // displayDataNavbar();

            // Show loaded successfully popup:
            /*scrollPopup = document.getElementById('scroll-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.opacity = 1;
            scrollPopup.style.transition = "opacity 1s";
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                scrollPopup.style.zIndex = 0;
            }, 3000);*/

        } else {
            // We reached our target server, but it returned an error
            // alert("That location is unavailable. Either it is not in the dataset (such as if it is over land) or there has been an error.");
            // Show loaded successfully popup:
            /*scrollPopup = document.getElementById('error-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.transition = "opacity 1s";
            scrollPopup.style.opacity = 1;
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                scrollPopup.style.zIndex = 0;
            }, 3000);*/
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
    gauge_marker = new mapboxgl.Popup({anchor: "bottom-right"})
        .setLngLat({lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1]})
        .setHTML("<div class='tide-gauge-popup'><h2 class='center'>Tide Gauge</h2>" +
            "<div class='center italics'>" + lat_str + ", " + lng_str + "</div>" +
            "<span class='bold'>Site:</span> " + feature.properties.title +
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

    jsonFilename = '/altimetry/' + jsonFilename;

    request = new XMLHttpRequest();
    request.open('GET', jsonFilename, true);
    request.onload = function () {
        var scrollPopup;
        if (request.status >= 200 && request.status < 400) {
            // Success!
            data_altimetry = JSON.parse(request.responseText);

            data_altimetry_header = dataHeaderInfo('altimetry');

            displayDataSeries(minDate, maxDate, "altimetry", "new");
            displayDataNavbar();
            setPopupAndCenter(e);

            // Move center to the right
            lat_range = map.getBounds()._ne.lat - map.getBounds()._sw.lat;
            lon_range = map.getBounds()._ne.lng - map.getBounds()._sw.lng;
            pageWidth = getWidth();
            if (pageWidth > 500) {
                map.jumpTo({ "center": { 'lng': e.lngLat.lng - (0.3*lon_range), 'lat': e.lngLat.lat } });
            } else {
                map.jumpTo({ "center": { 'lng': e.lngLat.lng, 'lat': e.lngLat.lat - (0.25*lat_range) } });
            }

            // Show loaded successfully popup:
            /*
            scrollPopup = document.getElementById('scroll-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.opacity = 1;
            scrollPopup.style.transition = "opacity 1s";
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                scrollPopup.style.zIndex = 0;
            }, 3000);*/

        } else {
            // We reached our target server, but it returned an error
            // alert("That location is unavailable. Either it is not in the dataset (such as if it is over land) or there has been an error.");
            // Show loaded successfully popup:
            /*scrollPopup = document.getElementById('error-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.transition = "opacity 1s";
            scrollPopup.style.opacity = 1;
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                scrollPopup.style.zIndex = 0;
            }, 3000);*/
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
    if (status === "change") {
        displayDataSeries(minDate, maxDate, "", "change");
    } else if (status === "new") {
        // There was a new click on the map. Plot new data!
        var features = map.queryRenderedFeatures(e.point, { layers: ['gauges'] });

        if (features.length > 0) {
            // Show tide gauge:
            selectTideGauge(features[0]);
        } else {
            // Show altimetry:
            selectAltimetry(e);
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
        document.getElementById(this_id).className = '';
        map.setLayoutProperty(fine_id, 'visibility', 'none');
        map.setLayoutProperty(coarse_id, 'visibility', 'none');
        hideColorbars();
    } else {
        document.getElementById(this_id).className = 'data-active';
        map.setLayoutProperty(fine_id, 'visibility', 'visible');
        map.setLayoutProperty(coarse_id, 'visibility', 'visible');
        showColorbar(this_id);
    }
}

function addLayer(name, id) {
    "use strict";
    var link, layers;

    link = document.createElement('a');
    link.href = '#';
    if (name === 'RMS') {
        link.className = 'data-active';
        document.getElementById('rms-colorbar').style.display = 'inline-block';
        document.getElementById('cbar-bounds').style.display = 'inline-block';
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

    layers = document.getElementById('map-style-menu');
    layers.appendChild(link);
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
        'source-layer': 'jpl_altimetry_grid_1_allgeojson',
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
        'source-layer': 'jpl_altimetry_grid_1_allgeojson',
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
        'source-layer': 'jpl_altimetry_grid_1_allgeojson',
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
    addLayer('Trend',  'alti-trend');
    addLayer('Annual', 'alti-annual');
    addLayer('RMS',    'alti-rms');
}

// initializeMap :: loads background and interactive maps and starts page listeners.
function initializeMap() {
    "use strict";
    default_stops = getColorbarStops('rms', 40);

    // Initialize Mapbox Interactive Map:
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3JvdGVhdW1qIiwiYSI6ImNpam44Y215dTAwZDB0aG01emxvNm1pYzAifQ.vKk11AiB-97jJiL9joJAgw';

    if (!mapboxgl.supported()) {
        alert('Your browser does not support Mapbox GL. Please try a different browser, or make sure that you have WebGL enabled on your current browser.');
    } else {
        map = new mapboxgl.Map({
            container: 'map-div',
            style: 'mapbox://styles/croteaumj/cirqkdgcn0000vnnm5nf5yxj6',
            center: [0, 20],
            zoom: 1.0,
            maxZoom: 7,
            minZoom: 1.0
        });

        map.on('style.load', addTrendAnnualRMSmap);

        map.on('style.load', loadTideGauges);

        map.addControl(new mapboxgl.NavigationControl());

        // Listener: right-click handling:
        map.on('click', function (e) { selectPlotting(e, 'new'); });

    } // End IF/ELSE mapboxgl supported.
}
