# Bridge file to satisfy Render's default 'gunicorn your_application.wsgi' start command
from app import app

# Render calls 'gunicorn your_application.wsgi' — expose both entry points
wsgi = app
