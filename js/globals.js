// Initialize global variables:
var map,
    time,
    marker,
    jsonFilename,
    LAT,
    LNG,
    default_stops,
    xScale,
    minDate,
    maxDate,
    activeMap = 'rms',
    plotDrawn = 0,
    zoomThreshold = 4,
    plot_num = 0,
    svg_id = "",
    WIDTH = 800,  // Width of main plot
    HEIGHT = 360, // Height of main plot area
    MARGINS = { top: 20, right: 20, bottom: 20, left: 100 }, // Margins in plots
    navWIDTH = WIDTH,   // Width of navigation bar
    navbarHEIGHT = 100, // Height of entire navigation bar window
    navHEIGHT = navbarHEIGHT - MARGINS.top - MARGINS.bottom; // Height of navigation bar plot;
