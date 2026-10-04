import requests
import json
LLAMA_SERVER_URL = "http://127.0.0.1:8081"


def ask_gemma(user_prompt: str):
    prompt = f"""
You are a task planning assistant.

Convert the user's request into a list of tasks.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations.

The JSON must have exactly this structure:

{{
  "tasks": [
    {{
      "title": "string",
      "description": "string",
      "duration_minutes": number or null,
      "deadline": "string" or null
    }}
  ]
}}

User request:
{user_prompt}
"""

    response = requests.post(
        f"{LLAMA_SERVER_URL}/completion",
        json={
            "prompt": prompt,
            "temperature": 0.1,
            "n_predict": 300
        }
    )

    response.raise_for_status()

    data = response.json()
    content = data["content"]

    start = content.find("{")
    end = content.rfind("}") + 1

    if start == -1 or end == 0:
        raise ValueError("Gemma did not return JSON")

    json_text = content[start:end]

    return json.loads(json_text)