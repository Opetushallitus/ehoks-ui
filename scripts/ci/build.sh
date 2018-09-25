#!/usr/bin/env bash

set -euo pipefail

export ARTIFACT_NAME=$1
export BUILD_ID=ci-${TRAVIS_BUILD_NUMBER}
export DOCKER_TARGET=${ECR_REPO}/${ARTIFACT_NAME}:${BUILD_ID}

cp -r dist index.html scripts/ci/* "$DOCKER_BUILD_DIR/"

cat > "$DOCKER_BUILD_DIR/buildversion.txt" <<END
artifactId=$ARTIFACT_NAME
buildNumber=$BUILD_ID
vcsRevision=$(git rev-parse HEAD)
buildTime=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
END

sed -i '' "s|BASEIMAGE|${ECR_REPO}/${BASE_IMAGE}|g" "$DOCKER_BUILD_DIR/Dockerfile"

find "$DOCKER_BUILD_DIR"
docker build --build-arg name="$ARTIFACT_NAME" -t "$DOCKER_TARGET" "$DOCKER_BUILD_DIR"
docker images
