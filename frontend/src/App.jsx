
import { useState } from "react"
import "./App.css"
import Planner from "./Planner"
import Tasks from "./Tasks"

function App(){
  const [activePage,setActivePage]=useState("planner")
  const [taskVersion,setTaskVersion]=useState(0)
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">✓</div>
        <div className="brand-copy">
          <strong>Organize ME !!</strong>
          <span>Make room for what matters</span>
        </div>
      </header>

      <section className="page-heading">
        <h1>Your day, in focus.</h1>
        <p>Turn your priorities into a plan you can follow.</p>
      </section>

      <nav className="tabs" aria-label="Planner sections">
        <button
          className={`tab-button ${activePage === "planner" ? "active" : ""}`}
          aria-current={activePage === "planner" ? "page" : undefined}
          onClick={()=>setActivePage("planner")}
        >
          <span className="tab-icon" aria-hidden="true">✦</span> AI Planner
        </button>
        <button
          className={`tab-button ${activePage === "tasks" ? "active" : ""}`}
          aria-current={activePage === "tasks" ? "page" : undefined}
          onClick={()=>setActivePage("tasks")}
        >
          <span className="tab-icon" aria-hidden="true">☷</span> My Tasks
        </button>
      </nav>

      <section className="content-panel">
        {activePage === "planner" && (
          <Planner onTasksCreated={()=>setTaskVersion(taskVersion+1)}/>
        )}
        {activePage === "tasks" && <Tasks taskVersion={taskVersion}/>}
      </section>
    </main>
  )
}

export default App
