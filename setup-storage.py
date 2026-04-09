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
    # Create audio bucket (public)
    """INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('audio', 'audio', true, 52428800, ARRAY['audio/mpeg','audio/mp3'])
    ON CONFLICT (id) DO UPDATE SET public = true""",
    # Public read policy for audio bucket
    """DO $p$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'saint_audio_public_read' AND tablename = 'objects') THEN
            CREATE POLICY saint_audio_public_read ON storage.objects FOR SELECT USING (bucket_id = 'audio');
        END IF;
    END $p$""",
    # Upload policy (service role or authenticated)
    """DO $p$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'saint_audio_upload' AND tablename = 'objects') THEN
            CREATE POLICY saint_audio_upload ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio');
        END IF;
    END $p$""",
]

for i, sql in enumerate(stmts):
    try:
        c.execute(sql)
        print(f'[{i+1}] OK')
    except Exception as e:
        print(f'[{i+1}] ERR: {e}')

c.close()
conn.close()
print('Storage setup done')
