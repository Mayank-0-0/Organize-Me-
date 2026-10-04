import { useEffect, useState } from "react"

function TaskTimer({durationMinutes}) {
  const initialSeconds = Math.round(Number(durationMinutes) * 60)
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return undefined

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  useEffect(() => {
    if (remainingSeconds === 0) setIsRunning(false)
  }, [remainingSeconds])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const isFinished = remainingSeconds === 0

  function resetTimer() {
    setIsRunning(false)
    setRemainingSeconds(initialSeconds)
  }

  return (
    <div className="task-timer">
      <div className="timer-readout">
        <span className="timer-icon" aria-hidden="true">◷</span>
        <span className="timer-time" role="timer" aria-label={`${minutes} minutes ${seconds} seconds remaining`}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <span className="timer-caption">{isFinished ? "Time's up" : isRunning ? "Focus time" : "Timer"}</span>
      </div>
      <div className="timer-controls">
        <button className="timer-button" onClick={() => setIsRunning(!isRunning)} disabled={isFinished}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="timer-reset" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  )
}

function Tasks({taskVersion}) {
  const [tasks, setTasks] = useState([])

  async function fetchTasks() {
    const response = await fetch("https://organize-me-backend.onrender.com/tasks")
    const data = await response.json()
    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [taskVersion])

  async function toggleTask(task) {
    await fetch(
      `https://organize-me-backend.onrender.com/plan${task.id}?completed=${!task.completed}`,
      { method: "PUT" }
    )
    fetchTasks()
  }

  async function deleteTask(taskId) {
    await fetch(
      `https://organize-me-backend.onrender.com/plan${taskId}`,
      { method: "DELETE" }
    )
    fetchTasks()
  }

  return (
    <div className="tasks-view">
      <div className="tasks-toolbar">
        <div className="section-heading">
          <h2>My tasks</h2>
          <p>Your plan, ready to take one step at a time.</p>
        </div>
        <span className="task-count">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">☀</span>
          <strong>No tasks yet</strong>
          <p>Use the AI Planner to make a plan for your day.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <article className={`task-card ${task.completed ? "completed" : ""}`} key={task.id}>
              <div className="task-card-header">
                <div className="task-title-wrap">
                  <span className="task-status" aria-label={task.completed ? "Completed" : "Incomplete"}>
                    {task.completed ? "✓" : ""}
                  </span>
                  <h3 className="task-title">{task.title}</h3>
                </div>
              </div>
              {task.description && <p className="task-description">{task.description}</p>}
              <div className="task-meta">
                <span className="meta-chip"><span aria-hidden="true">◷</span> {task.duration_minutes ? `${task.duration_minutes} minutes` : "Duration not specified"}</span>
                <span className="meta-chip"><span aria-hidden="true">▦</span> {task.deadline || "No deadline"}</span>
              </div>
              {Number(task.duration_minutes) > 0 && <TaskTimer durationMinutes={task.duration_minutes} />}
              <div className="task-actions">
                <button className={`action-button ${task.completed ? "" : "complete-action"}`} onClick={() => toggleTask(task)}>
                  {task.completed ? "↶ Mark incomplete" : "✓ Mark complete"}
                </button>
                <button className="action-button delete-action" onClick={() => deleteTask(task.id)}>
                  <span aria-hidden="true">×</span> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tasks
