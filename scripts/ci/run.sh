#!/usr/bin/env bash

set -euo pipefail

echo "Starting Prometheus node_exporter..."
nohup /root/node_exporter > /root/node_exporter.log 2>&1 &

exec nginx -g 'daemon off;'
