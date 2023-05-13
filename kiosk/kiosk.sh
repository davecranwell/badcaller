#!/bin/bash

export DISPLAY=:0

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --disable-pinch --no-touch-pinch --kiosk --incognito http://localhost/?kiosk=1