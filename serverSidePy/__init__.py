#!/usr/bin/python3
from flask import Flask, request, jsonify
from flask.json import JSONEncoder
import pickle
import numpy as np
import os

dataFile = os.path.join(os.path.dirname(__file__), 'dataForWebsite.pkl')
gridFile = os.path.join(os.path.dirname(__file__), 'maskRef.pkl')

# Class for json print so no spaces after comma
class MiniJSONEncoder(JSONEncoder):
    """Minify JSON output."""
    item_separator = ','
    key_separator = ':'

# TODO: cos latitude weighting for GMSL


# Takes in request string, does addition
def createDatasetMultiYear(requestString):
    params = requestString.split('_')
    rcpScen = params[0]
    dOut = np.zeros((4, 53584))
    tsData = {}
    # References [18,44,69,93] refer to 2025, 2050, 2075, 2100  8
    for datasets in params[2::]:
        dOut += projDict[0][rcpScen][datasets][[10, 35, 60, 85], :]
        tsData[datasets] = (projDict[1][rcpScen][datasets]) \
                            .astype('float16').tolist()
    dOut = dOut.astype('float16')
    dMean = np.mean(dOut[dOut>-10])
    dStd = np.std(dOut[dOut>-10])
    dMin = np.float16(dMean - 2*dStd)
    dMax = np.float16(dMean + dStd)
    # dMin = np.float16(np.min(dOut[dOut > -10]))  # min not masked value
    # dMax = np.float16(np.max(dOut))
    output = {'cLims': [float(dMin), float(dMax)], 'gridData': dOut.tolist(),
              'timeSeries': tsData}
    return output


def getGridCell(lat, lon):
    latRefs = np.arange(-89.5, 89.5, 1)
    lonRefs = np.arange(-179.5, 180.5, 1)
    indxLat = np.argmin(np.abs((latRefs - lat)))
    indxLon = np.argmin(np.abs(lonRefs - lon))
    return gridRef[indxLat, indxLon]


def getLocationData(requestString):
    params = requestString.split('_')
    lat = params[0]
    lon = params[1]
    rcpScen = params[2]
    cellNum = getGridCell(float(lat), float(lon))
    if np.isnan(cellNum):
        return {'locTS': 'masked'}
    else:
        dOut = {}
        for datasets in params[4::]:
            dOut[datasets] = (projDict[0][rcpScen][datasets][:, cellNum]
                              .astype('float16')).tolist()
        return dOut


# Load projection data into memory
projDict = pickle.load(open(dataFile, "rb"))
gridRef = pickle.load(open(gridFile, "rb"))

# Load grid cell reference file into memory


# Start Flask
app = Flask(__name__)
app.json_encoder = MiniJSONEncoder
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False


@app.route('/')
def api_hello():
    if 'datastring' in request.args:
        return jsonify(createDatasetMultiYear(request.args['datastring']))
    if 'latlonloc' in request.args:
        return jsonify(getLocationData(request.args['latlonloc']))

if __name__ == '__main__':
    app.run(debug=True)
