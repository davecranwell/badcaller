#!/bin/bash

DOCKER_BUILDKIT=1 docker build . -t xcession2k/badcaller:latest
cd server && npm version minor && cd ..
cd client && npm version minor && cd ..
docker login
docker push xcession2k/badcaller:latest
