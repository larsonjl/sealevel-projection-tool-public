# Summary of scripts

## app.js contains:
* jquery listeners for data querying on click of 'basic projection' and 'advanced projection'
* jquery listener for mode switch (i.e. relative, absolute, crustal)
* Many functions for dragging, resizing, minimizing, maximizing the svg container for the location time series
* viewSidebar() - Collapsing / opening sidebar
* viewCustomSettings() - Opens / collapses custom settings menu
* viewBasicSettings() - Opens / collapses basic settings menu
* addLoadMenu() - adds data loading menu
* removeLoadMenu() - removes data loading menu
* loadApp() - This is an important one. It calls a bunch of functions on the page load. Initializes mapbox map, constructs the one / two degree geojson grids, adds a bunch of html listeners, loads in the sidebar names

## customGrid.js contains:
* makeTwoDegGrid() - Constructs two degree geojson grid based on twoDegreeMask.json
* makeOneDegGrid() - constructs one degree geojson grid based on oneDegreeMask.json
* changeGridData(queriedData, cbarLims) - Changes geojson grid data values to data queried from api.  
* changeCoastData(queriedData, cbarLims) - Used to change values of coast data to queried data from server
* updateQueryString() - Constructs string that is sent to the server based on user selections. This is pretty important.  Basically every dataset in the sidebar pulldown menus have a reference name associated with it (i.e. "ash1", "gdh1", etc...).  These are the keys that are sent to the server to tell it which datasets to add together and send back.
* loadMap(version, update) - Queries and loads grid data
* loadRelSL(update) -  Queries and loads coastal data
* changeProjectionName() - Changes name of projection shown up in upper left window of the UI
* changeBasicProjectionName() - Changes name of projection shown up in upper left window of the UI

## mapcontrol-colormap.js contains:
*  This is a bunch of stuff taken from the ccar altimetry explorer source code for generating colormaps.  Only a little bit of this is currently used by the projection app

## mapcontrol.js contains:
* checkForNans(data) - Used by queryTimeseries(e) to see if there are any NaN values in the queried data and to not plot them in the time series if true.
* queryTimeseries(e) - This is triggered by a listener and is used to query the time series data based on a grdi location click within the map.
* queryCoastLoc(indxNum, vcm, loc) - This is used to query and plot time series for the relative SL projections.
* updateMapYear() - When the user selects a different year to display in the map, this function changes the layers to correspond to that.
* coastHover(e) - Controls the hover sizing of the coastal data
* clickDecider(e, status) - Decides what to do on user click.  Either runs  queryTimeseries(e), queryCoastLoc(indxNum, vcm, loc), or does nothing
* initializeMap() - initializeMap :: loads background and interactive maps and starts page listeners.

## sidebarOptions.js contains:
* setSidebarOptions() - Calls getHtmlOptions() and creates the sidebar dropdown menus based off the sidebarOptions.js file
* getHtmlOptions(rcp, component) - Creates sidebar dropdown menus and also ties the reference name for each data set to the dropdown option. These reference names are what are strung together by customGrid.js/updateQueryString() to eventually be sent to the server.  
* turnOptionsOn(), turnOptionsToNone(), unfreezeAllOptions(), freezeAllOptions() - These are no longer used by the site but could be used again in the future.  They are fairly self explanatory.
* removeOptionMenu() - When coastal location mode is selected, this function sets the display of all the sidebar options except for crustal motion to 'none'.  
* restoreOptionMenu() - Brings back the sidebar options when not in crustal motion mode
* There are three listeners here as well that link the rcp scenarios in the basic menu to the rcp scenarios in the advanced menu.

## mapLayerManagement.js:
* This is used to add all of the map data sources and layers.  All functions here are well commented and fairly intuitive.

## projPlot.js:
* Some semi-hacked together d3 to create the projection fill time series
