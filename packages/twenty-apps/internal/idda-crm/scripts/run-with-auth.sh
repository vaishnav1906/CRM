#!/usr/bin/env bash
# Helper: authenticates against the local Twenty instance and runs a script with TWENTY_API_KEY set.
# Usage: bash scripts/run-with-auth.sh scripts/enrich-existing-leads.ts [--dry-run] [extra args...]
# Note: server binds to IPv6 (::1) only — use --ipv6 on all curl calls.
set -e

API_URL="${TWENTY_API_URL:-http://localhost:3000}"
EMAIL="tim@apple.dev"
PASSWORD="tim@apple.dev"
API_KEY_ID="a71b57e2-34c1-45fc-95da-096c6e67afce"
EXPIRES="2126-05-07T08:15:01.881Z"
C="curl -s --ipv6"

LOGIN_TOKEN=$($C -X POST "$API_URL/metadata" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation { getLoginTokenFromCredentials(email: \\\"$EMAIL\\\", password: \\\"$PASSWORD\\\", origin: \\\"http://localhost:3001\\\") { loginToken { token } } }\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['getLoginTokenFromCredentials']['loginToken']['token'])")

ACCESS_TOKEN=$($C -X POST "$API_URL/metadata" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation { getAuthTokensFromLoginToken(loginToken: \\\"$LOGIN_TOKEN\\\", origin: \\\"http://localhost:3001\\\") { tokens { accessOrWorkspaceAgnosticToken { token } } } }\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['getAuthTokensFromLoginToken']['tokens']['accessOrWorkspaceAgnosticToken']['token'])")

API_JWT=$($C -X POST "$API_URL/metadata" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{\"query\":\"mutation { generateApiKeyToken(apiKeyId: \\\"$API_KEY_ID\\\", expiresAt: \\\"$EXPIRES\\\") { token } }\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['generateApiKeyToken']['token'])")

echo "🔑  Auth OK"
TWENTY_API_KEY="$API_JWT" TWENTY_API_URL="$API_URL" npx tsx "$@"
