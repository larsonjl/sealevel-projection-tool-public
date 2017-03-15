# -*- coding: utf-8 -*-
"""
Created on Thu Feb  2 13:52:56 2017

Creates .js variables for the masks used for both our 1degree and
2 degree grids. 0 is landd.

@author: jakelarson
"""

import numpy as np
import json
from mpl_toolkits.basemap import Basemap
import pickle
import scipy.ndimage

map = Basemap(projection='merc', resolution='c', area_thresh=100000.)

# Create 2 degree grid (same as website)
mask2deg = np.zeros((90, 180))
mask1deg = np.zeros((180, 360))

lats1deg = np.arange(-89.5, 89.5, 1)
lons1deg = np.arange(-179.5, 180.5, 1)
# Create initial 1 degree mask based on center of pixel
for i in range(len(lats1deg)):
    for j in range(len(lons1deg)):
        x, y = map(lons1deg[j], lats1deg[i])
        mask1deg[i, j] = not int(map.is_land(x, y))


mask1degInland = np.zeros((180, 360))
# Take initial 1 deg mask, propagate in 1 pixel towards land (for visual display)
for i in range(1, len(lats1deg)-1):
    for j in range(1, len(lons1deg)-1):
        if mask1deg[i, j] == 0:
            aroundSum = sum(sum(mask1deg[i-1:i+2, j-1:j+2]))
            if aroundSum > 0:
                mask1degInland[i,j] = 1
            else:
                mask1degInland[i,j] = 0
        else:
            mask1degInland[i,j] = 1

# Interpolate mask onto 2deg grid
twoDegMask = scipy.ndimage.zoom(maskInland, 0.5, order=1)
twoDegMask[twoDegMask > 0] = 1

mask1degOut = np.reshape(mask1degInland, ((180*360)))
twoDegMaskOut = np.reshape(twoDegMask, ((90*180)))

# Output mask array as pickle for easy masking when generating
# database files
maskDict = {'oneDeg': mask1degOut, 'twoDeg': twoDegMaskOut}
maskOut = open('webGridMasks.pkl', 'wb')
pickle.dump(maskDict, maskOut)
maskOut.close()

# Output mask arrays as json variable for website loading
mask1deg = [int(x) for x in mask1degOut.tolist()]
mask2deg = [int(x) for x in twoDegMaskOut.tolist()]

with open('twoDegreeMask.json', 'w') as outfile:
   outfile.write('var twoDegMask = ' +json.dumps(mask2deg, separators=(',', ':')))

with open('oneDegreeMask.json', 'w') as outfile:
    outfile.write('var oneDegMask = ' + json.dumps(mask1deg, separators=(',', ':')))