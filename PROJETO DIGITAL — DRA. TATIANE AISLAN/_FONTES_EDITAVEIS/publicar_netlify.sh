#!/usr/bin/env bash
# Publica a pasta 02_SITE/site na Netlify com o endereço dratatianeaislan.netlify.app
# Uso: NETLIFY_TOKEN=seu_token bash publicar_netlify.sh
# (na sessão do Claude o token é injetado pelo proxy; use NETLIFY_TOKEN=proxy-injected)
set -euo pipefail
NOME="${NOME:-dratatianeaislan}"
DIR="$(cd "$(dirname "$0")/../02_SITE/site" && pwd)"
ZIP="$(mktemp -d)/site.zip"
(cd "$DIR" && zip -qr -9 "$ZIP" .)
API=https://api.netlify.com/api/v1
H=(-H "Authorization: Bearer ${NETLIFY_TOKEN:?defina NETLIFY_TOKEN}")
ID=$(curl -s "${H[@]}" "$API/sites?name=$NOME" | python3 -c "import sys,json;d=json.load(sys.stdin);print(next((s['id'] for s in d if s['name']=='$NOME'),''))")
if [ -z "$ID" ]; then
  ID=$(curl -s "${H[@]}" -H "Content-Type: application/json" -d "{\"name\":\"$NOME\"}" "$API/sites" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])")
  echo "Site criado: $NOME"
fi
curl -s "${H[@]}" -H "Content-Type: application/zip" --data-binary "@$ZIP" "$API/sites/$ID/deploys" | python3 -c "import sys,json;d=json.load(sys.stdin);print('Deploy:',d.get('state'),d.get('ssl_url') or d.get('url'))"
