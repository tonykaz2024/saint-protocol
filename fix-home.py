import re

path = r'F:\AI-INFRA\saint-assistant\saint-app\src\pages\patient\Home.tsx'
data = open(path, 'r', encoding='utf-8').read()

# Remove the "no program" early return block
old_block = re.compile(
    r'  if \(!program\) \{\s*return \(\s*<div[^}]+\)\s*\}\s*'
    r'const week = Math\.ceil\(program\.current_day / 7\)\s*'
    r'const dayOfWeek = \(\(program\.current_day - 1\) % 7\) \+ 1',
    re.DOTALL
)

new_block = """  const currentDay = program?.current_day || 1
  const week = Math.ceil(currentDay / 7)
  const dayOfWeek = ((currentDay - 1) % 7) + 1"""

if old_block.search(data):
    data = old_block.sub(new_block, data)
    open(path, 'w', encoding='utf-8').write(data)
    print('Fixed Home.tsx - removed early return, uses currentDay fallback')
else:
    print('Pattern not found - may already be fixed')
