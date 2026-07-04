import arxiv
import os
import uuid
import re
import requests
from .pdf_service import extract_text_from_pdf

def extract_arxiv_id(url: str) -> str:
    """Extracts the ArXiv ID from a URL or returns the input if it's already an ID."""
    # Matches arxiv.org/abs/2103.15348 or arxiv.org/pdf/2103.15348.pdf
    match = re.search(r'(\d{4}\.\d{4,5}(v\d+)?)', url)
    if match:
        return match.group(1)
        
    # Check for old-style IDs (e.g. quant-ph/0401062)
    match_old = re.search(r'([a-z\-]+(\.[a-zA-Z\-]+)?/\d{7})', url)
    if match_old:
        return match_old.group(1)
        
    # If it's a web URL but not from arxiv, raise a clear error
    if "http://" in url or "https://" in url:
        if "arxiv.org" not in url:
            raise ValueError("The provided URL is not a valid ArXiv link. The 'ArXiv Search' feature only works with arxiv.org links (e.g., https://arxiv.org/abs/2305.12345). For other websites like IEEE, please download the PDF and use the 'Upload' tab.")
            
    return url

def fetch_arxiv_paper(url_or_id: str, download_dir: str) -> dict:
    """
    Fetches paper metadata and text from ArXiv.
    Downloads the PDF temporarily to extract the text.
    """
    paper_id = extract_arxiv_id(url_or_id)
    
    # Use arxiv library to fetch the paper
    client = arxiv.Client()
    search = arxiv.Search(id_list=[paper_id])
    
    try:
        paper = next(client.results(search))
    except StopIteration:
        raise ValueError(f"Could not find ArXiv paper with ID: {paper_id}")
    
    # Generate unique filename for temporary download
    filename = f"{uuid.uuid4()}_{paper_id}.pdf"
    filepath = os.path.join(download_dir, filename)
    
    # Download the PDF manually using requests since Result.download_pdf is not present in this library version
    pdf_url = paper.pdf_url
    if not pdf_url:
        pdf_url = f"https://arxiv.org/pdf/{paper_id}.pdf"
        
    response = requests.get(pdf_url, stream=True, timeout=30)
    if response.status_code != 200:
        raise ValueError(f"Failed to download PDF from ArXiv. HTTP Status: {response.status_code}")
        
    with open(filepath, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    # Extract text from the downloaded PDF
    text = extract_text_from_pdf(filepath)
    
    # Clean up
    if os.path.exists(filepath):
        os.remove(filepath)
        
    return {
        "title": paper.title,
        "authors": [author.name for author in paper.authors],
        "date": paper.published.strftime("%b %d, %Y"),
        "field": paper.primary_category,
        "url": paper.entry_id,
        "text": text
    }
