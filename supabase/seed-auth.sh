#!/bin/bash
# テストユーザーをSupabase Authに作成するスクリプト
# 使い方: bash supabase/seed-auth.sh
# 前提: supabase start 済み

SECRET_KEY=$(npx supabase status 2>/dev/null | grep "Secret" | head -1 | awk '{print $NF}')
API_URL="http://127.0.0.1:54321"

echo "Creating test user: test.user@gmail.com / testpass"

curl -s -X POST "${API_URL}/auth/v1/admin/users" \
  -H "Authorization: Bearer ${SECRET_KEY}" \
  -H "apikey: ${SECRET_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@gmail.com",
    "password": "testpass",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "テストユーザー"
    }
  }' | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Created: {d.get(\"id\",\"error\")} ({d.get(\"email\",d.get(\"msg\",\"\"))})')" 2>/dev/null

echo ""
echo "Now run: npx supabase db reset"
echo "to apply seed.sql (creates profile record)"
