import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS — reads from CORS_ORIGINS env var (comma-separated list).
    # Includes localhost for local dev AND the Vercel production URL.
    raw_origins = os.getenv(
        'CORS_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173,https://ai-research-paper-summarizer-agent.vercel.app'
    )
    allowed_origins = [o.strip() for o in raw_origins.split(',')]
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
    
    # Configure upload folder (Use /tmp for serverless read-only filesystems on Vercel)
    if os.getenv('VERCEL') == '1':
        UPLOAD_FOLDER = '/tmp/temp_uploads'
    else:
        UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp_uploads')
        
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
    # Register blueprints
    from routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Configure Database (PostgreSQL or local SQLite fallback)
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'papers.db')
        database_url = f"sqlite:///{db_path}"
        print(f"Database configuration: No DATABASE_URL found. Using local SQLite database at: {db_path}")
    else:
        print(f"Database configuration: Using DATABASE_URL connection.")

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    from models import db
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        try:
            db.create_all()
            print("Database tables initialized successfully.")
        except Exception as e:
            print(f"Warning: Failed to initialize primary database. {e}")
            if not database_url.startswith("sqlite"):
                db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'papers.db')
                fallback_url = f"sqlite:///{db_path}"
                print(f"Attempting to fallback to local SQLite database: {fallback_url}")
                app.config['SQLALCHEMY_DATABASE_URI'] = fallback_url
                # Clear cached engines to force re-connection with fallback SQLite
                if hasattr(db, 'engines'):
                    db.engines.clear()
                try:
                    db.create_all()
                    print("Fallback SQLite database initialized successfully.")
                except Exception as fallback_err:
                    print(f"Critical: Failed to initialize fallback SQLite database. {fallback_err}")
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy"}, 200
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5001)
