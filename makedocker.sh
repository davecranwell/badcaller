#!/bin/bash

rm -rf badcaller-latest.tar.gz
DOCKER_BUILDKIT=1 docker build . -t xcession2k/badcaller:latest
docker push xcession2k/badcaller:latest

#docker save xcession2k/badcaller:latest | gzip > badcaller-latest.tar.gz
#scp badcaller-latest.tar.gz pi@192.168.1.24:/home/pi