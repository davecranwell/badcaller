#!/bin/bash

cd server && npm version minor && cd ..
cd client && npm version minor && cd ..

DOCKER_BUILDKIT=1 docker build . -t xcession2k/badcaller:latest

if [ $? -eq 0 ]; then
  docker login
  docker push xcession2k/badcaller:latest
else
  echo FAIL
fi

