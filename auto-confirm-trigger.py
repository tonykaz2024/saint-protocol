"""Create trigger to auto-confirm email on signup."""
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

# Create a BEFORE INSERT trigger that sets email_confirmed_at
func_sql = """
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $fn$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$fn$ LANGUAGE plpgsql SECURITY DEFINER;
"""

trigger_sql = """
DROP TRIGGER IF EXISTS auto_confirm_on_signup ON auth.users;
CREATE TRIGGER auto_confirm_on_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_email();
"""

try:
    c.execute(func_sql)
    print('Function created')
except Exception as e:
    print(f'Function error: {e}')

try:
    c.execute(trigger_sql)
    print('Trigger created')
except Exception as e:
    print(f'Trigger error: {e}')

conn.close()
print('Done')
