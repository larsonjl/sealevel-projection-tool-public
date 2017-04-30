# -*- coding: utf-8 -*-
"""
Created on Thu Feb  2 13:52:56 2017

Creates .js variables for the masks used for both our 1degree and
2 degree grids.  Value of 1 represents land.

@author: jakelarson
"""

import numpy as np
import json
from mpl_toolkits.basemap import Basemap
import pickle

map = Basemap(projection='merc', resolution='c', area_thresh=1000.)

# Create 2 degree grid (same as website)
mask2deg = np.zeros((90*180))
mask1deg = np.zeros((180*360))

i = 0
for lats in np.arange(-90, 90, 2):
    for lons in np.arange(-180, 180, 2):
        x, y = map(lons, lats)
        mask2deg[i] = not int(map.is_land(x, y))
        i += 1

i = 0
for lats in np.arange(-89.5, 89.5, 1):
    for lons in np.arange(-179.5, 180.5, 1):
        x, y = map(lons, lats)
        mask1deg[i] = not int(map.is_land(x, y))
        i += 1
    print(lats)


# Output mask array as pickle for easy masking when generating
# database files
maskDict = {'oneDeg': mask1deg, 'twoDeg': mask2deg}
maskOut = open('webGridMasks.pkl', 'wb')
pickle.dump(maskDict, maskOut)
maskOut.close()


# Output mask arrays as json variable for website loading
mask1deg = [int(x) for x in mask1deg.tolist()]
mask2deg = [int(x) for x in mask2deg.tolist()]

with open('../js/twoDegreeMask.json', 'w') as outfile:
   outfile.write('var twoDegMask = ' +json.dumps(mask2deg, separators=(',', ':')))

with open('../js/oneDegreeMask.json', 'w') as outfile:
    outfile.write('var oneDegMask = ' + json.dumps(mask1deg, separators=(',', ':')))
