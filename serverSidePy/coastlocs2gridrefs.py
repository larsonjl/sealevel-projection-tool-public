'''
Here we take in the coastal location scatter points generated from coast .shp
file and we find the nearest grid cells in our 1deg ocean data and the VCM
data that correspond to these points.

'''

import json
import numpy as np
import scipy.io as sio

# Load in json file with coastal locs
dfile = './data/coast/coastScatter.json'  # file generated by coast2scatter.py
with open(dfile) as data_file:
    data = json.load(data_file)

# Load in vertical crustal motion dataset
vcm_file = './data/vcm/GlobalVLMForJake_quarterdegree.mat'
vcm_data = sio.loadmat(vcm_file)
vcm_locs = {'lons': vcm_data['LONI'][0, :],
            'lats': vcm_data['LATI'][:, 0]}

def latlon2gridcell(in_lon, in_lat, gridlon_min, gridlat_min, resolution):
    cell_lat = (1 / resolution) * (np.floor(in_lat) - gridlat_min) + \
                    np.round((in_lat - np.floor(in_lat)) / resolution) 
    cell_lon = (1 / resolution) * (np.floor(in_lon) - gridlon_min) + \
                    np.round((in_lon - np.floor(in_lon)) / resolution)
    return int(cell_lon), int(cell_lat)


def look_at_neighbors(indx_lon, indx_lat):
    locGrid = vcm_data['VU'][indx_lat - 1:indx_lat + 2, 
                              indx_lon - 1: indx_lon + 2]
    
    #  If neighbors have defined values, take mean of those neigbors
    if np.sum(np.isfinite(locGrid)) > 0:
        vcm = np.nansum(locGrid) / np.sum(np.isfinite(locGrid))
    
    #  If neighbors dont have defined values, look another grid cell out
    else:
        locGrid = vcm_data['VU'][indx_lat - 2:indx_lat + 3, 
                              indx_lon - 2: indx_lon + 3]
        
        if np.sum(np.isfinite(locGrid)) > 0:
            vcm = np.nansum(locGrid) / np.sum(np.isfinite(locGrid))
        else:
            vcm = np.nan
    
    return vcm

tot_locs = 0
tot_nans = 0
j = 0
for i in range(len(data['features'])):
    lon_loc, lat_loc = data['features'][i]['geometry']['coordinates']
    indx_lon, indx_lat = latlon2gridcell(lon_loc, lat_loc, 
                                     -180, -90, 0.25)
    vcm_out = vcm_data['VU'][indx_lat, indx_lon]
    
    # if no value is defined at grid cell, look around at neighbors
    if np.isnan(vcm_out):
        if (indx_lon > 1) & (indx_lon + 1 < len(vcm_locs['lons'])) & \
            (indx_lat > 1) & (indx_lat + 1 < len(vcm_locs['lats'])):
            vcm_out = look_at_neighbors(indx_lon, indx_lat)
        else:
            vcm_out = np.nan

    if np.isnan(vcm_out):
        data['features'][i]['properties']['data_index'] = j        
    else:
        data['features'][i]['properties']['vcm_mmyr'] = vcm_out
        data['features'][i]['properties']['data_index'] = j
    j += 1

with open('coastLocsVCM.geojson', 'w') as outfile:
    outfile.write('var coastLocs = ' +json.dumps(data, separators=(',', ':')))
            
            
with open('./data/coast/coastLocsRef.json', 'w') as outfile:
    outfile.write(json.dumps(data, separators=(',', ':')))
            
            
                     
            
    