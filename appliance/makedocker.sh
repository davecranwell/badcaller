#!/bin/bash

DOCKER_BUILDKIT=1 docker build . -t xcession2k/badcaller:latest
docker push xcession2k/badcaller:latest
