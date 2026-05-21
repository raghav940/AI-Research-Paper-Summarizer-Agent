import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import uuid

from services.pdf_service import extract_text_from_pdf
from services.arxiv_service import fetch_arxiv_paper
from services.ai_service import generate_summary
from services.notion_service import save_to_notion
from models import db, Paper

api_bp = Blueprint('api', __name__)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api_bp.route('/upload', methods=['POST'])
def upload_pdf():
    """Endpoint to handle PDF uploads and extract text."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        # Secure the filename and create a unique path
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
        
        try:
            file.save(filepath)
            
            # Extract text
            text = extract_text_from_pdf(filepath)
            
            # Clean up the file after extraction
            os.remove(filepath)
            
            return jsonify({
                "message": "File processed successfully",
                "filename": filename,
                "text": text
            }), 200
            
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "Invalid file format, only PDF allowed"}), 400

@api_bp.route('/arxiv', methods=['POST'])
def fetch_arxiv():
    """Endpoint to fetch metadata and optionally text from an ArXiv URL/ID."""
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Missing 'url' parameter"}), 400
        
    try:
        paper_data = fetch_arxiv_paper(data['url'], current_app.config['UPLOAD_FOLDER'])
        return jsonify(paper_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/summarize', methods=['POST'])
def summarize_paper():
    """Endpoint to generate structured AI summary from text."""
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' parameter"}), 400
        
    # Optional dynamic model parameter
    model = data.get('model', 'claude-3-opus-20240229')
    
    try:
        summary_result = generate_summary(data['text'], model)
        
        # Optionally save to database if metadata is provided
        metadata = data.get('metadata', {})
        if metadata:
            try:
                new_paper = Paper(
                    title=metadata.get('title', 'Unknown Title'),
                    authors=metadata.get('authors', 'Unknown Authors'),
                    publication_date=metadata.get('date', ''),
                    field=metadata.get('field', 'General'),
                    arxiv_url=metadata.get('url', ''),
                    summary_json=summary_result
                )
                db.session.add(new_paper)
                db.session.commit()
            except Exception as db_err:
                print(f"Warning: Failed to save to database. {db_err}")
                db.session.rollback()
                
        return jsonify(summary_result), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@api_bp.route('/history', methods=['GET'])
def get_history():
    """Endpoint to fetch all saved papers from PostgreSQL."""
    try:
        papers = Paper.query.order_by(Paper.created_at.desc()).all()
        return jsonify([paper.to_dict() for paper in papers]), 200
    except Exception as e:
        print(f"Warning: Failed to fetch history. {e}")
        return jsonify([]), 200

@api_bp.route('/history/<int:paper_id>', methods=['GET'])
def get_paper(paper_id):
    """Endpoint to fetch a specific saved paper from PostgreSQL."""
    try:
        paper = Paper.query.get_or_404(paper_id)
        return jsonify(paper.to_dict()), 200
    except Exception as e:
        return jsonify({"error": "Database not connected or record not found"}), 404

@api_bp.route('/notion', methods=['POST'])
def sync_notion():
    """Endpoint to save the structured summary to Notion."""
    data = request.get_json()
    if not data or 'summary_data' not in data:
        return jsonify({"error": "Missing 'summary_data' parameter"}), 400
        
    try:
        notion_url = save_to_notion(data['summary_data'])
        return jsonify({"message": "Successfully saved to Notion", "url": notion_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/summarize-arxiv', methods=['POST'])
def summarize_arxiv_direct():
    """
    Combined service: Accepts ArXiv URL, downloads PDF, extracts text, 
    processes via LangChain, and returns structured Claude AI summary.
    """
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Missing 'url' parameter"}), 400
        
    model = data.get('model', 'claude-3-opus-20240229')
    
    try:
        # 1. Extract ID, download PDF, extract text (using open source arxiv & pypdf)
        paper_data = fetch_arxiv_paper(data['url'], current_app.config['UPLOAD_FOLDER'])
        
        # 2. Process text with LangChain and Claude API
        summary_result = generate_summary(paper_data['text'], model)
        
        # 3. Combine metadata with summary
        response_data = {
            "metadata": {
                "title": paper_data['title'],
                "authors": paper_data['authors'],
                "date": paper_data['date'],
                "field": paper_data['field'],
                "url": paper_data['url']
            },
            "summary": summary_result
        }
        
        # 4. Save to database
        try:
            new_paper = Paper(
                title=paper_data['title'],
                authors=paper_data['authors'],
                publication_date=paper_data['date'],
                field=paper_data['field'],
                arxiv_url=paper_data['url'],
                summary_json=summary_result
            )
            db.session.add(new_paper)
            db.session.commit()
        except Exception as db_err:
            print(f"Warning: Failed to save ArXiv to database. {db_err}")
            db.session.rollback()
        
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
