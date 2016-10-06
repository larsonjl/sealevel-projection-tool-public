// addTideGauges :: Loads Tide Gauge Icons to Map.
function loadTideGauges() {
    "use strict";
    map.addSource("tide_gauges", {
        "type": "geojson",
        "data": gauges
    });

    map.addLayer({
        "id": "gauges",
        "type": "circle",
        "source": "tide_gauges",
        "paint": {
            "circle-radius": 4,
            "circle-color": "#000000",
            'circle-opacity': 0.5
        },
        'layout': {
            'visibility': 'none'
        }
    });

    map.addLayer({
        "id": "gauges-hover",
        "type": "circle",
        "source": "tide_gauges",
        "paint": {
            "circle-radius": 6,
            "circle-color": "#000000",
            "circle-opacity": 1
        },
        "layout": {},
        "filter": ["==", "name", ""]
    });

    map.addLayer({
        "id": "gauges-label",
        "type": "symbol",
        "source": "tide_gauges",
        "layout": {
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, -2],
            "text-anchor": "top"
        },
        "filter": ["==", "name", ""]
    });

    tideGaugeInteractions();
}

// tideGaugeInteractions :: Manage tide gauge mouse-over and click/zoom
function tideGaugeInteractions() {
    "use strict";
    // On mouseover of a tide gauge, show larger icon and label
    map.on("mousemove", function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["gauges"] });
        if (features.length) {
            map.setFilter("gauges-hover", ["==", "code", features[0].properties.code]);
            map.setFilter("gauges-label", ["==", "code", features[0].properties.code]);
        } else {
            map.setFilter("gauges-hover", ["==", "code", ""]);
            map.setFilter("gauges-label", ["==", "code", ""]);
        }
    });

    // Reset the route-hover layer's filter when the mouse leaves the map
    map.on("mouseout", function () {
        map.setFilter("gauges-hover", ["==", "name", ""]);
    });

    // Change circle size with zoom for better viewing
    map.on('zoom', function () {
        map.setPaintProperty('gauges','circle-radius', (4 * (0.5 + map.getZoom() / 3)));
        map.setPaintProperty('gauges-hover', 'circle-radius', 1.5 * (4 * (0.5 + map.getZoom() / 3)));
    });

    // Make mouse a pointer when over a tide gauge
    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['gauges-hover'] });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });
}

function addTideGauges() {
    "use strict";
    map.setLayoutProperty('gauges', 'visibility', 'visible');
}

function removeTideGauges() {
    "use strict";
    map.setLayoutProperty('gauges', 'visibility', 'none');
}
