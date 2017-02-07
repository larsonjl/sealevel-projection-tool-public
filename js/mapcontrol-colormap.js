function updateYearText(max) {
    "use strict";
    document.getElementById('year-set').innerHTML = max;
}


function setupColorbar(type, cbar) {
    "use strict";
    var stops;

    if (type === 'rw'){ // "White-Red" Colorbar
        stops = [
            [cbar[0], '#fafafa'],
            [cbar[1], '#fde1a6'],
            [cbar[2], '#f7c670'],
            [cbar[3], '#f0aa49'],
            [cbar[4], '#e88e30'],
            [cbar[5], '#df6e22'],
            [cbar[6], '#d2501d'],
            [cbar[7], '#bd361c'],
            [cbar[8], '#a3201d'],
            [cbar[9], '#850c1e'],
            [cbar[10], '#67001f']
        ];
    } else if (type === 'rwb') { // "Red-White-Blue" Colorbar
        stops = [
            [cbar[0],  '#053061'],
            [cbar[1],  '#0c3c94'],
            [cbar[2],  '#114ac0'],
            [cbar[3],  '#175be9'],
            [cbar[4],  '#3172fa'],
            [cbar[5],  '#498dfa'],
            [cbar[6],  '#5ea6f9'],
            [cbar[7],  '#74bff9'],
            [cbar[8],  '#91d8f8'],
            [cbar[9],  '#b7edf8'],
            [cbar[10], '#fafafa'],
            [cbar[11], '#fde1a6'],
            [cbar[12], '#f7c670'],
            [cbar[13], '#f0aa49'],
            [cbar[14], '#e88e30'],
            [cbar[15], '#df6e22'],
            [cbar[16], '#d2501d'],
            [cbar[17], '#bd361c'],
            [cbar[18], '#a3201d'],
            [cbar[19], '#850c1e'],
            [cbar[20], '#67001f']
        ];
    } else if (type === 'plasma') { // Matplotlib's Plasma Colorbar
        stops = [
            [cbar[0],  '#0d0887'],
            [cbar[1],  '#2a0593'],
            [cbar[2],  '#41049d'],
            [cbar[3],  '#5601a4'],
            [cbar[4],  '#6a00a8'],
            [cbar[5],  '#7e03a8'],
            [cbar[6],  '#8f0da4'],
            [cbar[7],  '#a11b9b'],
            [cbar[8],  '#b12a90'],
            [cbar[9],  '#bf3984'],
            [cbar[10], '#cc4778'],
            [cbar[11], '#d6556d'],
            [cbar[12], '#e16462'],
            [cbar[13], '#ea7457'],
            [cbar[14], '#f2844b'],
            [cbar[15], '#f89540'],
            [cbar[16], '#fca636'],
            [cbar[17], '#feba2c'],
            [cbar[18], '#fcce25'],
            [cbar[19], '#f7e425'],
            [cbar[20], '#f0f921']
        ];
    } else if (type === 'spectral') { // Matplotlib's Spectral Colorbar
        stops = [
            [cbar[0],  '#5e4fa2'],
            [cbar[1],  '#486cb0'],
            [cbar[2],  '#3288bd'],
            [cbar[3],  '#4ca5b1'],
            [cbar[4],  '#66c2a5'],
            [cbar[5],  '#89d0a5'],
            [cbar[6],  '#abdda4'],
            [cbar[7],  '#c9e99e'],
            [cbar[8],  '#e6f598'],
            [cbar[9],  '#f3faac'],
            [cbar[10], '#ffffbf'],
            [cbar[11], '#fff0a5'],
            [cbar[12], '#fee08b'],
            [cbar[13], '#fec776'],
            [cbar[14], '#fdae61'],
            [cbar[15], '#f98e52'],
            [cbar[16], '#f46d43'],
            [cbar[17], '#e55649'],
            [cbar[18], '#d53e4f'],
            [cbar[19], '#ba2049'],
            [cbar[20], '#9e0142']
        ];
    } else { // Matplotlib's Viridis is default
        stops = [
            [-500, '#d3d3d3'],
            [cbar[0],  '#440154'],
            [cbar[1],  '#471365'],
            [cbar[2],  '#482475'],
            [cbar[3],  '#463480'],
            [cbar[4],  '#414487'],
            [cbar[5],  '#3b528b'],
            [cbar[6],  '#355f8d'],
            [cbar[7],  '#2f6c8e'],
            [cbar[8],  '#2a788e'],
            [cbar[9],  '#25848e'],
            [cbar[10], '#21918c'],
            [cbar[11], '#1e9c89'],
            [cbar[12], '#22a884'],
            [cbar[13], '#2fb47c'],
            [cbar[14], '#44bf70'],
            [cbar[15], '#5ec962'],
            [cbar[16], '#7ad151'],
            [cbar[17], '#9bd93c'],
            [cbar[18], '#bddf26'],
            [cbar[19], '#dfe318'],
            [cbar[20], '#fde725']
        ];
    }

    return stops;
}

function getColorbarStops(type, min, max) {
    "use strict";
    var cbar = [], stops = [], i, iter_size, cbar_val = min, tick_string;

    switch (type) {
        case 'rw':
            // Red-to-White Colorbar
            iter_size = (max - min) / 10.0;
            for (i = 0; i <= 10; i += 1) {
                cbar.push(cbar_val);
                tick_string = String(cbar_val.toFixed(1));
                if (tick_string === "-0.0") {
                    tick_string = "0.0";
                }
                document.getElementById('cbar-rw-l-' + String(i)).innerHTML = tick_string;
                cbar_val += iter_size;
            }
            stops = setupColorbar('rw', cbar);
            break;
        case 'rwb':
            // Red-White-Blue Colorbar
            iter_size = (max - min) / 20.0;
            for (i = 0; i <= 20; i += 1) {
                cbar.push(cbar_val);
                if (i % 2 === 0) {
                    tick_string = String(cbar_val.toFixed(1));
                    if (tick_string === "-0.0") {
                        tick_string = "0.0";
                    }
                    document.getElementById('cbar-rwb-l-' + String(i)).textContent = tick_string;
                }
                cbar_val += iter_size;
            }
            stops = setupColorbar('rwb', cbar);
            break;
        case 'plasma':
            // Matplotlib's Plasma Colorbar
            iter_size = (max - min) / 20.0;
            for (i = 0; i <= 20; i += 1) {
                cbar.push(cbar_val);
                if (i % 2 === 0) {
                    tick_string = String(cbar_val.toFixed(1));
                    if (tick_string === "-0.0") {
                        tick_string = "0.0";
                    }
                    document.getElementById('cbar-pla-l-' + String(i)).textContent = tick_string;
                }
                cbar_val += iter_size;
            }
            stops = setupColorbar('plasma', cbar);
            break;
        case 'spectral':
            // Matplotlib's Spectral Colorbar
            iter_size = (max - min) / 20.0;
            for (i = 0; i <= 20; i += 1) {
                cbar.push(cbar_val);
                if (i % 2 === 0) {
                    tick_string = String(cbar_val.toFixed(1));
                    if (tick_string === "-0.0") {
                        tick_string = "0.0";
                    }
                    document.getElementById('cbar-spe-l-' + String(i)).textContent = tick_string;
                }
                cbar_val += iter_size;
            }
            stops = setupColorbar('spectral', cbar);
            break;
        case 'viridis':
            // Matplotlib's Viridis Colorbar
            iter_size = (max - min) / 20.0;
            for (i = 0; i <= 20; i += 1) {
                cbar.push(cbar_val);
                if (i % 2 === 0) {
                    tick_string = String(cbar_val.toFixed(1));
                    if (tick_string === "-0.0") {
                        tick_string = "0.0";
                    }
                    document.getElementById('cbar-vir-l-' + String(i)).textContent = tick_string;
                }
                cbar_val += iter_size;
            }
            stops = setupColorbar('viridis', cbar);
            break;
        default:
            // Default to Viridis
            iter_size = (max - min) / 20.0;
            for (i = 0; i <= 20; i += 1) {
                cbar.push(cbar_val);
                if (i % 2 === 0) {
                    tick_string = String(cbar_val.toFixed(1));
                    if (tick_string === "-0.0") {
                        tick_string = "0.0";
                    }
                    document.getElementById('cbar-vir-l-' + String(i)).textContent = tick_string;
                }
                cbar_val += iter_size;
            }
            stops = setupColorbar('viridis', cbar);
    }

    return stops;
}

function changeMapColorbar(map_type, cbar, map_min, map_max) {
    "use strict";
    var id = 'alti-' + map_type,
        units = '',
        cbar_stops;

    hideColorbars();

    switch (map_type) {
        case 'trend':
            units = 't';
            document.getElementById('cbar-units').textContent = 'cm/yr';
            break;
        case 'annual':
            units = 'a';
            document.getElementById('cbar-units').textContent = 'cm';
            break;
        case 'rms':
            units = 'r';
            document.getElementById('cbar-units').textContent = 'cm';
            break;
        default:
            units = 'r';
            document.getElementById('cbar-units').textContent = 'cm';
    }

    cbar_stops = getColorbarStops(cbar, map_min, map_max);

    map.setPaintProperty(id + '-coarse', 'fill-color', { property: units, stops: cbar_stops });
    map.setPaintProperty(id + '-fine', 'fill-color', { property: units, stops: cbar_stops });
    map.setPaintProperty('gauges', 'circle-color', { property: units, stops: cbar_stops });
    map.setPaintProperty('gauges-hover', 'circle-color', { property: units, stops: cbar_stops });

    document.getElementById(activeColormap + '-colorbar').style.display = 'inline-block';
    document.getElementById('map-cbar-container').style.display = 'block';
}

function updateColorbarMap(max) {
    "use strict";
    var min;
    switch (activeMap) {
        case 'trend':
            min = -max;
            break;
        case 'annual':
            min = 0;
            break;
        case 'rms':
            min = 0;
            break;
        default:
            min = 0;
    }
    changeMapColorbar(activeMap, activeColormap, min, max);
}

function hideColorbars() {
    "use strict";
    document.getElementById('map-cbar-container').style.display = 'none';
    document.getElementById('rw-colorbar').style.display = 'none';
    document.getElementById('rwb-colorbar').style.display = 'none';
    document.getElementById('plasma-colorbar').style.display = 'none';
    document.getElementById('spectral-colorbar').style.display = 'none';
    document.getElementById('viridis-colorbar').style.display = 'none';
}

function showColorbar(id) {
    "use strict";
    if (id === 'alti-trend') {
        activeMap = 'trend';
        changeMapColorbar(activeMap, activeColormap, -1.5, 1.5)

        document.getElementById('colorbar-max-bounds').step = 0.1;
        document.getElementById('colorbar-max-bounds').max = 10.0;
        document.getElementById('colorbar-max-bounds').min = 0.1;
        document.getElementById('colorbar-max-bounds').value = 1.5;
        document.getElementById('cbar-max-set').innerHTML = 1.5;
        document.getElementById('cbar-units-set').textContent = 'cm/yr';
    } else if (id === 'alti-annual') {
        activeMap = 'annual';
        changeMapColorbar(activeMap, activeColormap, 0, 25)

        document.getElementById('colorbar-max-bounds').step = 5;
        document.getElementById('colorbar-max-bounds').max = 100;
        document.getElementById('colorbar-max-bounds').min = 5;
        document.getElementById('colorbar-max-bounds').value = 25;
        document.getElementById('cbar-max-set').innerHTML = 25;
        document.getElementById('cbar-units-set').textContent = 'cm';
    } else if (id === 'alti-rms') {
        activeMap = 'rms';
        changeMapColorbar(activeMap, activeColormap, 0, 35);

        document.getElementById('colorbar-max-bounds').step = 5;
        document.getElementById('colorbar-max-bounds').max = 60;
        document.getElementById('colorbar-max-bounds').min = 5;
        document.getElementById('colorbar-max-bounds').value = 35;
        document.getElementById('cbar-max-set').innerHTML = 35;
        document.getElementById('cbar-units-set').textContent = 'cm';
    }
}
