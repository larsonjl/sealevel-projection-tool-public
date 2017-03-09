function onPlottingFormChange() {
    "use strict";
    var boxWidth = document.getElementById("smooth-width"),
        boxWidthValue = boxWidth.value;
    boxWidthValue = (isNumber(boxWidthValue) ? boxWidthValue : 0);
    boxWidth.value = boxWidthValue;

    if (plot_num > 0 && boxWidthValue >= 0) {
        selectPlotting({"lngLat":{"lng":LNG,"lat":LAT}}, 'change');
    }
}

// getTimeSeries :: retrieves timeseries data for the location and initializes plots.
function getTimeSeries() {
    "use strict";
    // Get file:
    var req = new XMLHttpRequest();
    //req.open('GET', 'v2/JSON/time.json', true);
    req.open('GET', 'api/v2/altimetry/time.json', true);
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
    window.removeEventListener('mousemove', divMoveDragging, false);
}

function mouseDownDragging(e) {
    "use strict";
    var div = document.getElementById('chart-container');
    x_pos = e.clientX - div.offsetLeft;
    y_pos = e.clientY - div.offsetTop;
    window.addEventListener('mousemove', divMoveDragging, false);
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
    window.removeEventListener('mousemove', divMoveResize, false);
}

function mouseDownResize(e) {
    "use strict";
    var container = document.getElementById('chart-container'),
        chart = document.getElementById('timeseries');
    window.addEventListener('mousemove', divMoveResize, false);
}

function divMoveResize(e) {
    "use strict";
    var container = document.getElementById('chart-container'),
        chart = document.getElementById('timeseries');
    x_size = e.clientX - chart.offsetLeft - container.offsetLeft;
    y_size = 0.725 * x_size;
    y_nav = y_size * 80 / 600;
    chart.style.width = x_size + 'px';
    container.style.width = (x_size) + 'px';
    document.getElementById('data-timeseries').style.height = (x_size/2) + 'px';
    // document.getElementById('data-navbar').style.height = y_nav + 'px';
    chart.style.height = (x_size/2 + 10) + 'px';
}

function getWidth() {
    "use strict";
    // Multiple methods for maximum browser compatibility:
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
    // Multiple methods for maximum browser compatibility:
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

    // Store container dimensions for when maximized again:
    chart_container_maximize_width = document.getElementById('chart-container').offsetWidth;
    chart_container_maximize_height = document.getElementById('chart-container').offsetHeight;
    chart_container_maximize_left = document.getElementById('chart-container').offsetLeft;
    chart_container_maximize_top = document.getElementById('chart-container').offsetTop;
    timeseries_maximize_width = document.getElementById('timeseries').offsetWidth;
    timeseries_maximize_height = document.getElementById('timeseries').offsetHeight;

    // Minimize plot and hide unnecessary parts:
    document.getElementById('maximize-plot').style.display = 'block';
    document.getElementById('minimize-plot').style.display = 'none';
    document.getElementById('chart-topbar').style.display = 'none';
    // document.getElementById('chart-options').style.display = 'none';
    document.getElementById('resize-triangle').style.display = 'none';
    // document.getElementById('SL-params').style.display = 'none';
    // document.getElementById('data-navbar').style.display = 'none';
    document.getElementById('chart-container').style.top = (pageHeight - 125) + 'px';
    document.getElementById('chart-container').style.left = '10px';
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
    // document.getElementById('chart-options').style.display = 'inline-block';
    document.getElementById('resize-triangle').style.display = 'block';
    // document.getElementById('SL-params').style.display = 'block';
    // document.getElementById('data-navbar').style.display = 'block';
    document.getElementById('chart-container').style.left = chart_container_maximize_left + 'px';
    document.getElementById('chart-container').style.top = chart_container_maximize_top + 'px';
    document.getElementById('chart-container').style.width = chart_container_maximize_width + 'px';
    document.getElementById('timeseries').style.width = timeseries_maximize_width + 'px';
    document.getElementById('timeseries').style.height = timeseries_maximize_height + 'px';
}

function viewSidebar() {
    "use strict";
    if (sidebar_collapsed === false) {
        document.getElementById("sidebar-contents").style.display = 'none';
        document.getElementById("map-data-source").style.display = 'none';
        document.getElementById("sidebar").style.width = '34px';
        document.getElementById("map-cbar-container").style.right = "38px";
		document.getElementById("year-select-container").style.right = "38px";
        sidebar_collapsed = true;
    } else {
        document.getElementById("sidebar-contents").style.display = 'block';
        document.getElementById("map-data-source").style.display = 'block';
        document.getElementById("sidebar").style.width = '270px';
        document.getElementById("map-cbar-container").style.right = "274px";
		document.getElementById("year-select-container").style.right = "274px";

        sidebar_collapsed = false;
    }
}

function viewHelp() {
    "use strict";
    alert("This feature is in development and will be available soon.")
}

function viewLocationLookup() {
    "use strict";
    var sidebar_area = document.getElementById("map-search");
    if (sidebar_area.style.display !== 'block') {
        sidebar_area.style.display = 'block';
        document.getElementById("sidebar-location-lookup-active").style.display = 'block';
        document.getElementById("sidebar-location-lookup-hidden").style.display = 'none';
    } else {
        sidebar_area.style.display = 'none';
        document.getElementById("sidebar-location-lookup-active").style.display = 'none';
        document.getElementById("sidebar-location-lookup-hidden").style.display = 'block';
    }
}

function viewBasicSettings() {
    "use strict";
    var sidebar_area = document.getElementById("sidebar-basic");
    if (sidebar_area.style.display !== 'block') {
        sidebar_area.style.display = 'block';
        document.getElementById("sidebar-basic-settings-active").style.display = 'block';
        document.getElementById("sidebar-basic-settings-hidden").style.display = 'none';
    } else {
        sidebar_area.style.display = 'none';
        document.getElementById("sidebar-basic-settings-active").style.display = 'none';
        document.getElementById("sidebar-basic-settings-hidden").style.display = 'block';
    }
}

function viewMapSettings() {
    "use strict";
    var sidebar_area = document.getElementById("sidebar-map");
    if (sidebar_area.style.display === 'none') {
        sidebar_area.style.display = 'block';
        document.getElementById("sidebar-map-settings-active").style.display = 'block';
        document.getElementById("sidebar-map-settings-hidden").style.display = 'none';
    } else {
        sidebar_area.style.display = 'none';
        document.getElementById("sidebar-map-settings-active").style.display = 'none';
        document.getElementById("sidebar-map-settings-hidden").style.display = 'block';
    }
}

function viewPlotSettings() {
    "use strict";
    var sidebar_area = document.getElementById("sidebar-plot");
    if (sidebar_area.style.display === 'none') {
        sidebar_area.style.display = 'block';
        document.getElementById("sidebar-plot-settings-active").style.display = 'block';
        document.getElementById("sidebar-plot-settings-hidden").style.display = 'none';
        document.getElementById("sidebar-contents").style.background = '#FFFFFF';
        document.getElementById("sidebar-plot-settings").style.borderWidth = '1px 0 0';
    } else {
        sidebar_area.style.display = 'none';
        document.getElementById("sidebar-plot-settings-active").style.display = 'none';
        document.getElementById("sidebar-plot-settings-hidden").style.display = 'block';
        document.getElementById("sidebar-contents").style.background = '#FAFAFA';
        document.getElementById("sidebar-plot-settings").style.borderWidth = '1px 0';
    }
}

function setActiveColormap() {
    "use strict";
    var min, max = Number(document.getElementById('cbar-max-set').textContent);
    activeColormap = document.getElementById("sidebar-select-colormap").value;
    updateColorbarMap(Number(document.getElementById("colorbar-max-bounds").value));
}

function setPlottingMode(mode) {
    "use strict";
    if (mode === 'compare') {
        difference_plotted = false;
        if (tidegauge_plotted === true) {
            selectPlotting({"lngLat":{"lng":LNG,"lat":LAT}}, 'change');
        }
    } else {
        difference_plotted = true;
        if (tidegauge_plotted === true) {
            selectPlotting({"lngLat":{"lng":LNG,"lat":LAT}}, 'change');
        }
    }
}

// loadApp :: Start app
function loadApp() {
    "use strict";

    // Load Time JSON file:

    // Initialize map:
    initializeMap();

    // Construct geojson files
    makeOneDegGrid();
    makeTwoDegGrid();

    // Listener: Sidebar Menu
    document.getElementById("sidebar-menu-button").addEventListener("click", viewSidebar, false);
    document.getElementById("sidebar-help-button").addEventListener("click", viewHelp, false);
    document.getElementById("sidebar-location-lookup").addEventListener("click", viewLocationLookup, false);
	document.getElementById("sidebar-basic-settings").addEventListener("click", viewBasicSettings, false);

    // document.getElementById("sidebar-map-settings").addEventListener("click", viewMapSettings, false);
    // document.getElementById("sidebar-plot-settings").addEventListener("click", viewPlotSettings, false);

    // document.getElementById("sidebar-select-colormap").addEventListener("change", setActiveColormap, false);

    // Listener: Map Location Form:
    // document.getElementById("GetTimeseries").addEventListener("submit", function (e) {inputLatLon(e); });

    // Listeners: Detrend, Deseason, Show Trend, Boxcar:
    map.on('load', initializeTiles);
    // document.getElementById("set-smooth-width").addEventListener("click", onPlottingFormChange, false);
    map.on('load', loadCustomLayers);

    // Plot minimize/maximize listeners:
    document.getElementById("minimize-plot-img").addEventListener("click", minimizePlot, false);
    document.getElementById("maximize-plot-img").addEventListener("click", maximizePlot, false);

    // Plot movement listeners
    document.getElementById('chart-topbar').addEventListener('mousedown', mouseDownDragging, false);
    window.addEventListener('mouseup', mouseUpDragging, false);

    document.getElementById('resize-triangle').addEventListener('mousedown', mouseDownResize, false);

	// document.getElementById('year-select-lower').addEventListener('click', decreaseMapYear, false);
	// document.getElementById('year-select-higher').addEventListener('click',  increaseMapYear, false);

    window.addEventListener('mouseup', mouseUpResize, false);

	// Create default map
	map.on('load', loadDefaultMap);
}

// Wait until all content is loaded to do anything:
document.addEventListener('DOMContentLoaded', loadApp, false);
