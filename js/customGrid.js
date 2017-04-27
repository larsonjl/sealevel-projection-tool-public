// Construct initial two degree geojson grid
function makeTwoDegGrid() {
	"use strict";
	twoDegGrid = {};
	twoDegGrid['type'] = 'FeatureCollection';
	twoDegGrid['features'] = [];
	var i = 0
	for (var lat = -89; lat <= 89; lat+=2) {
		for (var lon = -179; lon <= 179; lon +=2){
			if (twoDegMask[i] === 1){
				var newFeature = {
					"type": "Feature",
					"geometry": {
						"type": "Polygon",
						"coordinates": [[[lon-1, lat-1], [lon-1, lat+1],
										[lon+1, lat+1], [lon+1,lat-1], [lon-1,lat-1]]]
					},
					"properties": {
						"sl2025": -999,
						"sl2050": -999,
						"sl2075": -999,
						"sl2100": -999
					}
				}
				twoDegGrid['features'].push(newFeature);
			 	}
			i+=1
		}
	}
}

// Construct initial one degree geojson grid
function makeOneDegGrid() {
	"use strict";
	oneDegGrid = {};
	oneDegGrid['type'] = 'FeatureCollection';
	oneDegGrid['features'] = [];
	var i = 0
	for (var lat = -89.5; lat <= 89.5; lat++) {
		for (var lon = -179.5; lon<= 179.5; lon ++){
			if (oneDegMask[i] === 1){
				var newFeature = {
					"type": "Feature",
					"geometry": {
						"type": "Polygon",
						"coordinates": [[[lon-0.5, lat-0.5], [lon-0.5, lat+0.5],
										[lon+0.5, lat+0.5], [lon+0.5,lat-0.5], [lon-0.5,lat-0.5]]]
					},
					"properties": {
						"sl2025": -999,
						"sl2050": -999,
						"sl2075": -999,
						"sl2100": -999
					}
				}
				oneDegGrid['features'].push(newFeature);
				}
				i+=1
			}
	}
};

// Change geojson data values to queried data
var scaleBy;
function changeGridDat(queriedData, cbarLims){
	"use strict";
	scaleBy = (1/10.) //mm to cm
	dMax = cbarLims[1] * scaleBy + 5
	dMin = cbarLims[0] * scaleBy

	// Loop through features, assign data to proper grid cells and properties
	var j = 0
	var oneDegFeatures = oneDegGrid['features']
	var twoDegFeatures = twoDegGrid['features']

	for (var i = 0, len = oneDegFeatures.length; i < len; i++){
		oneDegGrid['features'][i].properties.sl2025 = scaleBy * queriedData[0][j]
		oneDegGrid['features'][i].properties.sl2050 = scaleBy * queriedData[1][j]
		oneDegGrid['features'][i].properties.sl2075 = scaleBy * queriedData[2][j]
		oneDegGrid['features'][i].properties.sl2100 = scaleBy * queriedData[3][j]
		j+=1
	}
	for (var i = 0, len = twoDegFeatures.length; i < len; i++){
		twoDegGrid['features'][i].properties.sl2025 = scaleBy * queriedData[0][j]
		twoDegGrid['features'][i].properties.sl2050 = scaleBy * queriedData[1][j]
		twoDegGrid['features'][i].properties.sl2075 = scaleBy * queriedData[2][j]
		twoDegGrid['features'][i].properties.sl2100 = scaleBy * queriedData[3][j]
		j+=1
	}

	document.getElementById('spectral' + '-colorbar').style.display = 'inline-block';
	document.getElementById('map-cbar-container').style.display = 'block';
	document.getElementById('year-select-container').style.display = 'block';
};


var scaleBy;
// Used to change values default values of coast data to queried data from server
function changeCoastData(queriedData, cbarLims){
	"use strict";
	scaleBy = (1/10.) //mm to cm
	// Loop through features, assign data to proper grid cells and properties
	var i = 0
	var coastFeatures = coastLocs['features']
	for (var features in coastFeatures){
		var vlm = - scaleBy * coastLocs['features'][features]['properties']['vcm_mmyr']
		if (isNaN(vlm)){
			vlm = -999999.
		}
		// var vlm = 0
		coastLocs['features'][features].properties.sl2025 = scaleBy * queriedData[0][i] + 10 * vlm
		coastLocs['features'][features].properties.sl2050 = scaleBy * queriedData[1][i] + 35 * vlm
		coastLocs['features'][features].properties.sl2075 = scaleBy * queriedData[2][i] + 60 * vlm
		coastLocs['features'][features].properties.sl2100 = scaleBy * queriedData[3][i] + 85 * vlm
		i+=1
	};

	// If only VLM plotted
	if (cbarLims[0] + cbarLims[1] === 0){
		cbarLims[1] = 250
		cbarLims[0] = -500
	}

	dMax = cbarLims[1] * scaleBy + 5
	dMin = cbarLims[0] * scaleBy

	document.getElementById('spectral' + '-colorbar').style.display = 'inline-block';
	document.getElementById('map-cbar-container').style.display = 'block';
	document.getElementById('year-select-container').style.display = 'block';
};

// Constructs string that is sent to the server based on user selections
function updateQueryString(){
	"use strict";
	console.log("update query")
	rcpScenario = document.querySelector('input[name="rcpBasicSelect"]:checked').value;
	if (defaultMap == 'true'){
		queryString = rcpScenario + standardQueryString
	}
	else{
	   var databaseString = [gsmbMenu.value, gdynMenu.value,
	                     adynMenu.value, asmbMenu.value, thermoMenu.value,
	                     glacierMenu.value, giaMenu.value]
	    queryString = rcpScenario + '_' + '60'
	    for (var elements in databaseString){
	        if (databaseString[elements]!=='none'){
	            queryString+= ('_' + databaseString[elements])
	        }
	    }
	}
};

// Queries and loads grid data
function loadMap(version, update){
	"use strict";
	if (update === 'true') {
		updateQueryString();
		console.log("updated")
	}
	$.get(apiLoc + "projection_api?datastring=" + queryString, function(data, status){
				changeGridDat(data['gridData'], data['cLims']);
        map.getSource('twoDegreeData').setData(twoDegGrid);
        map.getSource('oneDegreeData').setData(oneDegGrid);
		var currentYear = document.getElementById('display-year').value
        loadGridLayers();
		plotFillProjection(data['timeSeries'], -999, 'Global Mean Absolute Sea Level Projection');
		maximizePlot();
		minimizePlot();
		updateMapYear();
		removeLoadMenu();
		if (version === 'custom'){
			changeProjectionName();
		}
		else{
			changeBasicProjectionName();
		}
    });
};

// Queries and loads relative SL data
function loadRelSL(update){
	"use strict";
	if (update === 'true'){
		updateQueryString();
		console.log("Updates here too...")
	}
	$.get(apiLoc + "projection_api?relativeSL="  + queryString, function(data, status){
				changeCoastData(data['pointData'], data['cLims']);
		map.getSource('coastScatter').setData(coastLocs);
		loadCustomRelative();
		changeBasicProjectionName();
		updateMapYear();
	});
};

function changeProjectionName(){
	"use strict";
	var rcpScen = document.querySelector('input[name="rcpMenuSelect"]:checked').value;
	document.getElementById('projection-name-val').innerHTML = '<b>Current Projection: </b>' + rcpScen.toUpperCase() + ' custom'
}

function changeBasicProjectionName(){
	"use strict";
	var rcpScen = document.querySelector('input[name="rcpBasicSelect"]:checked').value;
	document.getElementById('projection-name-val').innerHTML = '<b>Current Projection: </b>' + rcpScen.toUpperCase() + ' Median'
}
