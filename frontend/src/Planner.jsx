import { useState } from "react"
function Planner({onTasksCreated}){
    const [prompt, setPrompt] = useState("")
    const [message,setMessage]=useState("")
    const [isLoading, setIsLoading] = useState(false)
    async function handleSubmit() {
        setIsLoading(true)
        setMessage("")
        try {
        const response = await fetch("http://127.0.0.1:8000/plan",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                prompt:prompt
            })
        })
        const data = await response.json()
        console.log(data)
        onTasksCreated()
        setMessage("Tasks added successfully !!")
        setTimeout(()=>{
            setMessage("")
        },2000)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="planner-view">
            <div className="section-heading">
                <h2>Plan your day</h2>
                <p>Share what’s on your plate and let AI shape it into manageable tasks.</p>
            </div>
            <label className="prompt-label" htmlFor="planner-prompt">What would you like to get done?</label>
            <textarea
                id="planner-prompt"
                className="planner-textarea"
                placeholder="Example: I have an important deadline of a project...."
                rows="6"
                value={prompt}
                onChange={(event)=>setPrompt(event.target.value)}
            />
            <div className="planner-actions">
                <button className="primary-button" onClick={handleSubmit} disabled={isLoading}>
                    <span aria-hidden="true">{isLoading ? <span className="button-spinner" /> : "✦"}</span>
                    {isLoading ? "Creating plan…" : "Plan My Day"}
                </button>
            </div>
            {(isLoading || message) && (
                <div className="toast" role="status" aria-live="polite">
                    {isLoading ? (
                        <><span className="toast-spinner" aria-hidden="true" /> Creating your plan…</>
                    ) : (
                        <><span className="toast-check" aria-hidden="true">✓</span>{message}</>
                    )}
                </div>
            )}
        </div>
    )
}

export default Planner
