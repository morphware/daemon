#!/bin/bash -eu

ROOT=$(cd $(dirname $0) && pwd)

VERSION=$(jq -r '.version' < ${ROOT}/package.json)

docker build \
  --network=host \
  -t morphware/backend:${VERSION} \
    .
