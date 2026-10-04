# Day Planner

A simple productivity app for turning a natural-language description of your day into actionable tasks. Review tasks, track their duration and deadline, run a focus timer, and mark work complete as you go.

## Features

- **AI Planner:** Send a planning prompt to the backend and add the generated tasks to your list.
- **My Tasks:** Fetch, review, complete, and delete tasks.
- **Task details:** See descriptions, durations, and deadlines.
- **Focus timer:** Start, pause, and reset a countdown for tasks that have a duration.
- **Responsive interface:** Use the planner on desktop or smaller screens.

## Project structure

```text
.
├── backend/     # FastAPI API, SQLite database, and AI service integration
└── frontend/    # React 19 app built with Vite
```

## Requirements

- Python 3.10 or later
- Node.js and npm
- A local LLM server available at `http://127.0.0.1:8081` with a `/completion` endpoint that accepts the llama.cpp completion request format and returns generated text in a `content` field

The AI integration currently expects the model server at this address. Start that service before using AI planning. Task list actions do not require the model server.

## Run locally

Open two terminals from the project root.

### 1. Start the backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi uvicorn sqlalchemy requests
uvicorn main:app --reload
```

On macOS or Linux, activate the environment with `source .venv/bin/activate` instead. The API runs at `http://127.0.0.1:8000`; interactive API documentation is available at `http://127.0.0.1:8000/docs`.

The SQLite database is created as `backend/dayplanner.db` when the backend starts.

### 2. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The backend currently allows that origin through CORS, and the frontend calls the API at `http://127.0.0.1:8000`.

## API routes used by the app

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/plan` | Generate and save tasks from a prompt |
| `GET` | `/tasks` | Fetch saved tasks |
| `PUT` | `/tasks/{task_id}?completed=true\|false` | Update task completion |
| `DELETE` | `/tasks/{task_id}` | Delete a task |

The backend also exposes `GET /` and `GET /health` for basic status checks.

## Frontend scripts

Run these commands from `frontend/`:

```sh
npm run dev      # Start the Vite development server
npm run build    # Build the production frontend
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```
