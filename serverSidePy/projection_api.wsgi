#!/usr/bin/python3
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/project/sealevel/www/wsgi/projection/")
sys.path.insert(0,"/project/sealevel/www/wsgi/projection/serverSidePy/")

from serverSidePy import app as application
#application.secret_key = 'Add your secret key'
