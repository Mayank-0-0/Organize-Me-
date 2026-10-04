from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models
from schemas import TaskCreate, PlanRequest, PlanResponse
from ai import ask_gemma

Base.metadata.create_all(bind=engine)

app=FastAPI(title="Day Planner")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message":"Day Planner API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(
        title=task.title,
        description=task.description
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    return tasks

@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    completed: bool,
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if task is None:
        return {"error": "Task not found"}

    task.completed = completed

    db.commit()
    db.refresh(task)

    return task

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if task is None:
        return {"error": "Task not found"}

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}


@app.post("/plan", response_model=PlanResponse)
def plan_day(
    request: PlanRequest,
    db: Session = Depends(get_db)
):
    result = ask_gemma(request.prompt)

    for task in result["tasks"]:
        new_task = models.Task(
            title=task["title"],
            description=task["description"],
            duration_minutes=task["duration_minutes"],
            deadline=task["deadline"]
        )

        db.add(new_task)

    db.commit()
    return result