# Todo List App Backend Boilerplate

Simple Flask backend boilerplate for the backend part of a fullstack development bootcamp project.

## Tech Stack

- Flask
- Flask-CORS
- python-dotenv
- google-genai

## Project Files

- `app.py` - Main Flask application
- `config.py` - Environment configuration
- `helpers.py` - Helper functions for the project
- `requirements.txt` - Project dependencies
## Setup

1. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

2. Activate the virtual environment:
- For linux/macOS:
    ```bash
    source venv/bin/activate
    ```
- For Windows:
    ```bash
    venv\Scripts\activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your-gemini-api-key
```

## Run the Project

```bash
python app.py
```

The server runs on:

```text
http://localhost:5000
```

## Available Route

- `GET /` - Returns:
  ```text
  Hello from Flask!
  ```

## Notes

This boilerplate is prepared as a starting point for building a Todo List backend API.