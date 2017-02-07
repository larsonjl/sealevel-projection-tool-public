# -*- coding: utf-8 -*-
"""
This script contains the main functions for generating the
dictionary that is called by our sea level website when a
particular query is made.  It is *crucial* to update the reference
file and follow the database conventions for the raw data files
before running these functions.  

@author: jakelarson
"""

from netCDF4 import Dataset
import numpy as np
import pandas as pd
from glob import glob
import pickle
import scipy.ndimage

bothMasks = pickle.load(open('./referenceFiles/webGridMasks.pkl', "rb"))
oneDegreeMask = np.array(bothMasks['oneDeg']).astype(bool)
twoDegreeMask = np.array(bothMasks['twoDeg']).astype(bool)


def grid2db(ncfile, variable):
    '''This function takes in a netCDF file and a given variable name and
    outputs data vectors in accordance with the indexing standard established
    for the sea level projection website.  Data is assumed to be one a
    one degree grid and of the dimension (time x lat x lon).  Returns a 
    numpy array (type: 16byte float)
    '''
    # Load in requested variable
    dFile = Dataset(ncfile)
    varGrid = dFile.variables[variable][:]
    
    # Need to take care of switching from 0-360 to -180 to 180
    a = varGrid[:, :, 0:180]
    b = varGrid[:, :, 180:360]
    varGrid = np.dstack((b, a))

    #  Make 2deg version of grid using bilinear interpolation, apply mask
    twoDegGrid = np.ones((varGrid.shape[0], 90, 180)) * np.nan
    for i in range(0, varGrid.shape[0]):
        twoDegGrid[i, :, :] = scipy.ndimage.zoom(
                                  varGrid[i, :, :], 0.5, order=1)
    
    twoDegGrid = np.reshape(twoDegGrid, (twoDegGrid.shape[0], (90 * 180)))
    twoDegGridOut = (twoDegGrid[:, twoDegreeMask]).astype('float16').data

    #  Apply mask to 1 degree data
    oneDegGridOut = np.reshape(varGrid, (varGrid.shape[0], (180*360)))
    oneDegGridOut = (oneDegGridOut[:, oneDegreeMask]).astype('float16').data

    dataOut = np.hstack((oneDegGridOut, twoDegGridOut))
    dataOut[dataOut == np.inf] = -999

    return dataOut


def referenceFile2Pickles():
    '''Here we use our reference file and the individual projection
    files in our database to generate a dictionary that contains
    all of the projections, already masked, with a mask value of
    -999.  This dictionary is pickled and will be loaded into memory
    when our server is initiated.'''
    masterDict = {'rcp85': {}, 'rcp45': {}, 'rcp26': {}}
    refFile = pd.read_csv('./referenceFiles/dataReferenceFile.csv')
    for indx in refFile.index:
        dFile = refFile.iloc[indx]
        dataSetString = './' + dFile.Scenario + '/' + dFile.component +\
                        '/' + dFile.meta + '/' + dFile.rawFile
        dataArray = grid2db(dataSetString, dFile.variableName)
        masterDict[dFile.Scenario][dFile.referenceName] = dataArray

    masterDictOut = open('dataForWebsite.pkl', 'wb')
    pickle.dump(masterDict, masterDictOut)
    masterDictOut.close()

referenceFile2Pickles()
