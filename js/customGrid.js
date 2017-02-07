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

// Change geojson data values to queried data
function changeGridDat(queriedData){
	var scaleBy = 10 //mm to cm
	dMax = scaleBy * queriedData[1]
	dMin = scaleBy * queriedData[0]

	// Scale colorbars for better vis...arbitrary for now
	if (dMin < - 2) {
		dMin = - 2
	}
	dMax = dMax - 0.5

	// Loop through features, assign data to proper grid cells and properties
	var i = 2
	var oneDegFeatures = oneDegGrid['features']
	var twoDegFeatures = twoDegGrid['features']

	for (features in oneDegFeatures){
		oneDegGrid['features'][features].properties.sl2025 = scaleBy * queriedData[i]
		oneDegGrid['features'][features].properties.sl2050 = scaleBy * queriedData[i + 53584]
		oneDegGrid['features'][features].properties.sl2075 = scaleBy * queriedData[i + 2 * 53584]
		oneDegGrid['features'][features].properties.sl2100 = scaleBy * queriedData[i + 3 * 53584]
		i+=1
	}
	for (features in twoDegFeatures){
		twoDegGrid['features'][features].properties.sl2025 = scaleBy * queriedData[i]
		twoDegGrid['features'][features].properties.sl2050 = scaleBy * queriedData[i +  53584]
		twoDegGrid['features'][features].properties.sl2075 = scaleBy * queriedData[i + 2 * 53584]
		twoDegGrid['features'][features].properties.sl2100 = scaleBy * queriedData[i + 3 * 53584]
		i+=1
		}

	document.getElementById(activeColormap + '-colorbar').style.display = 'inline-block';
	document.getElementById('map-cbar-container').style.display = 'block';
};

// Constructs string that is sent to the server based on user selections
function constructQueryArray(){
   databaseString = [gsmbMenu.value, gdynMenu.value,
                     adynMenu.value, asmbMenu.value, thermoMenu.value,
                     glacierMenu.value]
    queryString = rcpMenu.value + '_' + '60'
    for (elements in databaseString){
        if (databaseString[elements]!=='none'){
            queryString+= ('_' + databaseString[elements])
        }
    }
	return queryString
};
