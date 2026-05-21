import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS to allow requests from the React frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
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
    
    # Configure Database (PostgreSQL)
    # Default to localhost postgres if not provided in .env
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/postgres')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    from models import db
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f"Warning: Failed to connect to PostgreSQL. {e}")
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy"}, 200
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5001)
