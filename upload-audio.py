"""Upload all 84 MP3 files from audio-protocol to Supabase Storage
and populate audio_tracks table."""
import os
import json
import urllib.request
import urllib.error
import pg8000
import ssl
from pathlib import Path
import struct

BASE_URL = 'https://midpnvsmoqhzqvltiryv.supabase.co'
SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZHBudnNtb3FoenF2bHRpcnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczNzQwMywiZXhwIjoyMDkxMzEzNDAzfQ.h6XjiyBocr-Rd-XQRpHXSZj3li2sX9n6dBb_jWZhovY'
AUDIO_DIR = Path(r'F:\AI-INFRA\saint-assistant\audio-protocol')

# Weekly technique rotation from PRD
TECHNIQUES = {
    1: 'Leaves on a Stream',
    2: 'Passengers on the Bus',
    3: 'Dropping the Rope',
    4: 'Thanking Your Mind',
    5: 'Spectatoring Awareness',
    6: 'Values Deep Dive',
    0: 'Integration Review',  # Sunday = day 7, mod 7 = 0
}

def get_mp3_duration_estimate(filepath):
    """Rough estimate of MP3 duration from file size.
    Average bitrate ~128kbps for speech."""
    size = os.path.getsize(filepath)
    return int(size / (128000 / 8))  # bytes / (bits_per_sec / 8)

def upload_file(filepath, storage_path):
    """Upload file to Supabase Storage."""
    url = f'{BASE_URL}/storage/v1/object/audio/{storage_path}'
    with open(filepath, 'rb') as f:
        data = f.read()
    
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('apikey', SERVICE_KEY)
    req.add_header('Authorization', f'Bearer {SERVICE_KEY}')
    req.add_header('Content-Type', 'audio/mpeg')
    req.add_header('x-upsert', 'true')
    
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        return True, resp.status
    except urllib.error.HTTPError as e:
        return False, f'{e.code}: {e.read().decode()[:100]}'
    except Exception as e:
        return False, str(e)[:100]

def main():
    mp3s = sorted(AUDIO_DIR.glob('SAINT_zi*_*.mp3'))
    mp3s = [f for f in mp3s if f.stat().st_size > 0]  # Skip empty files
    print(f'Found {len(mp3s)} MP3 files to upload')
    
    # Connect to DB
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    conn = pg8000.connect(
        host='aws-0-eu-west-1.pooler.supabase.com', port=6543,
        user='postgres.midpnvsmoqhzqvltiryv', password='Habibula2024',
        database='postgres', ssl_context=ctx, timeout=15
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    # Clear existing audio tracks
    cursor.execute('DELETE FROM public.audio_tracks')
    print('Cleared existing audio tracks')
    
    uploaded = 0
    failed = 0
    
    for mp3 in mp3s:
        name = mp3.stem  # e.g. SAINT_zi01_dimineata_Anton
        parts = name.split('_')
        # Parse: SAINT_zi{NN}_{type}_{voice}[_partN]
        day_num = int(parts[1].replace('zi', ''))
        session_raw = parts[2]  # dimineata or seara
        
        if session_raw == 'dimineata':
            session_type = 'morning'
        elif session_raw == 'seara':
            session_type = 'evening'
        else:
            session_type = 'visualization'
        
        # Skip part2 files (duplicates)
        if 'part2' in name:
            continue
        
        storage_path = f'protocol/{mp3.name}'
        duration = get_mp3_duration_estimate(str(mp3))
        day_of_week = ((day_num - 1) % 7) + 1
        technique = TECHNIQUES.get(day_of_week % 7, 'Body Scan')
        
        # Upload to storage
        size_mb = mp3.stat().st_size / (1024 * 1024)
        print(f'  [{uploaded+failed+1:02d}] Uploading zi{day_num:02d}_{session_type} ({size_mb:.1f}MB)...', end=' ', flush=True)
        
        ok, status = upload_file(str(mp3), storage_path)
        if ok:
            print(f'OK')
            uploaded += 1
        else:
            print(f'FAIL: {status}')
            failed += 1
            continue
        
        # Insert audio track record
        title = f'Day {day_num} - {session_type.title()}'
        try:
            cursor.execute(
                """INSERT INTO public.audio_tracks 
                (day_number, session_type, language, title, technique, storage_path, duration_seconds)
                VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (day_num, session_type, 'ro', title, technique, storage_path, duration)
            )
        except Exception as e:
            print(f'    DB insert error: {e}')
    
    cursor.close()
    conn.close()
    
    print(f'\nDone: {uploaded} uploaded, {failed} failed')
    
    # Verify
    print('\nVerifying...')
    url = f'{BASE_URL}/rest/v1/audio_tracks?select=count'
    req = urllib.request.Request(url)
    req.add_header('apikey', SERVICE_KEY)
    req.add_header('Authorization', f'Bearer {SERVICE_KEY}')
    req.add_header('Prefer', 'count=exact')
    resp = urllib.request.urlopen(req, timeout=10)
    count = resp.headers.get('content-range', '').split('/')[-1]
    print(f'Audio tracks in DB: {count}')

if __name__ == '__main__':
    main()
