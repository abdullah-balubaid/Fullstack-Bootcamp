import json
import os
import datetime, pytz

DB_FILE = 'tasks.json'

if not os.path.exists(DB_FILE):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

def read_db_file():
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_db_file(data):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def get_next_id():
    todos = read_db_file()
    return len(todos) + 1

def clean_gemini_response(content):
    content = content.strip()
    if content.startswith('"') and content.endswith('"'):
        content = content[1:-1]
    if content.startswith("'") and content.endswith("'"):
        content = content[1:-1]
    if content.startswith('```') and content.endswith('```'):
        content = "\n".join(content.splitlines()[1:-1])
    return content

def get_current_date_formatted():
    tz = pytz.timezone('Asia/Riyadh')
    now = datetime.datetime.now(tz)
    return now.strftime('%b %d %Y')