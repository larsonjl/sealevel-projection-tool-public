# -*- coding: utf-8 -*-

# Script to create json file from metadata for sea level projection site

import json
import numpy as np
import pandas as pd

projectMeta = pd.read_csv('referenceFile.csv')
dataOut = {}
dataOut['RCP'] = {}
metaList = ['Lower Bound (p=0.05)', 'Median', 'Upper Bound (p=0.95)']

for scenarios in set(projectMeta['Scenario']):
    dataSlim = projectMeta[projectMeta['Scenario'] == scenarios]
    dataOut['RCP'][scenarios] = {}
    for components in set(dataSlim['component']):
        dataSlimmer = dataSlim[dataSlim['component'] == components]
        dataOut['RCP'][scenarios][components] = {}
        for titles in set(dataSlimmer['webTitle']):
            dataSlimmest = dataSlimmer[dataSlim['webTitle'] == titles]
            dataOut['RCP'][scenarios][components][titles] = {}
            for himedlo in metaList:
                dataOut['RCP'][scenarios][components][titles][himedlo] = {}

                dataSlimmestest = dataSlimmest[dataSlimmest['meta'] == himedlo]
                dataOut['RCP'][scenarios][components][titles][himedlo]['ref'] = \
                    dataSlimmestest.referenceName.values[0]

with open('referenceFile.js', 'w') as outfile:
    outfile.write('var sidebar = ')
    json.dump(dataOut, outfile, indent=2)
    outfile.write(';')
