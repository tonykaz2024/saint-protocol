"""Disable email confirmation requirement in Supabase.
This is done via the auth config in the database."""
import pg8000, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
conn = pg8000.connect(
    host='aws-0-eu-west-1.pooler.supabase.com', port=6543,
    user='postgres.midpnvsmoqhzqvltiryv', password='Habibula2024',
    database='postgres', ssl_context=ctx, timeout=15
)
conn.autocommit = True
c = conn.cursor()

# Check current auth config
try:
    c.execute("SELECT key, value FROM auth.config WHERE key IN ('mailer_autoconfirm', 'enable_signup')")
    rows = c.fetchall()
    print('Current auth config:')
    for r in rows:
        print(f'  {r[0]} = {r[1]}')
except Exception as e:
    print(f'No auth.config table: {e}')

# Try updating via the internal auth schema  
try:
    c.execute("UPDATE auth.config SET value = 'true' WHERE key = 'mailer_autoconfirm'")
    print(f'Updated mailer_autoconfirm: {c.rowcount} rows')
except Exception as e:
    print(f'Cannot update auth.config: {e}')

conn.close()
print('Done')
