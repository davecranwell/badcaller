#!/bin/bash

chmod +x kiosk.sh
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences

sed -i "s#/bin/bash kiosk.sh#/bin/bash $PWD/kiosk.sh#" kiosk.service

sudo rm /lib/systemd/system/kiosk.service
sudo systemctl link $PWD/kiosk.service
sudo systemctl enable kiosk.service
sudo systemctl start kiosk.service