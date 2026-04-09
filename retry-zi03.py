import urllib.request
import urllib.error
import pg8000
import ssl

BASE_URL = 'https://midpnvsmoqhzqvltiryv.supabase.co'
SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZHBudnNtb3FoenF2bHRpcnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczNzQwMywiZXhwIjoyMDkxMzEzNDAzfQ.h6XjiyBocr-Rd-XQRpHXSZj3li2sX9n6dBb_jWZhovY'

filepath = r'F:\AI-INFRA\saint-assistant\audio-protocol\SAINT_zi03_dimineata_Anton.mp3'
storage_path = 'protocol/SAINT_zi03_dimineata_Anton.mp3'

with open(filepath, 'rb') as f:
    data = f.read()

url = f'{BASE_URL}/storage/v1/object/audio/{storage_path}'
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('apikey', SERVICE_KEY)
req.add_header('Authorization', f'Bearer {SERVICE_KEY}')
req.add_header('Content-Type', 'audio/mpeg')
req.add_header('x-upsert', 'true')

try:
    resp = urllib.request.urlopen(req, timeout=180)
    print(f'Upload OK: {resp.status}')
except Exception as e:
    print(f'Upload failed: {e}')
    exit(1)

# Insert DB record
import os
size = os.path.getsize(filepath)
duration = int(size / (128000 / 8))

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
c.execute(
    """INSERT INTO public.audio_tracks 
    (day_number, session_type, language, title, technique, storage_path, duration_seconds)
    VALUES (%s, %s, %s, %s, %s, %s, %s)""",
    (3, 'morning', 'ro', 'Day 3 - Morning', 'Dropping the Rope', storage_path, duration)
)
c.close()
conn.close()
print('DB record inserted')
print('Done')
