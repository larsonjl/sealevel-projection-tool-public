// Construct initial two degree geojson grid
function makeTwoDegGrid() {
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
	oneDegGrid = {};
	oneDegGrid['type'] = 'FeatureCollection';
	oneDegGrid['features'] = [];
	i = 0
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

var scaleBy
// Change geojson data values to queried data
function changeGridDat(queriedData, cbarLims){
	scaleBy = (1/10.) //mm to cm
	dMax = cbarLims[1] * scaleBy + 5
	dMin = cbarLims[0] * scaleBy

	// Loop through features, assign data to proper grid cells and properties
	var i = 0
	var oneDegFeatures = oneDegGrid['features']
	var twoDegFeatures = twoDegGrid['features']

	for (features in oneDegFeatures){
		oneDegGrid['features'][features].properties.sl2025 = scaleBy * queriedData[0][i]
		oneDegGrid['features'][features].properties.sl2050 = scaleBy * queriedData[1][i]
		oneDegGrid['features'][features].properties.sl2075 = scaleBy * queriedData[2][i]
		oneDegGrid['features'][features].properties.sl2100 = scaleBy * queriedData[3][i]
		i+=1
	}
	for (features in twoDegFeatures){
		twoDegGrid['features'][features].properties.sl2025 = scaleBy * queriedData[0][i]
		twoDegGrid['features'][features].properties.sl2050 = scaleBy * queriedData[1][i]
		twoDegGrid['features'][features].properties.sl2075 = scaleBy * queriedData[2][i]
		twoDegGrid['features'][features].properties.sl2100 = scaleBy * queriedData[3][i]
		i+=1
		}

	document.getElementById('spectral' + '-colorbar').style.display = 'inline-block';
	document.getElementById('map-cbar-container').style.display = 'block';
	document.getElementById('year-select-container').style.display = 'block';
};

// Constructs string that is sent to the server based on user selections
function constructQueryArray(){
	if (defaultMap == 'true'){
		queryString = defaultQueryString
	}
	else{
	   databaseString = [gsmbMenu.value, gdynMenu.value,
	                     adynMenu.value, asmbMenu.value, thermoMenu.value,
	                     glacierMenu.value]
	    queryString = '_' + '60'
	    for (elements in databaseString){
	        if (databaseString[elements]!=='none'){
	            queryString+= ('_' + databaseString[elements])
	        }
	    }
	}
	return queryString
};


function loadDefaultMap(){
	$.get(apiLoc + "/projection_api?datastring=rcp85" + defaultQueryString, function(data, status){
				changeGridDat(data['gridData'], data['cLims']);
        map.getSource('twoDegreeData').setData(twoDegGrid);
        map.getSource('oneDegreeData').setData(oneDegGrid);
        loadCustomLayers();
		plotFillProjection(data['timeSeries'], 'Global Mean Absolute Sea Level Projection');
		maximizePlot();
		rcpScenario = document.querySelector('input[name="rcpBasicSelect"]:checked').value;
    });
}

function loadBasicProjection(rcpScenario){
	$.get(apiLoc + "/projection_api?datastring=" +rcpScenario + defaultQueryString, function(data, status){
				changeGridDat(data['gridData'], data['cLims']);
        map.getSource('twoDegreeData').setData(twoDegGrid);
        map.getSource('oneDegreeData').setData(oneDegGrid);
        loadCustomLayers();
		var currentYear = document.getElementById('colorbar-max-bounds').value;
		updateMapYear(Number(currentYear));
		plotFillProjection(data['timeSeries'], 'Global Mean Absolute Sea Level Projection');
		maximizePlot();
    });
}

function changeProjectionName(){
	var rcpScen = document.querySelector('input[name="rcpMenuSelect"]:checked').value;
	document.getElementById('projection-name-val').innerHTML = rcpScen + ' custom'
}

function changeBasicProjectionName(){
	var rcpScen = document.querySelector('input[name="rcpBasicSelect"]:checked').value;
	document.getElementById('projection-name-val').innerHTML = rcpScen.toUpperCase() + ' IPCC AR5 (Median)'
}

// On 'make projection' click, query data and display
$('#runProject').click(function(){
	defaultMap = 'false';
    queryString = constructQueryArray();
    $.get(apiLoc + "/projection_api?datastring=" + rcpScenario + queryString, function(data, status){
				datasetIn = data
				changeGridDat(data['gridData'], data['cLims']);
        map.getSource('twoDegreeData').setData(twoDegGrid);
        map.getSource('oneDegreeData').setData(oneDegGrid);
		var currentYear = document.getElementById('colorbar-max-bounds').value
        loadCustomLayers();
		updateMapYear(Number(currentYear));
		plotFillProjection(data['timeSeries'], 'Global Mean Absolute Sea Level Projection');
		maximizePlot();
		changeProjectionName();
		rcpScenario = document.querySelector('input[name="rcpBasicSelect"]:checked').value;
    });
});

// On 'make basic projection' click, query data and display
$('#runBasicProject').click(function(){
	defaultMap = 'true';
	var currentYear = document.getElementById('colorbar-max-bounds').value
	var rcpScen = document.querySelector('input[name="rcpBasicSelect"]:checked').value;
	loadBasicProjection(rcpScen);
	changeBasicProjectionName();
	rcpScenario = document.querySelector('input[name="rcpBasicSelect"]:checked').value;
	queryString = defaultQueryString;
});
