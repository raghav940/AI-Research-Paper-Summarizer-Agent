import os
import json
import requests
import traceback

REQUIRED_KEYS = ["summary", "problem_statement", "methodology", "results",
                 "limitations", "future_improvements", "eli5", "insights"]

def _build_prompt(text: str) -> str:
    processed = text[:8000] if len(text) > 8000 else text
    return f"""You are an expert AI research assistant. Analyze the following research paper and return ONLY a raw JSON object with exactly these keys:
"summary", "problem_statement", "methodology", "results", "limitations", "future_improvements", "eli5", "insights"

Do NOT include markdown, no ```json formatting, just raw JSON.

PAPER TEXT:
{processed}"""

def _ensure_keys(result: dict, text: str) -> dict:
    snippet = text[:300].replace('\n', ' ').strip()
    defaults = {
        "summary": f"Document begins with: '{snippet}...'",
        "problem_statement": "Extracted from the uploaded document.",
        "methodology": "Text extracted and processed locally.",
        "results": f"Successfully parsed {len(text)} characters.",
        "limitations": "No external AI API configured — structural analysis only.",
        "future_improvements": "Add ANTHROPIC_API_KEY for deep AI analysis.",
        "eli5": "We read your file and extracted the text successfully!",
        "insights": "- Document uploaded\n- Text extraction passed\n- Local processing active"
    }
    for key in REQUIRED_KEYS:
        if key not in result or not result[key]:
            result[key] = defaults[key]
    return result

def _try_g4f(prompt: str) -> str:
    """Try modern g4f Client API."""
    from g4f.client import Client
    client = Client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def _try_pollinations_http(prompt: str) -> str:
    """Direct HTTP call to Pollinations.ai API as fallback."""
    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "model": "openai",
        "jsonMode": True
    }
    resp = requests.post(
        "https://text.pollinations.ai/openai",
        json=payload,
        timeout=60
    )
    resp.raise_for_status()
    data = resp.json()
    return data["choices"][0]["message"]["content"]

def generate_summary(text: str, model_name: str = 'llama3') -> dict:
    """
    Generates a structured AI summary. Tries Anthropic first (if key exists), then g4f, then direct
    Pollinations HTTP, then returns a graceful fallback — never crashes.
    """
    prompt = _build_prompt(text)
    processed_text = text[:8000] if len(text) > 8000 else text
    content = None

    # Attempt 0: Anthropic API if key is present
    anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
    if anthropic_api_key and anthropic_api_key != "your_anthropic_api_key_here":
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_api_key)
            message = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=4000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            content = message.content[0].text
            print("Summary generated via Anthropic.")
        except Exception as e:
            print(f"Anthropic failed: {e}. Trying g4f...")

    # Attempt 1: Modern g4f Client
    if not content:
        try:
            content = _try_g4f(prompt)
            print("Summary generated via g4f Client.")
        except Exception as e:
            print(f"g4f Client failed: {e}. Trying direct Pollinations HTTP...")

    # Attempt 2: Direct Pollinations HTTP
    if not content:
        try:
            content = _try_pollinations_http(prompt)
            print("Summary generated via Pollinations HTTP.")
        except Exception as e:
            print(f"Pollinations HTTP also failed: {e}. Using fallback data.")

    # Parse JSON if we got a response
    if content:
        try:
            clean = content.replace("```json", "").replace("```", "").strip()
            result_json = json.loads(clean)
            return _ensure_keys(result_json, processed_text)
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}. Using fallback.")

    # Graceful fallback — always returns valid data
    return _ensure_keys({}, processed_text)

