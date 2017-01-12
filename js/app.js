function onPlottingFormChange() {
    "use strict";
    var boxWidth = document.getElementById("smooth-width").value;
    boxWidth = (!isNumber(boxWidth) ? 0 : boxWidth);
    document.getElementById("smooth-width").value = boxWidth;

    if (plot_num > 0) {
        if (boxWidth >= 0) {
            selectPlotting({ "lngLat": { "lng": LNG, "lat": LAT } }, 'change');
        }
    }
}

// Scale certain divs on mobile:
function scaleMapMobile() {
    "use strict";
    var i, labels, nums;
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
    selectPlotting(event, 'new');
}

// Move plots by dragging title bar
function mouseUpDragging() {
    "use strict";
    window.removeEventListener('mousemove', divMoveDragging, true);
}

function mouseDownDragging(e) {
    "use strict";
    var div = document.getElementById('chart-container');
    x_pos = e.clientX - div.offsetLeft;
    y_pos = e.clientY - div.offsetTop;
    window.addEventListener('mousemove', divMoveDragging, true);
}

function divMoveDragging(e) {
    "use strict";
    var div = document.getElementById('chart-container');
    div.style.top = (e.clientY - y_pos) + 'px';
    div.style.left = (e.clientX - x_pos) + 'px';
}

// Resize plots by dragging triangle corner
function mouseUpResize() {
    "use strict";
    window.removeEventListener('mousemove', divMoveResize, true);
}

function mouseDownResize(e) {
    "use strict";
    var container = document.getElementById('chart-container'),
        chart = document.getElementById('timeseries');
    window.addEventListener('mousemove', divMoveResize, true);
}

function divMoveResize(e) {
    "use strict";
    var container = document.getElementById('chart-container'),
        chart = document.getElementById('timeseries');
    x_size = e.clientX - chart.offsetLeft - container.offsetLeft;
    y_size = 0.725 * x_size;
    y_nav = y_size * 80 / 600;
    chart.style.width = x_size + 'px';
    container.style.width = (125 + x_size) + 'px';
    document.getElementById('data-timeseries').style.height = (x_size/2) + 'px';
    document.getElementById('data-navbar').style.height = y_nav + 'px';
    chart.style.height = (x_size/2 + y_nav + 65) + 'px';
}

function getWidth() {
    "use strict";
    if (self.innerWidth) {
        return self.innerWidth;
    }
    if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
    }
    if (document.body) {
        return document.body.clientWidth;
    }
}

function getHeight() {
    "use strict";
    if (self.innerHeight) {
        return self.innerHeight;
    }
    if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
    }
    if (document.body) {
        return document.body.clientHeight;
    }
}

function minimizePlot() {
    "use strict";
    var pageWidth  = getWidth(),
        pageHeight = getHeight();

    chart_container_maximize_width = document.getElementById('chart-container').offsetWidth;
    chart_container_maximize_height = document.getElementById('chart-container').offsetHeight;
    chart_container_maximize_left = document.getElementById('chart-container').offsetLeft;
    chart_container_maximize_top = document.getElementById('chart-container').offsetTop;
    timeseries_maximize_width = document.getElementById('timeseries').offsetWidth;
    timeseries_maximize_height = document.getElementById('timeseries').offsetHeight;

    document.getElementById('maximize-plot').style.display = 'block';
    document.getElementById('minimize-plot').style.display = 'none';
    document.getElementById('chart-topbar').style.display = 'none';
    document.getElementById('chart-options').style.display = 'none';
    document.getElementById('resize-triangle').style.display = 'none';
    document.getElementById('LS-params').style.display = 'none';
    document.getElementById('data-navbar').style.display = 'none';
    document.getElementById('chart-container').style.top = (pageHeight - 170) + 'px';
    document.getElementById('chart-container').style.left = (pageWidth - 120) + 'px';
    document.getElementById('chart-container').style.width = '105px';
    document.getElementById('timeseries').style.width = '100px';
    document.getElementById('timeseries').style.height = '50px';
}

function maximizePlot() {
    "use strict";
    document.getElementById('chart-container').style.display = 'inline-block';
    document.getElementById('maximize-plot').style.display = 'none';
    document.getElementById('minimize-plot').style.display = 'block';
    document.getElementById('chart-topbar').style.display = 'block';
    document.getElementById('chart-options').style.display = 'inline-block';
    document.getElementById('resize-triangle').style.display = 'block';
    document.getElementById('LS-params').style.display = 'block';
    document.getElementById('data-navbar').style.display = 'block';
    document.getElementById('chart-container').style.left = chart_container_maximize_left + 'px';
    document.getElementById('chart-container').style.top = chart_container_maximize_top + 'px';
    document.getElementById('chart-container').style.width = chart_container_maximize_width + 'px';
    document.getElementById('timeseries').style.width = timeseries_maximize_width + 'px';
    document.getElementById('timeseries').style.height = timeseries_maximize_height + 'px';
}

// loadApp :: Start app
function loadApp() {
    "use strict";
    var i, radios = document.forms.PlotOptionsForm,
        radios_detrend = radios.elements["draw-detrend"],
        radios_deseason = radios.elements["draw-deseason"],
        radios_showtrend = radios.elements["draw-trend"];

    scaleMapMobile();
    window.addEventListener("resize", function () { scaleMapMobile(); scaleTimeseriesMobile(); });

    // Load Time JSON file:
    getTimeSeries();

    // Initialize map:
    initializeMap();

    // Listener: search button
    document.getElementById("map-search-button").addEventListener("click", function (e) {
        if (document.getElementById("map-click").style.display == 'none') {
            document.getElementById("map-click").style.display = 'inline-block';
        } else {
            document.getElementById("map-click").style.display = 'none';
        }
    });

    document.getElementById("map-click-exit").addEventListener("click", function (e) {
        document.getElementById("map-click").style.display = 'none';
    });

    // Listener: Map Location Form:
    document.getElementById("GetTimeseries").addEventListener("submit", function (e) {inputLatLon(e); });

    // Toggle tide gauges:
    document.getElementById('show-tide-gauges-button').addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (document.getElementById('show-tide-gauges-button').className === 'button-inactive') {
            document.getElementById('show-tide-gauges-button').className = 'button-active';
            document.getElementById('show-tide-gauges-button').textContent = "Remove Tide Gauges";
            addTideGauges();
        } else {
            document.getElementById('show-tide-gauges-button').className = 'button-inactive';
            document.getElementById('show-tide-gauges-button').textContent = "Show Tide Gauges";
            removeTideGauges();
        }
    });

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

    // Plot minimize/maximize listeners:
    document.getElementById("minimize-plot-img").addEventListener("click", function (e) {
        minimizePlot();
    });

    document.getElementById("maximize-plot-img").addEventListener("click", function (e) {
        maximizePlot();
    });

    // Plot movement listeners
    document.getElementById('chart-topbar').addEventListener('mousedown', mouseDownDragging, false);
    window.addEventListener('mouseup', mouseUpDragging, false);

    document.getElementById('resize-triangle').addEventListener('mousedown', mouseDownResize, false);
    window.addEventListener('mouseup', mouseUpResize, false);

}

// Wait until all content is loaded to do anything:
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    loadApp();
}, false);
