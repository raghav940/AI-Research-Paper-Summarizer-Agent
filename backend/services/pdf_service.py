from langchain_community.document_loaders import PyPDFLoader

def extract_text_from_pdf(filepath: str) -> str:
    """
    Extracts all text from a given PDF file using PyPDFLoader.
    """
    loader = PyPDFLoader(filepath)
    pages = loader.load()
    
    # Combine text from all pages
    full_text = "\n\n".join([page.page_content for page in pages])
    
    return full_text
