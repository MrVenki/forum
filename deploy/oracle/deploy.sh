#!/usr/bin/env bash
# Builds GitHub master into its own release folder and switches the live site to it only after a
# successful build and health check, so a failed build never touches what visitors see.
set -euo pipefail

REPO="https://github.com/MrVenki/forum.git"
RELEASES="$HOME/releases"
SHARED="$HOME/shared"
CURRENT="$HOME/current"
KEEP=3

exec 9>"$HOME/.deploy.lock"
flock -n 9 || { echo "Another deploy is already running"; exit 1; }

[ -f "$SHARED/.env.production.local" ] || { echo "Missing $SHARED/.env.production.local" >&2; exit 1; }
mkdir -p "$RELEASES"

TMP="$RELEASES/.incoming-$$"
trap 'rm -rf "$TMP"' EXIT
echo "==> Fetching master"
git clone --quiet --depth 1 --branch master "$REPO" "$TMP"
SHA=$(git -C "$TMP" rev-parse --short HEAD)
DIR="$RELEASES/$SHA"
echo "    $(git -C "$TMP" log --oneline -1)"

if [ "$(readlink -f "$CURRENT" 2>/dev/null || true)" = "$DIR" ]; then
  echo "Already live: $SHA"
  exit 0
fi
rm -rf "$DIR"
mv "$TMP" "$DIR"
ln -s "$SHARED/.env.production.local" "$DIR/.env.production.local"

cd "$DIR"
echo "==> Installing dependencies"
npm ci --no-audit --no-fund --loglevel=error
echo "==> Building"
for attempt in 1 2; do
  if npm run build; then break; fi
  # next/font occasionally fails on a transient Google Fonts fetch; one retry clears it
  [ "$attempt" = 2 ] && { echo "Build failed; live site unchanged" >&2; exit 1; }
  echo "    build failed, retrying once"
done

PREV=$(readlink -f "$CURRENT" 2>/dev/null || true)
echo "==> Switching live site to $SHA"
ln -sfn "$DIR" "$CURRENT"
sudo systemctl restart forum

for i in $(seq 1 30); do
  if curl -fsS -o /dev/null http://127.0.0.1:3000/; then
    echo "    live and healthy"
    ls -1dt "$RELEASES"/*/ | tail -n +$((KEEP + 1)) | while read -r old; do
      [ "$(readlink -f "$old")" != "$(readlink -f "$CURRENT")" ] && rm -rf "$old"
    done
    exit 0
  fi
  sleep 2
done

echo "New release did not come up; rolling back" >&2
if [ -n "$PREV" ]; then
  ln -sfn "$PREV" "$CURRENT"
  sudo systemctl restart forum
fi
exit 1
