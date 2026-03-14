import helpers
from google import genai
from config import GEMINI_API_KEY
import json

def create_todo(description):

    prompt = """You are the AI Game Master for a Retro Arcade Community Board. Your job is to take the user's mundane task description and transform it into an epic, arcade-style "Mission Briefing". 

Retain the core meaning and actionable steps, but use gaming terminology (e.g., "objectives", "co-op", "boss battle", "NPCs", "mainframe").

Description: {description}

Format your response as a strict JSON object with the exact following structure:
{{
    "title": "A punchy, capitalized arcade-style mission title (e.g., DEFEND THE MAINFRAME, OPERATION: CLEANUP)",
    "description": "A flavorful, game-style description of the task.",
    "summary": ["Objective 1", "Objective 2", "Objective 3"],
    "date": "A formatted date string like 'Mar 13 2026', if date not mentioned, make it today's date",
    "variant": "wide if the task is complex or needs lots of text, otherwise small",
    "volunteersNeeded": "Integer representing the number of co-op players/volunteers needed (0 if none)",
    "priority": "Integer from 1 to 5, with 5 being maximum threat level/priority",
    "tag": "A short, 1-3 word gaming category tag (e.g., BOSS BATTLE, SIDE QUEST, DAILY GRIND, ESCORT MISSION, DEBUGGING)"
}}

For example, here are two different descriptions and the expected outputs:

Description: "Need to debug the Verilog code for the F=aX^2+bX+c logic circuit project. The full adder is throwing a timing error. Me and two partners need to get this done by Sunday."
Expected Output:
{{
    "title": "DEBUG THE VERILOG MAINFRAME",
    "description": "Critical timing error detected in the logic circuit architecture. Assemble your co-op squad to isolate the fault in the full adder module and stabilize the project before the Sunday deadline.",
    "summary": ["Analyze Verilog code for timing errors", "Debug the full adder module", "Stabilize F=aX^2+bX+c output"],
    "date": "Mar 15 2026",
    "variant": "small",
    "volunteersNeeded": 2,
    "priority": 5,
    "tag": "BOSS BATTLE"
}}

Description: "Organize a community clean-up event at the local park next Saturday. We need 10 volunteers to help with picking up trash, setting up stations for recycling, and providing refreshments. The event will run from 9 AM to 1 PM. We also need someone to create flyers."
Expected Output:
{{
    "title": "OPERATION: PARK PURIFICATION",
    "description": "The local park zone has been overrun by debris! We are initiating a massive co-op raid next Saturday to clear the area, establish recycling checkpoints, and deploy refreshment stations.",
    "summary": ["Clear debris from the park zone", "Establish recycling checkpoints", "Deploy refreshment stations", "Craft promotional flyers"],
    "date": "Mar 21 2026",
    "variant": "wide",
    "volunteersNeeded": 10,
    "priority": 3,
    "tag": "CO-OP RAID"
}}


Notice we are in {current_time}, so the date should be generated accordingly if not mentioned in the description."""
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    try:
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt.format(description=description, current_time=helpers.get_current_date_formatted()),
        )
        content = response.text
        print("Generated content from Gemini API:", content)
        content = helpers.clean_gemini_response(content)
        new_todo = json.loads(content)
    except Exception as e:
        return {'error': f'Failed to generate todo: {str(e)}'}

    new_todo['id'] = helpers.get_next_id()
    new_todo['completed'] = False

    tasks = helpers.read_db_file()
    tasks.append(new_todo)
    helpers.write_db_file(tasks)

    return new_todo


def get_todo_by_id(todo_id):
    tasks = helpers.read_db_file()
    for task in tasks:
        if task['id'] == todo_id:
            return task

def update_todo(todo_id, update_data):
    task = get_todo_by_id(todo_id)
    
    tasks = helpers.read_db_file()
    tasks.remove(task)

    if "title" in update_data:
        task['title'] = update_data['title']
    if "description" in update_data:
        task['description'] = update_data['description']
    if "date" in update_data:
        task['date'] = update_data['date']
    if "variant" in update_data:
        task['variant'] = update_data['variant']
    if "volunteersNeeded" in update_data:
        task['volunteersNeeded'] = update_data['volunteersNeeded']
    if "priority" in update_data:
        task['priority'] = update_data['priority']
    if "completed" in update_data:
        task['completed'] = update_data['completed']
    
    tasks.append(task)
    helpers.write_db_file(tasks)

    return task


def delete_todo(todo_id):
    task = get_todo_by_id(todo_id)
    
    tasks = helpers.read_db_file()
    tasks.remove(task)
    helpers.write_db_file(tasks)

    return



