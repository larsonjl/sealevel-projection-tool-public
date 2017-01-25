function updateColorbarText(max) {
    "use strict";
    document.getElementById('cbar-max-set').innerHTML = max;
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
    } else { // Viridis is default
        stops = [
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
            document.getElementById('cbar-units').textContent = 'mm/yr';
            break;
        case 'annual':
            units = 'a';
            document.getElementById('cbar-units').textContent = 'mm';
            break;
        case 'rms':
            units = 'r';
            document.getElementById('cbar-units').textContent = 'mm';
            break;
        default:
            units = 'r';
            document.getElementById('cbar-units').textContent = 'mm';
    }

    cbar_stops = getColorbarStops(cbar, map_min, map_max);

    map.setPaintProperty(id + '-coarse', 'fill-color', { property: units, stops: cbar_stops });
    map.setPaintProperty(id + '-fine', 'fill-color', { property: units, stops: cbar_stops });

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
    document.getElementById('viridis-colorbar').style.display = 'none';
}

function showColorbar(id) {
    "use strict";
    if (id === 'alti-trend') {
        activeMap = 'trend';
        changeMapColorbar(activeMap, activeColormap, -5, 5);

        document.getElementById('colorbar-max-bounds').step = 0.1;
        document.getElementById('colorbar-max-bounds').max = 10.0;
        document.getElementById('colorbar-max-bounds').min = 0.1;
        document.getElementById('colorbar-max-bounds').value = 5;
        document.getElementById('cbar-max-set').innerHTML = 5;
    } else if (id === 'alti-annual') {
        activeMap = 'annual';
        changeMapColorbar(activeMap, activeColormap, 0, 25);

        document.getElementById('colorbar-max-bounds').step = 1;
        document.getElementById('colorbar-max-bounds').max = 100;
        document.getElementById('colorbar-max-bounds').min = 1;
        document.getElementById('colorbar-max-bounds').value = 25;
        document.getElementById('cbar-max-set').innerHTML = 25;
    } else if (id === 'alti-rms') {
        activeMap = 'rms';
        changeMapColorbar(activeMap, activeColormap, 0, 40);

        document.getElementById('colorbar-max-bounds').step = 1;
        document.getElementById('colorbar-max-bounds').max = 60;
        document.getElementById('colorbar-max-bounds').min = 1;
        document.getElementById('colorbar-max-bounds').value = 40;
        document.getElementById('cbar-max-set').innerHTML = 40;
    }
}
