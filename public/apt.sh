#!/usr/bin/env bash
# apt.sh — Add the omakasui APT repository (packages.omakasui.org).
# Usage: curl -fsSL https://omakasui.org/apt.sh | bash [-s -- --dev]

set -euo pipefail

REPO_URL="https://packages.omakasui.org"
SOURCES="/etc/apt/sources.list.d/omakasui.sources"

die() { echo "ERROR: $*" >&2; exit 1; }

main() {
  local channel="stable"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dev) channel="dev"; shift ;;
      *) die "unknown argument: $1 (usage: apt.sh [--dev])" ;;
    esac
  done

  local sudo=""
  if [[ $EUID -ne 0 ]]; then
    command -v sudo >/dev/null || die "run as root or install sudo"
    sudo="sudo"
  fi

  local codename
  # shellcheck source=/dev/null
  codename=$(. /etc/os-release && echo "${VERSION_CODENAME:-}")
  case "$codename" in
    noble|resolute|trixie) ;;
    *) die "unsupported release '${codename:-unknown}' (supported: Ubuntu 24.04, Ubuntu 26.04, Debian 13)" ;;
  esac

  local arch
  arch=$(dpkg --print-architecture)
  case "$arch" in
    amd64|arm64) ;;
    *) die "unsupported architecture '$arch' (supported: amd64, arm64)" ;;
  esac

  local suite="$codename"
  [[ "$channel" == "dev" ]] && suite="$codename-dev"

  echo "==> Installing omakasui-archive-keyring ($codename)"
  TMP_DEB=$(mktemp --suffix=.deb)
  trap 'rm -f "$TMP_DEB"' EXIT
  curl -fsSL -o "$TMP_DEB" "$REPO_URL/omakasui-archive-keyring/$codename.deb"
  $sudo dpkg -i "$TMP_DEB"

  echo "==> Using suite $suite"
  $sudo sed -i "s/^Suites: .*/Suites: $suite/" "$SOURCES"

  echo "==> Updating package lists"
  $sudo apt-get update

  echo
  echo "Omakasui APT repository ready ($suite)."
  echo "Install packages with: sudo apt install <package>"
  echo "Available packages: https://omakasui.org/apt"
}

main "$@"
