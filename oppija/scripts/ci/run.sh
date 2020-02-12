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
j2 "/opt/ehoks/config.json.template" /root/oph-configuration/opintopolku.yml > /home/oph/config.json
unset tpl_file target

cp /var/www/html/public/ehoks/index.html /home/oph/index.html

echo "Insert app boot config for this env into /home/oph/index.html …"
config_json=$(python /opt/ehoks/escape-html.py < /home/oph/config.json)
sed -f <(cat <<EOF
s|APP-BOOT-CONFIG-DEFAULT|${config_json//&/\\&}|
EOF
) -i /home/oph/index.html
unset config_json

echo "Starting Prometheus node_exporter…"
nohup /usr/local/bin/node_exporter > /root/node_exporter.log 2>&1 &

echo "Starting nginx…"
mkdir -p /tmp/var/nginx
mkdir -p /tmp/run/nginx
mkdir -p /tmp/var/lib/nginx/tmp
exec nginx -g 'daemon off;'
