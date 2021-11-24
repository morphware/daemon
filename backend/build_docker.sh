#!/bin/bash -eu

ROOT=$(cd $(dirname $0) && pwd)
cd $ROOT

VERSION=$(jq -r '.version' < ${ROOT}/package.json)

IMAGE_NAME="morphware/backend"

# We need to bring in a file that's outside the Docker scope. We can only COPY
# in files that live within the directory tree that contains the Dockerfile.
cp ../resources/share/python/requirements.txt .

docker build \
  --network=host \
  -t "${IMAGE_NAME}:${VERSION}" \
  -t "${IMAGE_NAME}:latest" \
    .

# ... and clean up after ourselves.
rm -f requirements.txt
