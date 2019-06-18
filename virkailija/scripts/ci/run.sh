#!/usr/bin/env bash

set -euo pipefail

echo "Downloading environment-specific properties…"
env_config_path=${ENV_CONFIG_S3_PATH:-/services/}
env_config_version=${ENV_CONFIG_VERSION:-latest}
aws s3 cp "s3://${ENV_BUCKET}${env_config_path}${env_config_version}/opintopolku.yml" /root/oph-configuration/

echo "Applying configuration templates…"
while IFS= read -r -d '' tpl_file; do
    target=${tpl_file%.template}
    echo "  $tpl_file -> $target"
    j2 "$tpl_file" /root/oph-configuration/opintopolku.yml > "$target"
done < <(find /root -name '*.template' -print0)
unset tpl_file target

echo "Insert app boot config for this env into /root/public/ehoks-virkailija/index.html …"
config_json=$(python /root/escape-html.py < /root/config.json)
sed -f <(cat <<EOF
s|APP-BOOT-CONFIG-DEFAULT|${config_json//&/\\&}|
EOF
) -i /root/public/ehoks-virkailija/index.html
unset config_json

echo "Starting Prometheus node_exporter…"
nohup /root/node_exporter > /root/node_exporter.log 2>&1 &

echo "Starting nginx…"
exec nginx -g 'daemon off;'
