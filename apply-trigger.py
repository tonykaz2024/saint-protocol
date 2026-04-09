import pg8000
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

conn = pg8000.connect(
    host='aws-0-eu-west-1.pooler.supabase.com', port=6543,
    user='postgres.midpnvsmoqhzqvltiryv', password=__import__('os').environ.get('SUPABASE_DB_PASSWORD', 'changeme'),
    database='postgres', ssl_context=ctx, timeout=15
)
conn.autocommit = True
cursor = conn.cursor()

func_sql = """
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $fn$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'en'
  );
  RETURN NEW;
END;
$fn$ LANGUAGE plpgsql SECURITY DEFINER;
"""

try:
    cursor.execute(func_sql)
    print('Function created OK')
except Exception as e:
    print(f'Function error: {e}')

try:
    cursor.execute('DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users')
    cursor.execute("""
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user()
    """)
    print('Trigger created OK')
except Exception as e:
    print(f'Trigger error: {e}')

cursor.close()
conn.close()
print('Done')
