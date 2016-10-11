// Initialize global variables:
var map,
    time,
    marker,
    gauge_marker,
    jsonFilename,
    tideGaugeCode,
    LAT,
    LNG,
    default_stops,
    xScale,
    minDate,
    maxDate,
    activeMap = 'rms',
    altimetry_plotted = false,
    tidegauge_plotted = false,
    data_tidegauge,
    data_altimetry,
    plotDrawn = 0,
    zoomThreshold = 4,
    plot_num = 0,
    svg_id = "",
    WIDTH = 800,  // Width of main plot
    HEIGHT = 350, // Height of main plot area
    MARGINS = { top: 40, right: 20, bottom: 10, left: 100 }, // Margins in plots
    navWIDTH = WIDTH,   // Width of navigation bar
    navbarHEIGHT = 100, // Height of entire navigation bar window
    navHEIGHT = navbarHEIGHT - MARGINS.top - MARGINS.bottom; // Height of navigation bar plot;
