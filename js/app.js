function onPlottingFormChange() {
    "use strict";
    var boxWidth = document.getElementById("smooth-width").value;
    boxWidth = (!isNumber(boxWidth) ? 0 : boxWidth);
    document.getElementById("smooth-width").value = boxWidth;

    if (plot_num > 0) {
        if (boxWidth >= 0) {
            selectAltimetry({ "lngLat": { "lng": LNG, "lat": LAT } }, 'change');
        }
    }
}

// Scale certain divs on mobile:
function scaleMapMobile() {
    "use strict";
    var i,
        labels = document.getElementsByClassName('cbar-labels'),
        nums = document.getElementsByClassName('cbar-num');

    // Scale map window:
    if (document.documentElement.clientWidth < 780) {
        document.getElementById('map-click').style.width = 'auto';
        document.getElementById('chart-options').style.width = 'auto';
        document.getElementById('map-and-cbar').style.width = String(document.documentElement.clientWidth - 22) + 'px';
        document.getElementById('menucontentname').style.width = '100%';
        document.getElementById('menucontentname').style.lineHeight = 'normal';
        document.getElementById('menucontenttitle').style.width = '100%';
        document.getElementById('menucontenttitle').style.lineHeight = 'normal';
    } else if (document.documentElement.clientWidth < 1070) {
        document.getElementById('map-click').style.width = '500px';
        document.getElementById('chart-options').style.width = '500px';
        document.getElementById('map-and-cbar').style.width = '760px';
        document.getElementById('menucontentname').style.width = '100%';
        document.getElementById('menucontentname').style.lineHeight = 'normal';
        document.getElementById('menucontenttitle').style.width = '100%';
        document.getElementById('menucontenttitle').style.lineHeight = 'normal';
    } else {
        document.getElementById('map-click').style.width = '230px';
        document.getElementById('chart-options').style.width = '150px';
        document.getElementById('map-and-cbar').style.width = '760px';
        document.getElementById('menucontentname').style.width = 'auto';
        document.getElementById('menucontentname').style.lineHeight = '45px';
        document.getElementById('menucontenttitle').style.width = 'auto';
        document.getElementById('menucontenttitle').style.lineHeight = '45px';
    }

    // Scale colorbar:
    if (document.documentElement.clientWidth < 550) {
        document.getElementById('cbar-trend').style.width = '240px';
        document.getElementById('cbar-annual').style.width = '240px';
        document.getElementById('cbar-rms').style.width = '240px';

        for (i = 0; i < labels.length; i += 1) {
            // var label = labels[i];
            labels[i].style.fontSize = "7pt";
            labels[i].style.width = '264px';
        }

        for (i = 0; i < nums.length; i += 1) {
            // var num = nums[i];
            nums[i].style.fontSize = "7pt";
            nums[i].style.width = '24px';
        }
    } else {
        document.getElementById('cbar-trend').style.width = '480px';
        document.getElementById('cbar-annual').style.width = '480px';
        document.getElementById('cbar-rms').style.width = '480px';

        for (i = 0; i < labels.length; i += 1) {
            // var label = labels[i];
            labels[i].style.fontSize = "10pt";
            labels[i].style.width = '528px';
        }

        for (i = 0; i < nums.length; i += 1) {
            // var num = nums[i];
            nums[i].style.fontSize = "10pt";
            nums[i].style.width = '48px';
        }
    }
}

// getTimeSeries :: retrieves timeseries data for the location and initializes plots.
function getTimeSeries() {
    "use strict";
    // Get file:
    var req = new XMLHttpRequest();
    req.open('GET', '/altimetry/v2/JSON/time.json', true);
    req.onload = function () {
        if (req.status >= 200 && req.status < 400) { // Success!
            time = JSON.parse(req.responseText);
        } else {
            time = 0; /* Reached server, returned error */
            alert("[Error Code 1] We're sorry. It seems that the server had an error loading required files. Please contact us and let us know about your problem.");
        }
    };
    req.onerror = function () {
        time = 0; /* Connection error */
        alert("[Error Code 2] We're sorry. It seems that the server had an error loading required files. Please contact us and let us know about your problem.");
    };
    req.send();
}

// inputLatLon :: gets page form inputs and grabs time series.
function inputLatLon(e) {
    "use strict";
    var lat, lng, event;

    e.preventDefault();

    // Get lat and lng values from input fields
    lat = document.getElementById('click-lat').value;
    lng = document.getElementById('click-lon').value;
    if (lng > 180 && lng <= 360) { lng = lng - 360; }
    if (lng < -180) { lng = lng + 360; }

    // Validate user input as numbers
    lat = (!isNumber(lat) ? 0 : lat);
    lng = (!isNumber(lng) ? 0 : lng);

    // Validate user input as valid lat/lng values
    lat = latRange(lat);
    lng = lngRange(lng);

    // Replace input values
    document.getElementById('click-lat').value = lat;
    document.getElementById('click-lon').value = lng;

    event = { "lngLat": { "lng" : lng, "lat" : lat } };
    selectAltimetry(event, 'new');
}

// Wait until all content is loaded to do anything:
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    var i,
        radios = document.forms.PlotOptionsForm,
        radios_detrend = radios.elements["draw-detrend"],
        radios_deseason = radios.elements["draw-deseason"],
        radios_showtrend = radios.elements["draw-trend"];

    scaleMapMobile();
    window.addEventListener("resize", function () { scaleMapMobile(); scaleTimeseriesMobile(); });

    // Load Time JSON file:
    getTimeSeries();

    // Initialize map:
    initializeMap();

    // Listener: Map Location Form:
    document.getElementById("GetTimeseries").addEventListener("submit", function (e) {inputLatLon(e); });

    // Listeners: Detrend, Deseason, Show Trend, Boxcar:
    for (i = 0; i < radios_detrend.length; i += 1) {
        radios_detrend[i].addEventListener("click", onPlottingFormChange);
    }

    for (i = 0; i < radios_deseason.length; i += 1) {
        radios_deseason[i].addEventListener("click", onPlottingFormChange);
    }

    for (i = 0; i < radios_showtrend.length; i += 1) {
        radios_showtrend[i].addEventListener("click", onPlottingFormChange);
    }

    document.getElementById("set-smooth-width").addEventListener("click", onPlottingFormChange);
});
