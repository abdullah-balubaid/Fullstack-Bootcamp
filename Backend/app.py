from flask import Flask, jsonify, request
from flask_cors import CORS
import config
import crud
import helpers

app = Flask(__name__)

# Load configuration
app.config['SECRET_KEY'] = config.SECRET_KEY
CORS(app)

# Register routes
@app.route('/')
def index():
    return "Hello from Flask!"

@app.route("/todos", methods=["GET"])
def get_todos_route():
    tasks = helpers.read_db_file()
    return jsonify(tasks) # ✅ Added jsonify for consistency

@app.route('/todos', methods=["POST"])
def create_todo_route():
    data = request.get_json()
    if 'description' not in data:
        return jsonify({"error": "description required"}), 400
    
    description = data['description']
    new_task = crud.create_todo(description)
    if 'error' in new_task:
        return jsonify(new_task), 500
    return jsonify(new_task), 201

@app.route('/todos/<int:todo_id>', methods=["GET"])
def get_todo_route(todo_id):
    task = crud.get_todo_by_id(todo_id)
    if task is None:
        return jsonify({"error": "Task Not Found"}), 404
    return jsonify(task)

# @app.route('/todos/<int:todo_id>', methods=["PUT"])
# def update_todo_route(todo_id):
#     task = crud.get_todo_by_id(todo_id)
#     if task is None:
#         return jsonify({"error": "Task Not Found"}), 404

#     update_data = request.get_json()
#     updated_task = crud.update_todo(todo_id, update_data)
#     return jsonify(updated_task), 200

@app.route('/todos/<int:todo_id>/complete', methods=['PUT'])
def complete_todo(todo_id):
    todo = crud.get_todo_by_id(todo_id)
    if todo is None:
        return jsonify({'error': 'Todo not found'}), 404
    data = crud.update_todo(todo_id, {'completed': True, 'completedOn': todo['date']})
    return jsonify(data), 200

@app.route('/todos/<int:todo_id>', methods=["DELETE"])
def delete_todo_route(todo_id):
    task = crud.get_todo_by_id(todo_id)
    if task is None:
        return jsonify({"error": "Task Not Found"}), 404

    crud.delete_todo(todo_id)
    return jsonify({"message": "Delete process successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)