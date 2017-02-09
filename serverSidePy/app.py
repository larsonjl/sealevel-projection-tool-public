#!flask/bin/python
from flask import Flask, request, jsonify
from flask.json import JSONEncoder
import pickle
import numpy as np


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
    # References [18,44,69,93] refer to 2025, 2050, 2075, 2100
    for datasets in params[2::]:
        dOut += projDict[0][rcpScen][datasets][[18, 44, 69, 93], :]
        tsData[datasets] = (projDict[1][rcpScen][datasets]) \
                                    .astype('float16').tolist()
    dOut = dOut.astype('float16')
    dMin = np.float16(np.min(dOut[dOut > -10]))
    dMax = np.float16(np.max(dOut))
    output = {'cLims': [float(dMin), float(dMax)], 'gridData': dOut.tolist(),
              'timeSeries': tsData}

    return output


# Load projection data into memory
projDict = pickle.load(open('dataForWebsite.pkl', "rb"))


# Start Flask
app = Flask(__name__)
app.json_encoder = MiniJSONEncoder
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False


@app.route('/myAPI')
def api_hello():
    if 'datastring' in request.args:
        return jsonify(createDatasetMultiYear(request.args['datastring']))

if __name__ == '__main__':
    app.run(debug=True)
