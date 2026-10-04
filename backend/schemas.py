from pydantic import BaseModel

class TaskCreate(BaseModel):
    title:str
    description:str|None = None

class PlanRequest(BaseModel):
    prompt: str

class PlanTask(BaseModel):
    title: str
    description: str | None = ""
    duration_minutes: int | None = None
    deadline: str | None = None


class PlanResponse(BaseModel):
    tasks: list[PlanTask]