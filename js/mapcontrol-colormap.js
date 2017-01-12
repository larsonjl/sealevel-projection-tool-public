function updateColorbarText(max) {
    "use strict";
    document.getElementById('cbar-max-set').innerHTML = max;
}

function setupColorbar(type, cbar) {
    "use strict";
    var stops;

    if (type === 'diverging') { // "Red-White-Blue" Colorbar
        stops = [
            [cbar[0],  '#67001f'],
            [cbar[1],  '#850c1e'],
            [cbar[2],  '#a3201d'],
            [cbar[3],  '#bd361c'],
            [cbar[4],  '#d2501d'],
            [cbar[5],  '#df6e22'],
            [cbar[6],  '#e88e30'],
            [cbar[7],  '#f0aa49'],
            [cbar[8],  '#f7c670'],
            [cbar[9],  '#fde1a6'],
            [cbar[10], '#fafafa'],
            [cbar[11], '#b7edf8'],
            [cbar[12], '#91d8f8'],
            [cbar[13], '#74bff9'],
            [cbar[14], '#5ea6f9'],
            [cbar[15], '#498dfa'],
            [cbar[16], '#3172fa'],
            [cbar[17], '#175be9'],
            [cbar[18], '#114ac0'],
            [cbar[19], '#0c3c94'],
            [cbar[20], '#053061']
        ];
    } else { // "White-Red" Colorbar
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
    }

    return stops;
}

function getColorbarStops(type, max) {
    "use strict";
    var cbar = [], stops = [], i, iter_size, cbar_val;

    if (type === 'trend') {
        iter_size = max / 10.0;
        cbar_val = -max;
        for (i = 0; i <= 20; i += 1) {
            cbar.push(cbar_val);
            if (i % 2 === 0) {
                document.getElementById('cbar-t-l-' + String(i)).textContent = String(cbar_val.toFixed(1));
            }
            cbar_val += iter_size;
        }
        stops = setupColorbar('diverging', cbar);
    } else if (type === 'annual') {
        iter_size = max / 10.0;
        cbar_val = 0;
        for (i = 0; i <= 10; i += 1) {
            cbar.push(cbar_val);
            document.getElementById('cbar-a-l-' + String(i)).innerHTML = String(cbar_val.toFixed(1));
            cbar_val += iter_size;
        }
        stops = setupColorbar('sequential', cbar);
    } else {
        iter_size = max / 10.0;
        cbar_val = 0;
        for (i = 0; i <= 10; i += 1) {
            cbar.push(cbar_val);
            document.getElementById('cbar-r-l-' + String(i)).innerHTML = String(cbar_val.toFixed(1));
            cbar_val += iter_size;
        }
        stops = setupColorbar('sequential', cbar);
    }

    return stops;
}

function changeMapColorbar(map_type, map_max) {
    "use strict";
    var id = 'alti-' + map_type,
        units = '',
        cbar_stops;

    if (map_type === 'trend') {
        units = 't';
    } else if (map_type === 'annual') {
        units = 'a';
    } else if (map_type === 'rms') {
        units = 'r';
    }

    cbar_stops = getColorbarStops(map_type, map_max);

    map.setPaintProperty(id + '-coarse', 'fill-color', { property: units, stops: cbar_stops });
    map.setPaintProperty(id + '-fine', 'fill-color', { property: units, stops: cbar_stops });
}

function updateColorbarMap(max) {
    "use strict";
    changeMapColorbar(activeMap, max);
}

function hideColorbars() {
    "use strict";
    document.getElementById('trend-colorbar').style.display = 'none';
    document.getElementById('annual-colorbar').style.display = 'none';
    document.getElementById('rms-colorbar').style.display = 'none';
    document.getElementById('map-meta').style.display = 'none';
}

function showColorbar(id) {
    "use strict";
    if (id === 'alti-trend') {
        activeMap = 'trend';
        hideColorbars();
        changeMapColorbar(activeMap, 5);

        document.getElementById('trend-colorbar').style.display = 'inline-block';
        document.getElementById('map-meta').style.display = 'block';
        document.getElementById('colorbar-max-bounds').step = 0.1;
        document.getElementById('colorbar-max-bounds').max = 10.0;
        document.getElementById('colorbar-max-bounds').min = 0.1;
        document.getElementById('colorbar-max-bounds').value = 5;
        document.getElementById('cbar-max-set').innerHTML = 5;
    } else if (id === 'alti-annual') {
        activeMap = 'annual';
        hideColorbars();
        changeMapColorbar(activeMap, 25);

        document.getElementById('annual-colorbar').style.display = 'inline-block';
        document.getElementById('map-meta').style.display = 'block';
        document.getElementById('colorbar-max-bounds').step = 1;
        document.getElementById('colorbar-max-bounds').max = 100;
        document.getElementById('colorbar-max-bounds').min = 1;
        document.getElementById('colorbar-max-bounds').value = 25;
        document.getElementById('cbar-max-set').innerHTML = 25;
    } else if (id === 'alti-rms') {
        activeMap = 'rms';
        hideColorbars();
        changeMapColorbar(activeMap, 40);

        document.getElementById('rms-colorbar').style.display = 'inline-block';
        document.getElementById('map-meta').style.display = 'block';
        document.getElementById('colorbar-max-bounds').step = 1;
        document.getElementById('colorbar-max-bounds').max = 60;
        document.getElementById('colorbar-max-bounds').min = 1;
        document.getElementById('colorbar-max-bounds').value = 40;
        document.getElementById('cbar-max-set').innerHTML = 40;
    }
}
