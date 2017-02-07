// getAllInRange :: Sweeps through timeseries, returns indices of locations in range.
function getAllInRange(dx, range) {
    "use strict";
    var indices = [], i;

    for (i = 0; i < dx.length; i += 1) {
        if (dx[i] <= range) {
            indices.push(i);
        } else if (indices.length > 0) {
            break;
        }
    }
    return indices;
}

// boxcar :: A simple boxcar smoother. Data does not have to be evenly sampled.
function boxcar(x, y, width) {
    "use strict";
    var y_smooth = [], x_resids, range, ind, sum, i, j;

    for (i = 0; i < x.length; i += 1) {
        x_resids = math.abs(math.subtract(x, x[i]));
        range = width / 2;
        ind = getAllInRange(x_resids, range);
        sum = 0;
        for (j = 0; j < ind.length; j += 1) {
            sum += y[ind[j]];
        }
        y_smooth[i] = sum / ind.length;
    }
    return y_smooth;
}

// boxcar2 :: Like "boxcar", but faster and for evenly sampled datasets only.
function boxcar2(x, y, dx, width) {
    "use strict";
    var y_smooth = [], width_ind, last_x_index, start_index, end_index,
        num_points, sum, i, j;

    width_ind = Math.floor((width / 2) / dx);
    last_x_index = x.length - 1;
    for (i = 0; i < x.length; i += 1) {
        start_index = 0;
        end_index = i + width_ind;
        if (width_ind < i) { start_index = i - width_ind; }
        if ((i + width_ind) > last_x_index) { end_index = last_x_index; }

        num_points = end_index - start_index + 1;
        sum = 0;
        for (j = start_index; j <= end_index; j += 1) {
            sum += y[j];
        }
        y_smooth[i] = sum / num_points;
    }
    return y_smooth;
}

// leapYear :: Returns true if the year is a leap year and false otherwise.
function leapYear(year) {
    "use strict";
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

// convertDecimalDate :: Formats a year + decimal as Month Day, Year.
function convertDecimalDate(decimalDate) {
    "use strict";
    var year, reminder, daysPerYear, milliseconds, yearDate, date, date_str;

    year = parseInt(decimalDate, 10);
    reminder = decimalDate - year;
    daysPerYear = leapYear(year) ? 366 : 365;
    milliseconds = reminder * daysPerYear * 24 * 60 * 60 * 1000;
    yearDate = new Date(year, 0, 1);
    date = new Date(yearDate.getTime() + milliseconds);
    date_str = date.toDateString();

    return date_str.substring(4);
}

// correlations :: Get correlations between LS params from the covariance matrix.
function correlations(covari) {
    "use strict";
    var cov_diag = math.diag(covari),
        sigmas = math.sqrt(cov_diag),
        rhos = [covari.get([0, 1]) / (sigmas.get([0]) * sigmas.get([1])),
            covari.get([0, 2]) / (sigmas.get([0]) * sigmas.get([2])),
            covari.get([0, 3]) / (sigmas.get([0]) * sigmas.get([3])),
            covari.get([0, 4]) / (sigmas.get([0]) * sigmas.get([4])),
            covari.get([0, 5]) / (sigmas.get([0]) * sigmas.get([5])),
            covari.get([1, 2]) / (sigmas.get([1]) * sigmas.get([2])),
            covari.get([1, 3]) / (sigmas.get([1]) * sigmas.get([3])),
            covari.get([1, 4]) / (sigmas.get([1]) * sigmas.get([4])),
            covari.get([1, 5]) / (sigmas.get([1]) * sigmas.get([5])),
            covari.get([2, 3]) / (sigmas.get([2]) * sigmas.get([3])),
            covari.get([2, 4]) / (sigmas.get([2]) * sigmas.get([4])),
            covari.get([2, 5]) / (sigmas.get([2]) * sigmas.get([5])),
            covari.get([3, 4]) / (sigmas.get([3]) * sigmas.get([4])),
            covari.get([3, 5]) / (sigmas.get([3]) * sigmas.get([5])),
            covari.get([4, 5]) / (sigmas.get([4]) * sigmas.get([5]))];

    return rhos;
}

// leastSquares :: calculates best fit parameters given x [days] and y [cmwe].
function leastSquares(x, y) {
    "use strict";
    var twoPI = 2 * Math.PI, f1 = 1 / 365.25, twoPIf1 = twoPI * f1,
        f2 = 2 / 365.25, twoPIf2 = twoPI * f2, i, sum_x = 0, mean_x,
        x_demean = [], H_temp, t_ind, H_full, Ht, HtH, covari, rhos,
        calc_seasons, covariance, H_trans, HtransH, LS_Params, offset, trend,
        a1, b1, a2, b2, FitParams, y_hat, y_trend, y_seasons, trnd, ssns;

    // Demean timeseries:
    for (i = 0; i < x.length; i += 1) {
        sum_x += x[i];
    }
    mean_x = sum_x / x.length;
    for (i = 0; i < x.length; i += 1) {
        x_demean.push(x[i] - mean_x);
    }

    // Define H Matrix:
    H_temp = [];
    t_ind = [];
    for (i = 0; i < x.length; i += 1) {
        t_ind.push(i);
        H_temp.push([
            1,
            x_demean[i],
            Math.cos(twoPIf1 * x_demean[i]),
            Math.sin(twoPIf1 * x_demean[i]),
            Math.cos(twoPIf2 * x_demean[i]),
            Math.sin(twoPIf2 * x_demean[i])
        ]);
    }
    H_full = math.matrix(H_temp);
    Ht = math.transpose(H_full);
    HtH = math.multiply(Ht, H_full);
    covari = math.inv(HtH);
    rhos = correlations(covari);

    calc_seasons = true;
    /*for (i = 0; i < rhos.length; i += 1) {
        if (Math.abs(rhos[i]) > 0.1) {
            calc_seasons = false;
            break;
        }
    }*/

    if (calc_seasons) {
        // H = H_full;
        H_trans = Ht;
        covariance = covari;
    } else {
        // H = H_full.subset(math.index(t_ind, [0, 1]));
        H_trans = Ht.subset(math.index([0, 1], t_ind));
        HtransH = HtH.subset(math.index([0, 1], [0, 1]));
        covariance = math.inv(HtransH);
    }

    // Perform LS inversion and grab output:
    LS_Params = math.multiply(covariance, math.multiply(H_trans, y));
    offset = math.subset(LS_Params, math.index(0));
    trend  = math.subset(LS_Params, math.index(1));
    if (calc_seasons) {
        a1 = math.subset(LS_Params, math.index(2));
        b1 = math.subset(LS_Params, math.index(3));
        a2 = math.subset(LS_Params, math.index(4));
        b2 = math.subset(LS_Params, math.index(5));
    }

    if (calc_seasons) {
        FitParams = [offset, trend, Math.sqrt(a1 * a1 + b1 * b1), Math.sqrt(a2 * a2 + b2 * b2)];
    } else {
        FitParams = [offset, trend, 9999.9999, 9999.9999];
    }

    y_hat = [];
    y_trend = [];
    y_seasons = [];
    for (i = 0; i < x.length; i += 1) {
        trnd = offset + trend * x_demean[i];
        y_trend.push(trnd);

        if (calc_seasons) {
            ssns = a1 * Math.cos(twoPIf1 * x_demean[i]) +
                b1 * Math.sin(twoPIf1 * x_demean[i]) +
                a2 * Math.cos(twoPIf2 * x_demean[i]) +
                b2 * Math.sin(twoPIf2 * x_demean[i]);
            y_hat.push(trnd + ssns);
            y_seasons.push(ssns);
        } else {
            y_hat.push(trnd);
        }
    }

    return [y_hat, FitParams, y_trend, y_seasons];
}

// isNumber, latRange, lonRange :: functions to check is lat/lon input valid
function isNumber(n) {
    "use strict";
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function latRange(n) {
    "use strict";
    var maxLat = Math.atan(Math.sinh(Math.PI)) * 180 / Math.PI;
    return Math.min(Math.max(n, -maxLat), maxLat);
}
function lngRange(n) {
    "use strict";
    return Math.min(Math.max(n, -180), 180);
}
