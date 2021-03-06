// Initialize global variables:
var map,
	coastLayerNames = {2025:"rel2025", 2050:"rel2050",2075:"rel2075", 2100:"rel2100"},
	oneDegGridLayers = {2025:"oneDeg2025", 2050:"oneDeg2050",2075:"oneDeg2075", 2100:"oneDeg2100"},
	twoDegGridLayers = {2025:"twoDeg2025", 2050:"twoDeg2050",2075:"twoDeg2075", 2100:"twoDeg2100"},
	vcmLayerNames = {2025:"vcmLand2025", 2050:"vcmLand2050",2075:"vcmLand2075", 2100:"vcmLand2100"},
	deselectOptions = false,
	absoluteOn = true,
	displayMode = 'absolute',
	freezeOptions = false,
	currentVCM = 0,
	currentLocation = 0,
	currentLatLon = 0,
	rcpScenario,
	apiLoc = 'http://sealevel.colorado.edu/',
	defaultMap = 'true',
	defaultQueryString = 'rcp85_60_gsm1_gdm1_adm1_asm1_thm1_glm1_gia1',
	standardQueryString = '_60_gsm1_gdm1_adm1_asm1_thm1_glm1_gia1',
	queryString = defaultQueryString,
	rcpMenu,
    oneDegGrid,
    twoDegGrid,
    dataMax,
    dataMin,
    time,
    dMax=0,
    dMin=0,
    marker,
    gauge_marker,
    jsonFilename,
    LAT,
    LNG,
    default_stops,
    xScale,
    minDate,
    maxDate,
    activeMap = 'rms',
    activeColormap = 'viridis',
    sidebar_collapsed = false,
    plotDrawn = 0,
    zoomThreshold = 4,
    plot_num = 0,
    svg_id = "",
    WIDTH = 800,  // Width of main plot
    HEIGHT = 350, // Height of main plot area
    MARGINS = { top: 40, right: 20, bottom: 10, left: 60 }, // Margins in plots
    navWIDTH = WIDTH,   // Width of navigation bar
    navbarHEIGHT = 100, // Height of entire navigation bar window
    navHEIGHT = navbarHEIGHT - MARGINS.top - MARGINS.bottom, // Height of navigation bar plot;
    x_pos = 80,
    y_pos = 80,
    y_size = 600,
    x_size = 435,
    y_nav = 370,
    chart_container_maximize_width,
    chart_container_maximize_height,
    chart_container_maximize_left,
    chart_container_maximize_top,
    timeseries_maximize_width,
    timeseries_maximize_height;
