// getLatLonJSONfilename :: given a lat/lon pair, returns time series file name.
function getLatLonJSONfilename(lng, lat) {
    "use strict";
    // var signLng = 1, signLat = 1,
    var lngSym = 'E', latSym = 'N',
        decimLng, wholeLng, decimLat, wholeLat, jsonLon, jsonLat, filename;

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
    if (decimLng >= 0 && decimLng < 0.166667) {
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
    if (decimLat >= 0 && decimLat < 0.166667) {
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
    filename = 'JSON/'.concat(jsonLat, '/', jsonLon, '.json');
    return filename;
}

// setPopupAndCenter :: When a new plot is requested, reset the Map Popup.
function setPopupAndCenter(e) {
    "use strict";
    var popupText;

    if (marker) {
        marker.remove();
    }

    popupText = 'Lat: ' + e.lngLat.lat.toFixed(3) +
        '<br>Lon: ' + e.lngLat.lng.toFixed(3);

    marker = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupText)
        .addTo(map);

    if (map.getZoom() < 4) {
        map.jumpTo({ "center": e.lngLat, "zoom": 4 });
    } else {
        map.jumpTo({ "center": e.lngLat });
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

// selectAltimetry :: get page click and grabs time series.
function selectAltimetry(e, status) {
    "use strict";
    var request;

    if (status === 'new') {
        minDate = time.time_yrs[0];
        maxDate = time.time_yrs[time.time_yrs.length - 1];
    }

    if (e.lngLat.lng > 180 && e.lngLat.lng <= 360) { e.lngLat.lng = e.lngLat.lng - 360; }
    if (e.lngLat.lng < -180) { e.lngLat.lng = e.lngLat.lng + 360; }

    LAT = e.lngLat.lat; // store Latitude for quick reference.
    LNG = e.lngLat.lng; // store Longitude for quick reference.

    // Define filename to get:
    jsonFilename = getLatLonJSONfilename(e.lngLat.lng, e.lngLat.lat);

    jsonFilename = '/altimetry/' + jsonFilename;

    // Get file:
    request = new XMLHttpRequest();
    request.open('GET', jsonFilename, true);
    request.onload = function () {
        var data, scrollPopup;
        if (request.status >= 200 && request.status < 400) {
            // Success!
            data = JSON.parse(request.responseText);

            displayDataSeries(data, minDate, maxDate);
            displayDataNavbar(data);
            setPopupAndCenter(e);

            // Show loaded successfully popup:
            scrollPopup = document.getElementById('scroll-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.transition = "opacity 1s";
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                setTimeout(function () {
                    scrollPopup.style.zIndex = 0;
                    scrollPopup.style.opacity = 1;
                }, 1100);
            }, 3000);

        } else {
            // We reached our target server, but it returned an error
            // alert("That location is unavailable. Either it is not in the dataset (such as if it is over land) or there has been an error.");
            // Show loaded successfully popup:
            scrollPopup = document.getElementById('error-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.transition = "opacity 1s";
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                setTimeout(function () {
                    scrollPopup.style.zIndex = 0;
                    scrollPopup.style.opacity = 1;
                }, 1100);
            }, 3000);
        }
    };
    request.onerror = function () {
      // There was a connection error of some sort
    };
    request.send();
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

    if (plotDrawn === 1) {
        selectAltimetry(evnt);
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
        url: 'mapbox://croteaumj.4wyb8e83'
    });

    map.addSource('alti-coarse', {
        type: 'vector',
        url: 'mapbox://croteaumj.6jcx7bwv'
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
            container: 'map',
            style: 'mapbox://styles/croteaumj/cirqkdgcn0000vnnm5nf5yxj6',
            center: [0, 20],
            zoom: 1.0,
            maxZoom: 7,
            minZoom: 1.0
        });

        map.on('style.load', function () {
            addTrendAnnualRMSmap();
            document.getElementById('scroll-popup').style.opacity = 1;
            document.getElementById('error-popup').style.opacity = 1;
        });

        map.addControl(new mapboxgl.Navigation());

        // Listener: right-click handling:
        map.on('click', function (e) { selectAltimetry(e, 'new'); });

    } // End IF/ELSE mapboxgl supported.
}
