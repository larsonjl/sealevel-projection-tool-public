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
* 
