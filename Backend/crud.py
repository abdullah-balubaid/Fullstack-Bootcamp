import helpers
from google import genai
from config import GEMINI_API_KEY
import json
from datetime import datetime

def create_todo(description):
    prompt = """You are the AI Game Master for a Retro Arcade Community Board... (keep your prompt exactly as it is) ..."""

    client = genai.Client(api_key=GEMINI_API_KEY)
    try:
        response = client.models.generate_content(
            model='gemini-3.0-flash', # Updated to the latest stable model name
            contents=prompt.format(description=description, current_time=helpers.get_current_date_formatted()),
        )
        content = response.text
        print("Generated content:", content)
        
        # Safety: Clean markdown backticks if Gemini includes them
        content = helpers.clean_gemini_response(content)
        new_todo = json.loads(content)
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {'error': f'Failed to generate todo: {str(e)}'}

    # Ensure all required fields exist even if AI misses one
    new_todo['id'] = helpers.get_next_id()
    new_todo['completed'] = False
    new_todo['tag'] = new_todo.get('tag', 'SIDE QUEST')
    new_todo['volunteersNeeded'] = new_todo.get('volunteersNeeded', 0)

    tasks = helpers.read_db_file()
    tasks.append(new_todo)
    helpers.write_db_file(tasks)

    return new_todo

def get_todo_by_id(todo_id):
    tasks = helpers.read_db_file()
    return next((task for task in tasks if task['id'] == todo_id), None)

def update_todo(todo_id, update_data):
    tasks = helpers.read_db_file()
    task_found = False
    
    for task in tasks:
        if task['id'] == todo_id:
            for key, value in update_data.items():
                task[key] = value
            task_found = True
            break
    
    if task_found:
        helpers.write_db_file(tasks)
        return next(t for t in tasks if t['id'] == todo_id)
    return None

# ✅ CHALLENGE 3: Dedicated Complete Route Logic
def complete_todo(todo_id):
    tasks = helpers.read_db_file()
    for task in tasks:
        if task['id'] == todo_id:
            task['completed'] = True
            # Format: "Mar 13 2026"
            task['completedOn'] = datetime.now().strftime("%b %d %Y")
            helpers.write_db_file(tasks)
            return task
    return None

def delete_todo(todo_id):
    tasks = helpers.read_db_file()
    # Safer way to remove to avoid the 500 crash
    new_tasks = [t for t in tasks if t['id'] != todo_id]
    helpers.write_db_file(new_tasks)