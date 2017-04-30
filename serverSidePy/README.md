# Server side database tools and structure

This readme is meant to illustrate how the datasets are constructed and indexed on the server side.

# Adding new data
The methods here were created to follow the data format distributed from IPCC AR5. This data is distributed on a 1 degree grid of shape (time, lat, lon).  The raw IPCC data is referenced to the year 2006, calculated annually, and extends
through the year 2100.  Latitude is (-90, 90), longitude is (0-360).  

To add a new data set, the data formalities described above MUST be followed.  

Steps to add a new data file

* Interpolate new data onto 1deg, global grid.
* Ensure proper time dimension (Annual data from 2006-2100)
* If data is not available at a certain time or location, insert a NaN.  These cells will automatically be invalidated when loaded onto website.
* Save file as a netCDF4.  Dimension of projection component variable should be (94, 180, 360).  
* Put new netCDF4 file into proper folder within existing database structure. The structure should be rcpScenario > component > high / med/ low > dataFile.nc
* Log new file attributes into referenceFile.csv.  It is crucial that this is done properly as this file determines the sidebar names shown on the website.
* referenceFile.csv header explanations: **Scenario** = rcp scenarion, component = component of the sea level equation, **meta** = folder under rcp scenario (i.e. high, med, low), **rawFile** = fileName.nc, **referenceName** = unique identifier for dataset (used to reference that data set on server when user queries it from the UI), **webTitle** = old field (not needed),	**variableName** = variable name in netCDF file, **webName** = name to show the variable under on the website, **default** = whether this dataset is the default one on load.
* Run meta2json.py using updateed referenceFile.csv to create a new .js reference file for website.  This will automaticall update the file under the /js folder
* Run generateDataVectors.py.  This will create a new data dictionary to be used server side.
* The server may need to be restarted to reflect the changes in the data .pkl files.  


# Explanation of files in this folder
* **\__init__.py**: This is the flask API. Not much to say about this...it loads the pickled data files into memory and adds them / serves them up upon query.  
* **coastlocs2gridrefs.py**: Here we take in the coastal location scatter points generated from coast .shp file and we find the nearest grid cells in our 1deg ocean data and the VCM data that correspond to these points. This is used to link the ocean cells and land cells to provide a relative sea level projection at the coast. The script to generate the coastal location scatter points (coastScatter.json) is currently not included here.  
* **generateDataVectors.py**: This is a really important script.  This is used to generate the .pkl files loaded up by the server.  It really depends strongly on referenceFile.csv so make sure to update this before running!! All the functions are pretty well commented in here.  If you are looking to generate a new database file, this is the place to look.  Just find the function you are looking for and run it...
* **generateMask.py**: These masks are the glue that keep our client and server properly communicating the indices/geolocation of the data being sent. Understanding how this works may be the most confusing part of the API/UI interface but the way its engineered allows us to really cut down on the amount of data sent to the client. This generateMask.py script uses basemap to create 1 and 2 degree masks based on whether the center of a given grid cell is on land or not. When this is run it creates a file webGridMasks.pkl which is used by generateDataVectors.py to create the .pkl files used by our  flask server.  Two json files are also generated (oneDegreeMask.json and twoDegreeMask.json).  These are sent to the client immediately on page load.  Once the client receives these files, a geojson grid and a new mapbox source/layer are generated in their browser which is then populated with the grid data sent by the API.  This design allows us to not have to send over an entire geojson grid to the client on page load cutting down on page load time.  Mapbox layers or .mbtiles files are not sent to the client because it is impossible for us to precompute all the possible combinations of data queried by the user.  Instead, every query will ask the server to query and compute a vector of irregular data based on the clients requests which is sent to the client to populate the irregular grid that the client has generated.  This was the fastest method for displaying custom queried grid data that I tried.
* **meta2json.py**: This script generates js/sidebarReference.js.  This is used to update the sidebar options after referenceFile.csv is updated.  This  js/sidebarReference.js file determines the names of the fields queried in the UI sidebar as well as which names are the default on page load.
* **projection_api.wsgi**:  Don't touch this
* **maskRef.pkl**: Because our data is stored in a somewhat irregular manner, (i.e. we simply do not include grid cells over land) we must construct a reference file for determining the grid number for a given lat/lon location.  This is used only when the user requests the time series projection for a particular location.  This should only ever need to be run once.
