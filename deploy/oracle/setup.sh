#!/usr/bin/env bash
# One-time provisioning of an Oracle Cloud Ubuntu VM (Ampere A1) for IndiaPropertyTalk.
# Run as the default "ubuntu" user. Idempotent: safe to re-run.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> System packages"
sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y git curl gnupg debian-keyring debian-archive-keyring \
  apt-transport-https unattended-upgrades netfilter-persistent

echo "==> Automatic security updates"
sudo dpkg-reconfigure -f noninteractive unattended-upgrades

echo "==> Node.js 22"
if ! command -v node >/dev/null || [[ "$(node -v)" != v22* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "==> Caddy (reverse proxy + automatic HTTPS)"
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
  sudo apt-get update -y
  sudo apt-get install -y caddy
fi

echo "==> Open ports 80/443 in the OS firewall (Oracle Ubuntu images block them by default)"
for port in 443 80; do
  if ! sudo iptables -C INPUT -m state --state NEW -p tcp --dport "$port" -j ACCEPT 2>/dev/null; then
    # Must sit above the image's catch-all REJECT rule, whose position varies between images
    pos=$(sudo iptables -L INPUT --line-numbers -n | awk '/REJECT/{print $1; exit}')
    sudo iptables -I INPUT "${pos:-1}" -m state --state NEW -p tcp --dport "$port" -j ACCEPT
  fi
done
sudo netfilter-persistent save

echo "==> Release layout (deploy.sh builds into ~/releases/<sha>; ~/current points at the live one)"
mkdir -p "$HOME/releases" "$HOME/shared"

echo "==> systemd service"
sudo cp "$SCRIPT_DIR/forum.service" /etc/systemd/system/forum.service
sudo systemctl daemon-reload
sudo systemctl enable forum

echo "==> Caddy config"
sudo cp "$SCRIPT_DIR/Caddyfile" /etc/caddy/Caddyfile
sudo systemctl reload caddy || sudo systemctl restart caddy

echo "==> Weekly digest email (Mondays 09:00 IST = 03:30 UTC)"
CRON_LINE="30 3 * * 1 bash -c 'set -a; . $HOME/shared/.env.production.local; curl -fsS -m 120 -H \"Authorization: Bearer \$CRON_SECRET\" http://127.0.0.1:3000/api/cron/weekly-digest' >> $HOME/digest.log 2>&1"
{ crontab -l 2>/dev/null | grep -v 'api/cron/weekly-digest' || true; echo "$CRON_LINE"; } | crontab -

echo
echo "Provisioning done. Next: put secrets in $HOME/shared/.env.production.local, then run $SCRIPT_DIR/deploy.sh"
