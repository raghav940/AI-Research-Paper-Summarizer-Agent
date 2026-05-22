import os

# Gunicorn auto-reads this file on startup — no CLI flags needed.
# Binds to Render's dynamically assigned $PORT (falls back to 8000 locally).
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
workers = 1
timeout = 120
