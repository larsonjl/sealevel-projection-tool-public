// On 'make projection' click, query data and display
$('#runProject').click(function(){
	defaultMap = 'false';
	switch (displayMode){
		case 'absolute':
			loadMap('custom', 'true');
			break;
		case 'relative':
			loadRelSL('true');
			if (currentVCM!==0){
				queryCoastLoc(currentLocation, currentVCM, currentLatLon);
			}
			break;
	}
});

// On 'make basic projection' click, query data and display
$('#runBasicProject').click(function(){
	defaultMap = 'true';
	switch (displayMode){
		case 'absolute':
			loadMap('basic', 'true');
			break;
		case 'relative':

			break;
	}
	updateMapYear();
});

// On mode switch, query data and display
$(document).ready(function() {
    $('input[type=radio][name=sl-opt]').change(function() {
		removeAllVisibility();
		switch(this.value){
			case 'rel':
				displayMode = 'relative';
				loadRelSL('false');
				restoreOptionMenu();
				var vcmDataOn = document.getElementById('vcmMenu');
				vcmDataOn['options'][1].selected = true;
				document.getElementById('chart-container').style.display = 'none';
				currentVCM = 0;
				currentLocation = 0;
				currentLatLon = 0;
				break;
			case 'abs':
				displayMode = 'absolute';
				loadMap('true', 'false');
				restoreOptionMenu();
				var vcmDataOn = document.getElementById('vcmMenu');
				vcmDataOn['options'][0].selected = true;
				break;
			case 'crust':
				displayMode = 'crust'
				loadCrustLandLayer();
				removeOptionMenu();
				var vcmDataOn = document.getElementById('vcmMenu');
				vcmDataOn['options'][1].selected = true;
				document.getElementById('chart-container').style.display = 'none';
				currentVCM = 0;
				currentLocation = 0;
				currentLatLon = 0;
				break;
			}
    });
});

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
    document.getElementById('resize-triangle').style.display = 'none';
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
    document.getElementById('resize-triangle').style.display = 'block';
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

function viewCustomSettings() {
    "use strict";
    var sidebar_area = document.getElementById("map-search");
    if (sidebar_area.style.display !== 'block') {
        sidebar_area.style.display = 'block';
        document.getElementById("sidebar-custom-settings-active").style.display = 'block';
        document.getElementById("sidebar-custom-settings-hidden").style.display = 'none';
    } else {
        sidebar_area.style.display = 'none';
        document.getElementById("sidebar-custom-settings-active").style.display = 'none';
        document.getElementById("sidebar-custom-settings-hidden").style.display = 'block';
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

function addLoadMenu(){
	"use strict";
	document.getElementById("load-menu").style.visibility = 'visible'
	document.getElementById("map-div").style.visibility = 'hidden'
}

function removeLoadMenu(){
	"use strict";
	document.getElementById("load-menu").style.visibility = 'hidden'
	document.getElementById("map-div").style.visibility = 'visible'
}

// loadApp :: Start app
function loadApp() {
    "use strict";
    // Initialize map:
    initializeMap();
    // Construct geojson files
    makeOneDegGrid();
    makeTwoDegGrid();
    // Listener: Whole sidebar menu slide out, slide in
    document.getElementById("sidebar-menu-button").addEventListener("click", viewSidebar, false);
    document.getElementById("sidebar-help-button").addEventListener("click", viewHelp, false);
	//Listener: Sidebar sections collapse
    document.getElementById("sidebar-custom-settings").addEventListener("click", viewCustomSettings, false);
	document.getElementById("sidebar-basic-settings").addEventListener("click", viewBasicSettings, true);
	// Open basic settings in sidebar on menu on load
	viewBasicSettings();
	// Add sources
    map.on('load', initializeTiles);
    map.on('load', loadGridLayers);
    // Plot minimize/maximize listeners:
    document.getElementById("minimize-plot-img").addEventListener("click", minimizePlot, false);
    document.getElementById("maximize-plot-img").addEventListener("click", maximizePlot, false);
    // Plot movement listeners
    document.getElementById('chart-topbar').addEventListener('mousedown', mouseDownDragging, false);
    window.addEventListener('mouseup', mouseUpDragging, false);
    document.getElementById('resize-triangle').addEventListener('mousedown', mouseDownResize, false);
    window.addEventListener('mouseup', mouseUpResize, false);
	// Load in options for advanced projection
	$(document).ready(setSidebarOptions);
	// Create default map
	map.on('load', loadMap);
}

// Wait until all content is loaded to do anything:
document.addEventListener('DOMContentLoaded', loadApp, false);
