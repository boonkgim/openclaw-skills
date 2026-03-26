#!/bin/bash
# scaffold.sh — Create a presentation project (no server)
# Usage: scaffold.sh <slug> [base-dir]
#   slug:     short kebab-case name (e.g. "ai-marketing")
#   base-dir: where to create presentation/ (default: current working dir)

set -e

SLUG="${1:?Usage: scaffold.sh <slug> [base-dir]}"
BASE="${2:-.}"
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M)"
DIR="${BASE}/presentation/${TIMESTAMP}-${SLUG}"

# Create project
mkdir -p "${DIR}/slides"
cp "${SKILL_DIR}/templates/index.html" "${DIR}/index.html"

# Copy all template slides as references
cp "${SKILL_DIR}/templates/slides/"*.html "${DIR}/slides/"

echo "SCAFFOLD_DIR=${DIR}"
