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
	scaleBy = (1/100.) //mm to cm
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
	    queryString = document.querySelector('input[name="rcpMenuSelect"]:checked').value + '_' + '60'
	    for (elements in databaseString){
	        if (databaseString[elements]!=='none'){
	            queryString+= ('_' + databaseString[elements])
	        }
	    }
	}
	return queryString
};


// On 'make projection' click, query data and display
$('#runProject').click(function(){
	defaultMap = 'false';
    queryString = constructQueryArray();
    $.get(apiLoc + "/projection_api?datastring=" + queryString, function(data, status){
				datasetIn = data
				changeGridDat(data['gridData'], data['cLims']);
        map.getSource('twoDegreeData').setData(twoDegGrid);
        map.getSource('oneDegreeData').setData(oneDegGrid);
		var currentYear = document.getElementById('year-selected').innerHTML
        loadCustomLayers();
		updateMapYear(Number(currentYear));
		maximizePlot();
		plotFillProjection(data['timeSeries'], 'Global Mean Projection');
		changeProjectionName();
    });
});

function removeLoadMenu(){
	document.getElementById('load-menu').style.display = 'none'
}

function loadDefaultMap(){
	$.get(apiLoc + "/projection_api?datastring=" + defaultQueryString, function(data, status){
				changeGridDat(data['gridData'], data['cLims']);
        map.getSource('twoDegreeData').setData(twoDegGrid);
        map.getSource('oneDegreeData').setData(oneDegGrid);
        loadCustomLayers();
		//If selected land... else...
		if (data['timeSeries'].hasOwnProperty('locTS')){
			scrollPopup = document.getElementById('error-popup');
            scrollPopup.style.zIndex = 5000;
            scrollPopup.style.transition = "opacity 1s";
            scrollPopup.style.opacity = 1;
            setTimeout(function () {
                scrollPopup.style.opacity = 0;
                scrollPopup.style.zIndex = 0;
            }, 3000);
		}
		else{
			plotFillProjection(data['timeSeries'], 'Global Mean Projection');
			maximizePlot();
			minimizePlot();}
    });
	// map.getLayer('oneDeg2100').on("tileload", removeLoadMenu())
}

function loadWaiter() {
  if (!$("#main-container").size()) {
	window.requestAnimationFrame(loadWaiter);
  		}else {
	 removeLoadMenu();
	 console.log("Content loaded")
   }
};

function changeProjectionName(){
	document.getElementById('projection-name-val').innerHTML = rcpMenu + ' custom'
}
