#!/usr/bin/env bash

set -euo pipefail

export ARTIFACT_NAME=$1
export BUILD_ID=ci-${TRAVIS_BUILD_NUMBER}
export DOCKER_TARGET=${ECR_REPO}/${ARTIFACT_NAME}:${BUILD_ID}

cp -r \
   public \
   scripts/ci/Dockerfile \
   scripts/ci/config.json.template \
   scripts/ci/escape-html.py \
   scripts/ci/nginx-server.conf \
   scripts/ci/run \
   scripts/ci/run.sh \
   "$DOCKER_BUILD_DIR/"

cp -r ../virkailija/public "$DOCKER_BUILD_DIR/public/ehoks-ui"

cat > "$DOCKER_BUILD_DIR/public/ehoks/buildversion.txt" <<END
artifactId=$ARTIFACT_NAME
buildNumber=$BUILD_ID
vcsRevision=$(git rev-parse HEAD)
buildTime=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
END

sed "s|BASEIMAGE|${ECR_REPO}/${BASE_IMAGE}|g" < scripts/ci/Dockerfile > "$DOCKER_BUILD_DIR/Dockerfile"

find "$DOCKER_BUILD_DIR"
docker build --build-arg name="$ARTIFACT_NAME" -t "$DOCKER_TARGET" "$DOCKER_BUILD_DIR"
docker images
