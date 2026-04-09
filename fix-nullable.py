import pg8000
import ssl

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

stmts = [
    'ALTER TABLE public.mood_entries ALTER COLUMN program_id DROP NOT NULL',
    'ALTER TABLE public.patient_programs ALTER COLUMN program_id DROP NOT NULL',
]
for sql in stmts:
    try:
        c.execute(sql)
        print(f'OK: {sql[:60]}')
    except Exception as e:
        print(f'ERR: {e}')

c.close()
conn.close()
print('Done')
