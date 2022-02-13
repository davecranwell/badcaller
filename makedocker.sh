#!/bin/bash

cd server && npm version minor && cd ..
cd client && npm version minor && cd ..
DOCKER_BUILDKIT=1 docker build . -t xcession2k/badcaller:latest
docker login
docker push xcession2k/badcaller:latest
