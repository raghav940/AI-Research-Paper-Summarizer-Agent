from pypdf import PdfReader

def extract_text_from_pdf(filepath: str) -> str:
    """
    Extracts all text from a given PDF file using pypdf directly.
    More reliable than PyPDFLoader — no langchain chain import required.
    """
    reader = PdfReader(filepath)
    pages_text = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages_text.append(text.strip())
    return "\n\n".join(pages_text)
