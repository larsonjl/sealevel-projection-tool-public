// Sets default plotting colors. Call with index to return specific color.
function plotColors(ind, style) {
    "use strict";
    var main = ["#377eb8", "#d95f02", "#80428a", "#b81417", "#66a61e", "#e6ab02", "#a6761d"],
        light = ["#b0cfe8", "#fec59a", "#d9bade", "#f5a3a5", "#ceefa9", "#fee39a", "#f0d7a8"],
        choice;
    switch (style) {
        case "main":
            choice = main[ind];
            break;
        case "light":
            choice = light[ind];
            break;
        default:
            choice = main[ind];
    }
    return choice;
}

function drawTitle() {
    "use strict"
    var titleText = '', jsonAltimetryLocation, jsonLat, jsonLon;

    if (difference_plotted === true) {
        jsonAltimetryLocation = getLatLonGridLocation(LNG, LAT),
        jsonLat = jsonAltimetryLocation[0],
        jsonLon = jsonAltimetryLocation[1];
        titleText = 'Altimetry (' + jsonLat + ', ' + jsonLon +
            ') minus Tide Gauge (' + tideGaugeName + ')';
    } else {
        if (altimetry_plotted === true) {
            jsonAltimetryLocation = getLatLonGridLocation(LNG, LAT),
            jsonLat = jsonAltimetryLocation[0],
            jsonLon = jsonAltimetryLocation[1];
            titleText += 'Altimetry (' + jsonLat + ', ' + jsonLon + ')';
        }

        if (altimetry_plotted === true && tidegauge_plotted === true) {
            titleText += ' vs. ';
        }

        if (tidegauge_plotted === true) {
            titleText += 'Tide Gauge (' + tideGaugeName + ')';
        }
    }


    d3.select("svg").append("text")
        .attr("x", (WIDTH / 2))
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("text-decoration", "none")
        .text(titleText);
}

// drawLegend :: Add a legend to the plot.
function drawLegend(data_entries, data_colors) {
    "use strict";
    var legend, color,
        legendSpacing = 40,
        l_data = data_colors.length,
        legendEntryWidth = Math.min(200,(WIDTH - MARGINS.left - MARGINS.right)/l_data),
        legendLeftMargin = MARGINS.left;

    color = d3.scale.ordinal()
        .domain(data_entries)
        .range(data_colors);

    legend = d3.select("svg")
        .append("g")
        .selectAll("g")
        .data(color.domain())
        .enter()
        .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                var x = legendLeftMargin + (i * legendEntryWidth);
                var y = legendSpacing;
                return "translate(" + x + "," + y + ")";
            });

    legend.append("text")
        .attr("x", 0)
        .attr("y", 5)
        .style("fill", color)
        .style("font-size", "10pt")
        .text(function(d) { return d; });
}

// checkTrend :: Check if "Show Trend" radio button is active.
function checkTrend() {
    "use strict";
    var drawTrend, radios, i;

    radios = document.getElementsByName('draw-trend');
    for (i = 0; i < radios.length; i += 1) {
        if (radios[i].checked) {
            drawTrend = Number(radios[i].value);
            break;
        }
    }
    return drawTrend;
}

// checkDetrend :: Check if "Detrend" radio button is active.
function checkDetrend() {
    "use strict";
    var drawDetrend, radios, i, showTrendToggle;

    radios = document.getElementsByName('draw-detrend');
    for (i = 0; i < radios.length; i += 1) {
        if (radios[i].checked) {
            drawDetrend = Number(radios[i].value);
            break;
        }
    }

    showTrendToggle = document.getElementById('show-trend-toggle');
    if (drawDetrend === 1) {
        showTrendToggle.style.display = 'none';
    } else {
        showTrendToggle.style.display = 'block';
    }

    return drawDetrend;
}

// checkDeseason :: Check if "Deseason" radio button is active.
function checkDeseason() {
    "use strict";
    var drawDeseason, radios, i;

    radios = document.getElementsByName('draw-deseason');
    for (i = 0; i < radios.length; i += 1) {
        if (radios[i].checked) {
            drawDeseason = Number(radios[i].value);
            break;
        }
    }
    return drawDeseason;
}

function showAltimetryLS() {
    "use strict";
    document.getElementById("LS-altimetry-trend").style.display = 'inline-block';
    document.getElementById("LS-altimetry-annual").style.display = 'inline-block';
    document.getElementById("LS-altimetry-semiann").style.display = 'inline-block';
}

function hideAltimetryLS() {
    "use strict";
    document.getElementById("LS-altimetry-trend").style.display = 'none';
    document.getElementById("LS-altimetry-annual").style.display = 'none';
    document.getElementById("LS-altimetry-semiann").style.display = 'none';
}

function showTideGaugeLS() {
    "use strict";
    document.getElementById("LS-tidegauge-trend").style.display = 'inline-block';
    document.getElementById("LS-tidegauge-annual").style.display = 'inline-block';
    document.getElementById("LS-tidegauge-semiann").style.display = 'inline-block';
}

function hideTideGaugeLS() {
    "use strict";
    document.getElementById("LS-tidegauge-trend").style.display = 'none';
    document.getElementById("LS-tidegauge-annual").style.display = 'none';
    document.getElementById("LS-tidegauge-semiann").style.display = 'none';
}

// setLeastSquaresDisplay :: Display trend & seasonal fits on page.
function setLeastSquaresDisplay(trend, annual, semiann, plot_units, dataset_id) {
    "use strict";
    if (dataset_id === "altimetry") {
        document.getElementById("LS-altimetry-trend").innerHTML = trend.toFixed(2) + ' ' + plot_units + '/yr';
        if (annual >= 9999.0) {
            document.getElementById("LS-altimetry-annual").innerHTML = 'N/A';
            document.getElementById("LS-altimetry-semiann").innerHTML = 'N/A';
        } else {
            document.getElementById("LS-altimetry-annual").innerHTML = annual.toFixed(2) + ' ' + plot_units;
            document.getElementById("LS-altimetry-semiann").innerHTML = semiann.toFixed(2) + ' ' + plot_units;
        }
        showAltimetryLS();
    } else if (dataset_id === "tidegauges") {
        document.getElementById("LS-tidegauge-trend").innerHTML = trend.toFixed(2) + ' ' + plot_units + '/yr';
        if (annual >= 9999.0) {
            document.getElementById("LS-tidegauge-annual").innerHTML = 'N/A';
            document.getElementById("LS-tidegauge-semiann").innerHTML = 'N/A';
        } else {
            document.getElementById("LS-tidegauge-annual").innerHTML = annual.toFixed(2) + ' ' + plot_units;
            document.getElementById("LS-tidegauge-semiann").innerHTML = semiann.toFixed(2) + ' ' + plot_units;
        }
        showTideGaugeLS();
    } else if (dataset_id === "difference") {
        document.getElementById("LS-tidegauge-trend").innerHTML = trend.toFixed(2) + ' ' + plot_units + '/yr';
        if (annual >= 9999.0) {
            document.getElementById("LS-tidegauge-annual").innerHTML = 'N/A';
            document.getElementById("LS-tidegauge-semiann").innerHTML = 'N/A';
        } else {
            document.getElementById("LS-tidegauge-annual").innerHTML = annual.toFixed(2) + ' ' + plot_units;
            document.getElementById("LS-tidegauge-semiann").innerHTML = semiann.toFixed(2) + ' ' + plot_units;
        }
        hideAltimetryLS();
        showTideGaugeLS();
    }
    document.getElementById("LS-params").style.display = 'block';
}

// prepDataForPlotting :: Process data for plotting (trim invalids; LS fit; deseason; smooth; and format).
function prepDataForPlotting(data, plot_units, min_Date, max_Date, dataset_id) {
    "use strict";
    var drawDetrend = checkDetrend(), drawDeseason = checkDeseason(),
        data_sla_trim = [], data_sla_err_trim = [], time_yrs_trim = [],
        time_dys_trim = [], dataMissing = 0, i, x_LS = [], y_LS = [],
        x_LS_plot = [], LSreturn, /* y_star, */ fit_params, y_trend, y_seasons,
        trend, annual, semiann, y_plot, smootherWidth, dt, y_plotting,
        lineData, lineLSdata, sum_y = 0, mean_y, y_demean = [];

    if (dataset_id === "altimetry") {
        for (i = 0; i < time.time_yrs.length; i += 1) {
            if (data.sla[i] > 9999.0) {
                dataMissing += 1;
            } else {
                data_sla_trim.push(data.sla[i]);
                data_sla_err_trim.push(data.sla_err[i]);
                time_yrs_trim.push(time.time_yrs[i]);
                time_dys_trim.push(time.time_dys[i]);
            }
        }
    } else if (dataset_id === "tidegauges") {
        for (i = 0; i < data.time_yrs.length; i += 1) {
            if (data.sl_dt[i] > 9999.0) {
                dataMissing += 1;
            } else {
                data_sla_trim.push(data.sl_dt[i]); // Convert mm to cm
                time_yrs_trim.push(data.time_yrs[i]);
                time_dys_trim.push(data.time_dys[i]);
            }
        }
    }

    // Set up LS data arrays:
    for (i = 0; i < time_yrs_trim.length; i += 1) {
        if ((min_Date === 0 || time_yrs_trim[i] >= min_Date) && (max_Date === 0 || time_yrs_trim[i] <= max_Date)) {
            x_LS.push(time_dys_trim[i]);
            y_LS.push(data_sla_trim[i]);
            x_LS_plot.push(time_yrs_trim[i]);
        }
    }

    if (x_LS.length === 0) {
        return [[],[]];
    }

    // Demean timeseries:
    for (i = 0; i < y_LS.length; i += 1) {
        sum_y += y_LS[i];
    }
    mean_y = sum_y / y_LS.length;
    for (i = 0; i < y_LS.length; i += 1) {
        y_demean.push(y_LS[i] - mean_y);
    }
    y_LS = [];
    y_LS = y_demean;

    // Calculate Best Fit information:
    LSreturn   = leastSquares(x_LS, y_LS);
    // y_star     = LSreturn[0];
    fit_params = LSreturn[1];
    y_trend    = LSreturn[2];
    y_seasons  = LSreturn[3];
    trend      = fit_params[1] * 365.25; // per day -> per yr, m -> cm
    annual     = fit_params[2];          // m -> cm
    semiann    = fit_params[3];          // m -> cm

    // Check if LS estimated seasonal signals:
    if (fit_params[2] === 9999.9999) {
        drawDeseason = 0;
    }

    y_plot = y_LS;
    if (drawDetrend === 1) { y_plot = math.subtract(y_plot, y_trend); }
    if (drawDeseason === 1) { y_plot = math.subtract(y_plot, y_seasons); }

    // Fill out LS Parameters display:
    setLeastSquaresDisplay(trend, annual, semiann, plot_units, dataset_id);

    // Get boxcar smoother width:
    smootherWidth = Number(document.getElementById('smooth-width').value);

    // Get data ready for plotting (Smooth if activated):
    if (smootherWidth > 0) {
        dt = time_dys_trim[1] - time_dys_trim[0];
        if (dataMissing > 0) {
            y_plotting = boxcar(x_LS, y_plot, smootherWidth);
        } else {
            y_plotting = boxcar2(x_LS, y_plot, dt, smootherWidth);
        }
    } else {
        y_plotting = y_plot;
    }

    // Define data in matrices for plotting:
    lineData = [];
    lineLSdata = [];
    for (i = 0; i < x_LS.length; i += 1) {
        lineData.push({x: x_LS_plot[i], y: y_plotting[i]}); // m -> cm
        lineLSdata.push({x: x_LS_plot[i], y: y_trend[i]});  // m -> cm
    }

    return [lineData, lineLSdata];
}

function differenceDataForPlotting(data_al, data_tg, plot_units, min_Date, max_Date) {
    "use strict";
    var i, N_times,
        drawDetrend = checkDetrend(),
        drawDeseason = checkDeseason(),
        dataMissing = 0,
        data_trim = [],
        time_yrs_trim = [],
        time_dys_trim = [],
        x_LS = [],
        y_LS = [],
        x_LS_plot = [],
        sum_y = 0,
        mean_y,
        y_demean = [],
        LSreturn,
        fit_params,
        y_trend,
        y_seasons,
        trend,
        annual,
        semiann,
        y_plot,
        smootherWidth,
        dt,
        y_plotting,
        lineData = [],
        lineLSdata = [];

    N_times = (time.time_yrs.length <= data_tg.time_yrs.length) ? time.time_yrs.length : data_tg.time_yrs.length;
    for (i = 0; i < N_times; i += 1) {
        if (data_al.sla[i] > 9999.0 || data_tg.sl_dt[i] > 9999.0) {
            dataMissing += 1;
        } else {
            data_trim.push(data_tg.sl_dt[i] - data_al.sla[i]);
            time_yrs_trim.push(time.time_yrs[i]);
            time_dys_trim.push(time.time_dys[i]);
        }
    }

    // Set up LS data arrays:
    for (i = 0; i < time_yrs_trim.length; i += 1) {
        if ((min_Date === 0 || time_yrs_trim[i] >= min_Date) && (max_Date === 0 || time_yrs_trim[i] <= max_Date)) {
            x_LS.push(time_dys_trim[i]);
            y_LS.push(data_trim[i]);
            x_LS_plot.push(time_yrs_trim[i]);
        }
    }

    if (x_LS.length === 0) {
        return [[],[]];
    }

    // Demean timeseries:
    for (i = 0; i < y_LS.length; i += 1) {
        sum_y += y_LS[i];
    }
    mean_y = sum_y / y_LS.length;
    for (i = 0; i < y_LS.length; i += 1) {
        y_demean.push(y_LS[i] - mean_y);
    }
    y_LS = [];
    y_LS = y_demean;

    // Calculate Best Fit information:
    LSreturn   = leastSquares(x_LS, y_LS);
    // y_star     = LSreturn[0];
    fit_params = LSreturn[1];
    y_trend    = LSreturn[2];
    y_seasons  = LSreturn[3];
    trend      = fit_params[1] * 365.25; // per day -> per yr, m -> cm
    annual     = fit_params[2];          // m -> cm
    semiann    = fit_params[3];          // m -> cm

    // Check if LS estimated seasonal signals:
    if (fit_params[2] === 9999.9999) {
        drawDeseason = 0;
    }

    y_plot = y_LS;
    if (drawDetrend === 1) { y_plot = math.subtract(y_plot, y_trend); }
    if (drawDeseason === 1) { y_plot = math.subtract(y_plot, y_seasons); }

    // Fill out LS Parameters display:
    setLeastSquaresDisplay(trend, annual, semiann, plot_units, "difference");

    // Get boxcar smoother width:
    smootherWidth = Number(document.getElementById('smooth-width').value);

    // Get data ready for plotting (Smooth if activated):
    if (smootherWidth > 0) {
        dt = time_dys_trim[1] - time_dys_trim[0];
        if (dataMissing > 0) {
            y_plotting = boxcar(x_LS, y_plot, smootherWidth);
        } else {
            y_plotting = boxcar2(x_LS, y_plot, dt, smootherWidth);
        }
    } else {
        y_plotting = y_plot;
    }

    // Define data in matrices for plotting:
    for (i = 0; i < x_LS.length; i += 1) {
        lineData.push({x: x_LS_plot[i], y: y_plotting[i]}); // m -> cm
        lineLSdata.push({x: x_LS_plot[i], y: y_trend[i]});  // m -> cm
    }

    return [lineData, lineLSdata];
}

// getYbounds :: Determine y-axis bounds for plot.
function getYbounds(lineData) {
    "use strict";
    var yMin, yMax, yMaxMin;

    yMin = d3.min(lineData, function (d) { return d.y; });
    yMax = d3.max(lineData, function (d) { return d.y; });

    if (yMin < -10 || yMax > 10) {
        yMaxMin = Math.ceil(d3.max([Math.abs(yMin), Math.abs(yMax)], function (d) { return d; }) / 5) * 5;
    } else if (yMin < -1 || yMax > 1) {
        yMaxMin = Math.ceil(d3.max([Math.abs(yMin), Math.abs(yMax)], function (d) { return d; }) / 2) * 2;
    } else {
        yMaxMin = (d3.max([Math.abs(yMin), Math.abs(yMax)], function (d) { return d; }) / 1.1) * 1.1;
    }
    return [-yMaxMin, yMaxMin];
}

// saveImageListener :: When the "Save Image" button is clicked, download the image.
function saveImageListener() {
    "use strict";
    var drawDeseason, smootherWidth, imgName;

    drawDeseason = checkDeseason();
    smootherWidth = Number(document.getElementById('smooth-width').value);
    imgName = 'JPL-' + jsonFilename.substr(5, jsonFilename.length - 10);
    if (drawDeseason === 1) { imgName = imgName + "_deseasoned"; }
    if (smootherWidth > 0) { imgName = imgName + "_smooth" + String(smootherWidth) + "days"; }
    imgName = imgName + ".png";
    saveSvgAsPng(document.getElementById(svg_id), imgName, {scale: 2, backgroundColor: "#FFFFFF"});
}

// dataHeaderInfo :: Writes header information for downloadData function as CSV
function dataHeaderInfo(dataset) {
    "use strict";
    var data_header,
        jsonAltimetryLocation = getLatLonGridLocation(LNG, LAT),
        altLat = jsonAltimetryLocation[2],
        altLon = jsonAltimetryLocation[3];

    if (dataset === "altimetry") {
        // JPL Altimetry Data
        data_header = [
            ["lat", altLat],
            ["lon", altLon],
            ["Source", "Victor Zlotnicki (JPL)"],
            //["Citation", ""]
        ];
    } else {
        // Tide Gauge Data
        data_header = [
            ["lat", data_tidegauge.lat],
            ["lon", data_tidegauge.lon],
            ["code", data_tidegauge.code],
            ["location", data_tidegauge.loc],
            ["Source", "Mark Merrifield (UHSLC)"],
            //["Citation", ""]
        ];
    }
    return data_header;
}

// downloadData :: Captures currently plotted data and writes & downloads as CSV
function downloadData() {
    "use strict";
    var i, time_units, isCMWE, data_units, data_csv_struc, data_string, encoded_uri,
        len_altimetry = 0, len_tidegauge = 0, len_shorter, len_longer,
        altLatSign = '', altLonSign = '', altLatStr = '', altLonStr = '',
        csv_filename, link, csv_content = "data:text/csv;charset=utf-8,";

    time_units = "time";
    data_units = 'sla (cm)';
    //data_error_units = 'sla error (mm)';

    // Write Data Portal Header:
    data_csv_struc = [["CCAR's Altimetry Explorer"]];
    data_csv_struc.push(["http://ccar.colorado.edu/altimetry/"]);

    // Write Altimetry Header (if applicable):
    if (altimetry_plotted === true) {
        len_altimetry = plot_data_altimetry.length;

        data_csv_struc.push(["ALTIMETRY INFORMATION"]);
        data_csv_struc.push.apply(data_csv_struc, data_altimetry_header);
        data_csv_struc.push([""]);
    }

    // Write Tide Gauge Header (if applicable):
    if (tidegauge_plotted === true) {
        len_tidegauge = plot_data_tidegauge.length;

        data_csv_struc.push(["TIDEGAUGE INFORMATION"]);
        data_csv_struc.push.apply(data_csv_struc, data_tidegauge_header);
        data_csv_struc.push([""]);
    }

    // Write Extra Header Information:
    data_csv_struc.push([""]);

    // Write timeseries columns:
    if (altimetry_plotted === true && tidegauge_plotted === true) {

        // Label Columns:
        data_csv_struc.push(["Altimetry","","","Tide Gauge"])
        data_csv_struc.push([time_units, data_units, "", time_units, data_units]);

        // Determine lengths of timeseries:
        len_shorter = (len_altimetry < len_tidegauge ? len_altimetry : len_tidegauge);
        len_longer  = (len_altimetry < len_tidegauge ? len_tidegauge : len_altimetry);

        // Write both timeseries where lengths are the same:
        for (i = 0; i < len_shorter; i++) {
            data_csv_struc.push([
                plot_data_altimetry[i].x,
                plot_data_altimetry[i].y,
                "",
                plot_data_tidegauge[i].x,
                plot_data_tidegauge[i].y
            ]);
        }

        // Write longer timeseries only, with blanks for shorter timeseries
        for (i = len_shorter; i < len_longer; i++) {
            if (len_altimetry < len_tidegauge) {
                data_csv_struc.push([
                    "",
                    "",
                    "",
                    plot_data_tidegauge[i].x,
                    plot_data_tidegauge[i].y
                ]);
            } else {
                data_csv_struc.push([
                    plot_data_altimetry[i].x,
                    plot_data_altimetry[i].y
                ]);
            }
        }
    } else {

        // Label Columns:
        data_csv_struc.push([time_units, data_units]);

        // Write timeseries:
        if (altimetry_plotted === true) {
            for (i = 0; i < len_altimetry; i++) {
                data_csv_struc.push([
                    plot_data_altimetry[i].x,
                    plot_data_altimetry[i].y
                ]);
            }
        } else {
            for (i = 0; i < len_tidegauge; i++) {
                data_csv_struc.push([
                    plot_data_tidegauge[i].x,
                    plot_data_tidegauge[i].y
                ]);
            }
        }
    }

    data_csv_struc.forEach(function (infoArray, index) {
        data_string = infoArray.join(",");
        csv_content += index < data_csv_struc.length ? data_string + "\n" : data_string;
    });

    encoded_uri = encodeURI(csv_content);
    // window.open(encoded_uri, '_blank');

    csv_filename = "CCAR";

    // lat = data_altimetry_header[0][1], lon = data_altimetry_header[1][1]
    if (altimetry_plotted === true) {
        altLatSign = (data_altimetry_header[0][1] >= 0 ? 'N' : 'S');
        altLonSign = (data_altimetry_header[1][1] >= 0 ? 'E' : 'W');
        altLatStr = Math.abs(data_altimetry_header[0][1]*10000).toFixed(0) + altLatSign;
        altLonStr = Math.abs(data_altimetry_header[1][1]*10000).toFixed(0) + altLonSign;
        csv_filename += '_altimetry_' + altLatStr + '_' + altLonStr;
    }

    if (tidegauge_plotted === true) {
        csv_filename += "_tidegauge_" + data_tidegauge.code;
    }

    csv_filename += ".csv";

    link = document.createElement("a");
    link.setAttribute("href", encoded_uri);
    link.setAttribute("download", csv_filename);
    document.body.appendChild(link);
    link.click();
}

// dataDownloadDialogListener :: Listen for Download Data button click, launch dialog
function dataDownloadDialogListener() {
    document.getElementById("download-dialog").style.display = "block";
}

// dataDownloadDialogListener :: Listen for Download Data button click, launch dialog
function dataDownloadCancelListener() {
    document.getElementById("download-dialog").style.display = "none";
}

// dataDownloadListener :: Initializes d/l when "Download Now" button clicked
function dataDownloadListener() {
    "use strict";
    downloadData();
    dataDownloadCancelListener();
}

function displayDifference(min_Date, max_Date, status) {
    "use strict";
    var i, drawDetrend, drawTrend, plot_units, plotting_dif, lineData, lineLSdata,
        yMinMax, yMin, yMax, svg, vis, yScale, xAxis, yAxis, lineFunc, divTooltip,
        divTooltip0, divTooltip1, data_entries = ['Tide Gauge - Altimetry'],
        data_colors = [plotColors(0)], attr_text;

    // Setup & Bookkeeping:
    drawDetrend = checkDetrend();
    drawTrend = checkTrend();
    plot_units = 'cm';

    altimetry_plotted = true;
    tidegauge_plotted = true;

    if (plot_num > 0) {
        d3.select("#" + svg_id).remove();
        document.getElementById('data-timeseries').innerHTML = "";
    }

    maximizePlot();

    plotting_dif = differenceDataForPlotting(data_altimetry, data_tidegauge, plot_units, min_Date, max_Date);
    lineData = plotting_dif[0];
    lineLSdata = plotting_dif[1];

    // Setup plotting bounds:
    if (min_Date) {
        minDate = min_Date;
    } else {
        minDate = Math.floor(d3.min(lineData, function (d) { return d.x; }));
    }

    if (max_Date) {
        maxDate = max_Date;
    } else {
        maxDate = Math.ceil(d3.max(lineData, function (d) { return d.x; }));
    }

    yMinMax = getYbounds(lineData);
    yMin = yMinMax[0];
    yMax = yMinMax[1];

    // Define plotting area:
    plot_num += 1;
    svg_id = "svg-timeseries-" + plot_num;
    svg = d3.select("#data-timeseries")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("id", svg_id)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 800 400")
        .classed("svg-content-responsive", true);

    vis = d3.select('#' + svg_id);

    xScale = d3.scale.linear()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([minDate, maxDate]);
    yScale = d3.scale.linear()
        .range([HEIGHT + MARGINS.bottom, MARGINS.top + MARGINS.bottom])
        .domain([yMin, yMax]);

    xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .innerTickSize(- HEIGHT + MARGINS.top)
          .outerTickSize(0)
          .tickPadding(4)
          .tickFormat(d3.format("d"));

    yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .innerTickSize(-WIDTH + MARGINS.right + MARGINS.left)
          .outerTickSize(0)
          .tickPadding(8);

    // Draw plotting area
    vis.append('svg:g').attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT + MARGINS.bottom) + ')')
        .call(xAxis);

    svg.append("text")
        .attr("class", "x label").attr("text-anchor", "end")
        .attr("x", 455).attr("y", 392).text("Year");

    vis.append('svg:g').attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", (MARGINS.left / 2 - 5))
        .attr("x", (-HEIGHT / 2 + MARGINS.bottom))
        .attr("transform", "rotate(-90)")
        .text("Height (cm)");

    // Define plot line:
    lineFunc = d3.svg.line()
        .x(function (d) { return xScale(d.x); })
        .y(function (d) { return yScale(d.y); })
        .interpolate('linear');

    // Add the scatterplot
    divTooltip  = d3.select("#plot-tooltip");   // Define handle on tooltip
    divTooltip0 = d3.select("#tooltip-info-0"); // Define handle on tooltip
    divTooltip1 = d3.select("#tooltip-info-1"); // Define handle on tooltip
    svg.selectAll("dot")
        .data(lineData)
        .enter().append("circle")
        .attr("r", 1.5)
        .style("stroke", plotColors(1)).style("stroke-width", 1)
        .style("fill", plotColors(1))
        .attr("cx", function (d) { return xScale(d.x); })
        .attr("cy", function (d) { return yScale(d.y); })
        .attr("text", function (d) { return yScale(d.y); })
        .on("mouseover", function (d) {
            // Show the tooltip when hovering over a datapoint
            divTooltip.transition().duration(200).style("opacity", 0.95);
            divTooltip.style("background-color", plotColors(1,"light"));
            divTooltip0.html('<span class="bold">SSH:</span> ' + d.y.toFixed(3) + ' ' + plot_units);
            divTooltip1.html('<span class="bold">Date:</span> ' + convertDecimalDate(d.x.toFixed(3)));
        })
        .on("mouseout", function () {
            divTooltip.transition()
                .duration(2000)
                .style("opacity", 0);
        });

    // If any radio buttons are "On", add to plot:
    if (drawTrend === 1 && drawDetrend === 0) {
        vis.append('svg:path')
            .attr('d', lineFunc(lineLSdata))
            .attr('stroke', plotColors(2)).attr('stroke-width', 2)
            .attr('fill', 'none')
            .style("stroke-dasharray", ("5, 5"));
    }

    if (plot_num > 0) {
        document.getElementById("save-button").removeEventListener("click", saveImageListener);
        document.getElementById("data-dialog-button").removeEventListener("click", dataDownloadDialogListener);
        document.getElementById("data-cancel-button").removeEventListener("click", dataDownloadCancelListener);
        document.getElementById("data-button").removeEventListener("click", dataDownloadListener);
    }
    document.getElementById("save-button").addEventListener("click", saveImageListener);
    document.getElementById("data-dialog-button").addEventListener("click", dataDownloadDialogListener);
    document.getElementById("data-cancel-button").addEventListener("click", dataDownloadCancelListener);
    document.getElementById("data-button").addEventListener("click", dataDownloadListener);

    /*
    if (drawTrend === 1 && drawDetrend === 0) {
        data_entries.push('Trend');
        data_colors.push(plotColors(2));
    }
    drawLegend(data_entries, data_colors);
    */
    drawTitle();

    plot_data_difference = lineData;

    // Add attribution box to bottom left
    attr_text = [
        "Altimetry: Victor Zlotnicki, JPL",
        "Tide Gauges: Mark Merrifield, UHSLC",
        "Plot: http://ccar.colorado.edu/altimetry/"
    ];

    svg.append("rect")
        .attr("x", 560)
        .attr("y", 321)
        .attr("width", 220)
        .attr("height", 39)
        .attr("fill", "#F0F0F0")
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    for (i=0; i < attr_text.length; i++) {
        svg.append("text")
            .attr("x", 777)
            .attr("y", 331 + 13*i)
            .attr("text-anchor", "end")
            .style("font-size", "11px")
            .style("text-decoration", "none")
            .style("background-color", "#FAFAFA")
            .style("font-family", "Arial")
            .text(attr_text[i]);
    }
}

// displayDataSeries :: takes returned data series and plots onto graph.
function displayDataSeries(min_Date, max_Date, dataset_id, status) {
    "use strict";
    var drawDetrend, drawTrend, plot_units, plotting_altimetry, plotting_tidegauge,
        lineData_al, lineData_tg, lineLSdata_al, lineLSdata_tg, svg,
        vis, yMinMax, yMin, yMax, yScale, xAxis, yAxis, lineFunc, divTooltip, divTooltip0,
        divTooltip1, minDate_al = 10000, maxDate_al = 0, minDate_tg = 10000, maxDate_tg = 0,
        yMin_al = 0, yMax_al = 0, yMin_tg = 0, yMax_tg = 0, data_entries = [], data_colors = [],
        attr_text, i;

    if (dataset_id === "altimetry") {
        altimetry_plotted = true;
    } else if (dataset_id === "tidegauges") {
        tidegauge_plotted = true;
    }

    // Setup & Bookkeeping:
    drawDetrend = checkDetrend();
    drawTrend = checkTrend();
    plot_units = 'cm';

    if (plot_num > 0) {
        d3.select("#" + svg_id).remove();
        document.getElementById('data-timeseries').innerHTML = "";
    }

    maximizePlot();

    if (altimetry_plotted === true) {
        // Get data in a structure ready for plotting, including LS information:
        plotting_altimetry = prepDataForPlotting(data_altimetry, plot_units, min_Date, max_Date, "altimetry");

        lineData_al = plotting_altimetry[0];
        lineLSdata_al = plotting_altimetry[1];

        if (lineData_al.length > 0) {
            minDate_al = Math.floor(d3.min(lineData_al, function (d) { return d.x; }));
            maxDate_al = Math.ceil(d3.max(lineData_al, function (d) { return d.x; }));

            yMinMax = getYbounds(lineData_al);
            yMin_al = yMinMax[0];
            yMax_al = yMinMax[1];
        }
    }

    if (tidegauge_plotted === true) {
        // Get data in a structure ready for plotting, including LS information:
        plotting_tidegauge = prepDataForPlotting(data_tidegauge, plot_units, min_Date, max_Date, "tidegauges");

        lineData_tg = plotting_tidegauge[0];
        lineLSdata_tg = plotting_tidegauge[1];

        if (lineData_tg.length > 0) {
            minDate_tg = Math.floor(d3.min(lineData_tg, function (d) { return d.x; }));
            maxDate_tg = Math.ceil(d3.max(lineData_tg, function (d) { return d.x; }));

            yMinMax = getYbounds(lineData_tg);
            yMin_tg = yMinMax[0];
            yMax_tg = yMinMax[1];
        }
    }

    // Define plotting area:
    plot_num += 1;
    svg_id = "svg-timeseries-" + plot_num;
    svg = d3.select("#data-timeseries")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("id", svg_id)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 800 400")
        .classed("svg-content-responsive", true);

    vis = d3.select('#' + svg_id);

    // Setup plotting bounds:
    if (!min_Date) {
        minDate = Math.min(minDate_al, minDate_tg);
    } else {
        minDate = min_Date;
    }

    if (!max_Date) {
        maxDate = Math.max(maxDate_al, maxDate_tg);
    } else {
        maxDate = max_Date;
    }

    yMin = Math.min(yMin_al, yMin_tg);
    yMax = Math.max(yMax_al, yMax_tg);

    xScale = d3.scale.linear()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([minDate, maxDate]);
    yScale = d3.scale.linear()
        .range([HEIGHT + MARGINS.bottom, MARGINS.top + MARGINS.bottom])
        .domain([yMin, yMax]);

    xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .innerTickSize(- HEIGHT + MARGINS.top)
          .outerTickSize(0)
          .tickPadding(4)
          .tickFormat(d3.format("d"));

    yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .innerTickSize(-WIDTH + MARGINS.right + MARGINS.left)
          .outerTickSize(0)
          .tickPadding(8);

    // Draw plotting area
    vis.append('svg:g').attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT + MARGINS.bottom) + ')')
        .call(xAxis);

    svg.append("text")
        .attr("class", "x label").attr("text-anchor", "end")
        .attr("x", 455).attr("y", 392).text("Year");

    vis.append('svg:g').attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", (MARGINS.left / 2 - 5))
        .attr("x", (-HEIGHT / 2 + MARGINS.bottom))
        .attr("transform", "rotate(-90)")
        .text("Height (cm)");

    // Define plot line:
    lineFunc = d3.svg.line()
        .x(function (d) { return xScale(d.x); })
        .y(function (d) { return yScale(d.y); })
        .interpolate('linear');

    // Draw plots:
    if (tidegauge_plotted === true && lineData_tg.length > 0) {
        // Add the scatterplot
        divTooltip  = d3.select("#plot-tooltip");   // Define handle on tooltip
        divTooltip0 = d3.select("#tooltip-info-0"); // Define handle on tooltip
        divTooltip1 = d3.select("#tooltip-info-1"); // Define handle on tooltip
        svg.selectAll("dot")
            .data(lineData_tg)
            .enter().append("circle")
            .attr("r", 1.5)
            .style("stroke", plotColors(1)).style("stroke-width", 1)
            .style("fill", plotColors(1))
            .attr("cx", function (d) { return xScale(d.x); })
            .attr("cy", function (d) { return yScale(d.y); })
            .attr("text", function (d) { return yScale(d.y); })
            .on("mouseover", function (d) {
                // Show the tooltip when hovering over a datapoint
                divTooltip.transition().duration(200).style("opacity", 0.95);
                divTooltip.style("background-color", plotColors(1,"light"));
                divTooltip0.html('<span class="bold">SSH:</span> ' + d.y.toFixed(3) + ' ' + plot_units);
                divTooltip1.html('<span class="bold">Date:</span> ' + convertDecimalDate(d.x.toFixed(3)));
            })
            .on("mouseout", function () {
                divTooltip.transition()
                    .duration(2000)
                    .style("opacity", 0);
            });
    }

    if (altimetry_plotted === true && lineData_al.length > 0) {
        // Add the scatterplot
        divTooltip  = d3.select("#plot-tooltip");   // Define handle on tooltip
        divTooltip0 = d3.select("#tooltip-info-0"); // Define handle on tooltip
        divTooltip1 = d3.select("#tooltip-info-1"); // Define handle on tooltip
        svg.selectAll("dot")
            .data(lineData_al)
            .enter().append("circle")
            .attr("r", 1.5)
            .style("stroke", plotColors(0)).style("stroke-width", 1)
            .style("fill", plotColors(0))
            .attr("cx", function (d) { return xScale(d.x); })
            .attr("cy", function (d) { return yScale(d.y); })
            .attr("text", function (d) { return yScale(d.y); })
            .on("mouseover", function (d) {
                // Show the tooltip when hovering over a datapoint
                divTooltip.transition().duration(200).style("opacity", 0.95);
                divTooltip.style("background-color", plotColors(0,"light"));
                divTooltip0.html('<span class="bold">SSH:</span> ' + d.y.toFixed(3) + ' ' + plot_units);
                divTooltip1.html('<span class="bold">Date:</span> ' + convertDecimalDate(d.x.toFixed(3)));
            })
            .on("mouseout", function () {
                divTooltip.transition()
                    .duration(2000)
                    .style("opacity", 0);
            });
    }

    // If any radio buttons are "On", add to plot:
    if (drawTrend === 1 && drawDetrend === 0) {
        if (altimetry_plotted === true) {
            vis.append('svg:path')
                .attr('d', lineFunc(lineLSdata_al))
                .attr('stroke', plotColors(2)).attr('stroke-width', 2)
                .attr('fill', 'none')
                .style("stroke-dasharray", ("5, 5"));
        }
        if (tidegauge_plotted === true) {
            vis.append('svg:path')
                .attr('d', lineFunc(lineLSdata_tg))
                .attr('stroke', plotColors(3)).attr('stroke-width', 2)
                .attr('fill', 'none')
                .style("stroke-dasharray", ("5, 5"));
        }
    }

    if (plot_num > 0) {
        document.getElementById("save-button").removeEventListener("click", saveImageListener);
        document.getElementById("data-dialog-button").removeEventListener("click", dataDownloadDialogListener);
        document.getElementById("data-cancel-button").removeEventListener("click", dataDownloadCancelListener);
        document.getElementById("data-button").removeEventListener("click", dataDownloadListener);
    }
    document.getElementById("save-button").addEventListener("click", saveImageListener);
    document.getElementById("data-dialog-button").addEventListener("click", dataDownloadDialogListener);
    document.getElementById("data-cancel-button").addEventListener("click", dataDownloadCancelListener);
    document.getElementById("data-button").addEventListener("click", dataDownloadListener);

    if (altimetry_plotted === true && lineData_al.length > 0) {
        data_entries.push('Altimetry');
        data_colors.push(plotColors(0));
    }
    if (tidegauge_plotted === true && lineData_tg.length > 0) {
        data_entries.push('Tide Gauge');
        data_colors.push(plotColors(1));
    }
    if (drawTrend === 1 && drawDetrend === 0) {
        if (altimetry_plotted === true && lineData_al.length > 0) {
            data_entries.push('Altimetry Trend');
            data_colors.push(plotColors(2));
        }
        if (tidegauge_plotted === true && lineData_tg.length > 0) {
            data_entries.push('Tide Gauge Trend');
            data_colors.push(plotColors(3));
        }
    }
    drawLegend(data_entries, data_colors);
    drawTitle();

    plot_data_altimetry = lineData_al;
    plot_data_tidegauge = lineData_tg;

    // Add attribution box to bottom left
    attr_text = [];
    if (altimetry_plotted === true) {
        attr_text.push("Altimetry: Victor Zlotnicki, JPL");
    }
    if (tidegauge_plotted === true) {
        attr_text.push("Tide Gauges: Mark Merrifield, UHSLC");
    }
    attr_text.push("Plot: http://ccar.colorado.edu/altimetry/");

    svg.append("rect")
        .attr("x", 560)
        .attr("y", (attr_text.length == 2 ? 334 : 321))
        .attr("width", 220)
        .attr("height", (attr_text.length == 2 ? 26 : 39))
        .attr("fill", "#F0F0F0")
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    for (i=0; i < attr_text.length; i++) {
        svg.append("text")
            .attr("x", 777)
            .attr("y", (attr_text.length == 2 ? 344 : 331) + 13*i)
            .attr("text-anchor", "end")
            .style("font-size", "11px")
            .style("text-decoration", "none")
            .style("background-color", "#FAFAFA")
            .style("font-family", "Arial")
            .text(attr_text[i]);
    }

}

// displayDataNavbar :: plots timeseries data onto Navbar and initializes navbar brush.
function displayDataNavbar() {
    "use strict";
    var i, lineData_al = [], lineData_tg = [], svg, navChart, navXScale, navYScale,
        xAxis, viewport, ext, leftHandle, leftHandleGrip1, leftHandleGrip2,
        rightHandle, rightHandleGrip1, rightHandleGrip2, zoom, overlay, vis,
        minMaxY = [], minMaxX = [], sum_al = 0, N_sum_al = 0, mean_al, mean_tg,
        sum_tg = 0, N_sum_tg = 0;

    d3.select("#svg-navbar").remove();
    if (plot_num > 0) {
        document.getElementById('data-navbar').innerHTML = "";
    }

    // Define plot data:
    if (altimetry_plotted === true) {
        for (i = 0; i < time.time_yrs.length; i += 1) {
            if (data_altimetry.sla[i] < 9999.0) {
                sum_al += data_altimetry.sla[i];
                N_sum_al += 1;
            }
        }
        mean_al = sum_al / N_sum_al;
        for (i = 0; i < time.time_yrs.length; i += 1) {
            if (data_altimetry.sla[i] < 9999.0) {
                lineData_al.push({ x: time.time_yrs[i], y: data_altimetry.sla[i] - mean_al });
            }
        }
    }
    if (tidegauge_plotted === true) {
        for (i = 0; i < data_tidegauge.time_yrs.length; i += 1) {
            if (data_tidegauge.sl_dt[i] < 9999.0) {
                sum_tg += data_tidegauge.sl_dt[i];
                N_sum_tg += 1;
            }
        }
        mean_tg = sum_tg / N_sum_tg;
        for (i = 0; i < data_tidegauge.time_yrs.length; i += 1) {
            if (data_tidegauge.sl_dt[i] < 9999.0) {
                lineData_tg.push({ x: data_tidegauge.time_yrs[i], y: data_tidegauge.sl_dt[i] - mean_tg }); // convert mm to cm
            }
        }
    }

    // Define plotting area:
    svg = d3.select("#data-navbar")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("id", "svg-navbar")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 800 100")
        .classed("svg-content-responsive", true);

    navChart = d3.select('#svg-navbar');

    // Get minimum and maximum y values
    minMaxX = [ Math.floor(time.time_yrs[0]),
        Math.ceil(time.time_yrs[time.time_yrs.length - 1]) ];

    if (lineData_al.length === 0) {
        // Tide Gauge Only
        minMaxY = [ d3.min(lineData_tg, function (d) { return d.y; }),
            d3.max(lineData_tg, function (d) { return d.y; }) ];
    } else if (lineData_tg.length === 0) {
        // Altimetry Only
        minMaxY = [ d3.min(lineData_al, function (d) { return d.y; }),
            d3.max(lineData_al, function (d) { return d.y; }) ];
    } else {
        // Altimetry and Tide Gauge
        minMaxY = [ Math.min(d3.min(lineData_al, function (d) { return d.y; }), d3.min(lineData_tg, function (d) { return d.y; })),
            Math.max(d3.max(lineData_al, function (d) { return d.y; }), d3.max(lineData_tg, function (d) { return d.y; })) ];
    }

    navXScale = d3.scale.linear()
        .range([MARGINS.left, navWIDTH - MARGINS.right])
        .domain(minMaxX);

    navYScale = d3.scale.linear()
        .range([navHEIGHT - MARGINS.bottom, MARGINS.bottom])
        .domain(minMaxY);

    xAxis = d3.svg.axis()
        .scale(navXScale)
        .orient("bottom")
        .outerTickSize(2)
        .tickPadding(10)
        .tickFormat(d3.format("d"));

    // Draw plotting area
    navChart.append('svg:g').attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (navHEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

    // Add the scatterplots
    if (tidegauge_plotted === true) {
        svg.selectAll("dot")
            .data(lineData_tg)
            .enter().append("circle")
            .attr("r", 1)
            .style("stroke", plotColors(1))
            .style("fill", plotColors(1))
            .attr("cx", function (d) { return navXScale(d.x); })
            .attr("cy", function (d) { return navYScale(d.y); });
    }

    if (altimetry_plotted === true) {
        svg.selectAll("dot")
            .data(lineData_al)
            .enter().append("circle")
            .attr("r", 1)
            .style("stroke", plotColors(0))
            .style("fill", plotColors(0))
            .attr("cx", function (d) { return navXScale(d.x); })
            .attr("cy", function (d) { return navYScale(d.y); });
    }

    /* -- Viewport Brush: -- */
    viewport = d3.svg.brush()
        .x(navXScale)
        .extent([minDate, maxDate])
        .on("brush", function () {
            xScale.domain(viewport.empty() ? navXScale.domain() : viewport.extent());
            ext = viewport.extent();
            leftHandle.attr("x", navXScale(ext[0]) - 6);
            leftHandleGrip1.attr("x1", navXScale(ext[0]) - 4);
            leftHandleGrip1.attr("x2", navXScale(ext[0]) - 4);
            leftHandleGrip2.attr("x1", navXScale(ext[0]) - 2);
            leftHandleGrip2.attr("x2", navXScale(ext[0]) - 2);
            rightHandle.attr("x", navXScale(ext[1]));
            rightHandleGrip1.attr("x1", navXScale(ext[1]) + 2);
            rightHandleGrip1.attr("x2", navXScale(ext[1]) + 2);
            rightHandleGrip2.attr("x1", navXScale(ext[1]) + 4);
            rightHandleGrip2.attr("x2", navXScale(ext[1]) + 4);
        });

    leftHandle = navChart.append("rect")
        .attr("width", 6)
        .attr("height", navHEIGHT - MARGINS.bottom)
        .attr("x", navXScale(viewport.extent()[0]) - 6)
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("fill", "white");

    leftHandleGrip1 = navChart.append("line")
        .attr("x1", navXScale(viewport.extent()[0]) - 4)
        .attr("y1", navHEIGHT - MARGINS.bottom - 10)
        .attr("x2", navXScale(viewport.extent()[0]) - 4)
        .attr("y2", navHEIGHT - MARGINS.bottom - 30)
        .attr("stroke-width", 1)
        .attr("stroke", "gray");

    leftHandleGrip2 = navChart.append("line")
        .attr("x1", navXScale(viewport.extent()[0]) - 2)
        .attr("y1", navHEIGHT - MARGINS.bottom - 10)
        .attr("x2", navXScale(viewport.extent()[0]) - 2)
        .attr("y2", navHEIGHT - MARGINS.bottom - 30)
        .attr("stroke-width", 1)
        .attr("stroke", "gray");

    rightHandle = navChart.append("rect")
        .attr("width", 6)
        .attr("height", navHEIGHT - MARGINS.bottom)
        .attr("x", navXScale(viewport.extent()[1]))
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("fill", "white");

    rightHandleGrip1 = navChart.append("line")
        .attr("x1", navXScale(viewport.extent()[1]) + 2)
        .attr("y1", navHEIGHT - MARGINS.bottom - 10)
        .attr("x2", navXScale(viewport.extent()[1]) + 2)
        .attr("y2", navHEIGHT - MARGINS.bottom - 30)
        .attr("stroke-width", 1)
        .attr("stroke", "gray");

    rightHandleGrip2 = navChart.append("line")
        .attr("x1", navXScale(viewport.extent()[1]) + 4)
        .attr("y1", navHEIGHT - MARGINS.bottom - 10)
        .attr("x2", navXScale(viewport.extent()[1]) + 4)
        .attr("y2", navHEIGHT - MARGINS.bottom - 30)
        .attr("stroke-width", 1)
        .attr("stroke", "gray");

    // Add the viewport to the navigation chart:
    navChart.append("g")
        .attr("class", "viewport")
        .call(viewport)
        .selectAll("rect")
        .attr("height", navHEIGHT - MARGINS.bottom);

    zoom = d3.behavior.zoom()
        .x(xScale);

    viewport.on("brushend", function () {
        if (difference_plotted === true ){
            displayDifference(viewport.extent()[0], viewport.extent()[1], "change");
        } else {
            displayDataSeries(viewport.extent()[0], viewport.extent()[1], [], "change");
        }
    });
}
