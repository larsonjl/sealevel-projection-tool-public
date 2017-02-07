# Server side database tools and structure

This folder is meant to illustrate how the datasets are constructed and indexed on the server side.


# Adding new data
The methods here were created to follow the data format distributed from IPCC AR5. This data is distributed on a 1 degree grid of shape (time, lat, lon).  The IPCC data is referenced to the year 2006, calculated annually, and extends
through the year 2100.  Latitude is (-90, 90), longitude is (0-360).  

To add a new data set, the formalities described above must be followed.  

Steps to add a new data file

* Interpolate new data onto 1deg, global grid.
* Ensure proper time dimension (Annual data from 2006-2100)
* If data is not available at a certain time or location, insert a NaN.  These cells will automatically be invalidated when loaded onto website.
* Save file as a netCDF4.  Dimension of projection component variable should be (94, 180, 360).  
* Put new netCDF4 file into proper folder within existing database structure.  
* Log file attributes and location into referenceFile.csv
* Run meta2json.py using updateed referenceFile.csv to create a new .js reference file for website. 
* Under the js folder on the web page, replace the old ref file with the file created from meta2json.py.  This will update selection fields on the website menu.
* Run generateDataVectors.py.  This will create a new data dictionary to be used server side.  
