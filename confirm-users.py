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

# Auto-confirm all unconfirmed users
c.execute("""
    UPDATE auth.users 
    SET email_confirmed_at = NOW()
    WHERE email_confirmed_at IS NULL
""")
print(f'Auto-confirmed {c.rowcount} users')

# Verify
c.execute("SELECT id, email, email_confirmed_at FROM auth.users ORDER BY created_at DESC LIMIT 5")
for r in c.fetchall():
    print(f'  {r[1]}: confirmed={r[2]}')

conn.close()
print('Done')
