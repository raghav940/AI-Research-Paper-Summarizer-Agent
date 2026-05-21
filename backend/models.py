from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Paper(db.Model):
    __tablename__ = 'papers'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    authors = db.Column(db.String(500))
    publication_date = db.Column(db.String(100))
    field = db.Column(db.String(100))
    arxiv_url = db.Column(db.String(500))
    summary_json = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "authors": self.authors,
            "publication_date": self.publication_date,
            "field": self.field,
            "arxiv_url": self.arxiv_url,
            "summary_json": self.summary_json,
            "created_at": self.created_at.isoformat()
        }
