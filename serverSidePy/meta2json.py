# -*- coding: utf-8 -*-

# Script to create json file from metadata for sea level projection site

import json
import pandas as pd

projectMeta = pd.read_csv('referenceFile.csv')
dataOut = {}
dataOut['RCP'] = {}
metaList = ['low', 'medium', 'high']

for scenarios in set(projectMeta['Scenario']):
    dataSlim = projectMeta[projectMeta['Scenario'] == scenarios]
    dataOut['RCP'][scenarios] = {}
    for components in set(dataSlim['component']):
        dataSlimmer = dataSlim[dataSlim['component'] == components]
        dataOut['RCP'][scenarios][components] = {}
        for titles in set(dataSlimmer['webTitle']):
            dataSlimmest = dataSlimmer[dataSlim['webTitle'] == titles]
            dataOut['RCP'][scenarios][components][titles] = {}
            for himedlo in dataSlimmest['webName']:
                dataOut['RCP'][scenarios][components][titles][himedlo] = {}

                dataSlimmestest = dataSlimmest[dataSlimmest['webName'] == himedlo]
                dataOut['RCP'][scenarios][components][titles][himedlo]['ref'] = \
                    dataSlimmestest.referenceName.values[0]
                dataOut['RCP'][scenarios][components][titles][himedlo]['default'] = \
                    str(dataSlimmestest.default.values[0])

with open('../js/sidebarReference.js', 'w') as outfile:
    outfile.write('var sidebar = ')
    json.dump(dataOut, outfile, indent=2)
    outfile.write(';')
