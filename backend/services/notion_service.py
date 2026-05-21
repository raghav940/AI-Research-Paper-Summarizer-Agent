import os
from notion_client import Client

def save_to_notion(summary_data: dict, metadata: dict = None) -> str:
    """
    Saves the structured summary data to a Notion database.
    """
    notion_token = os.getenv("NOTION_TOKEN")
    database_id = os.getenv("NOTION_DATABASE_ID")
    
    if not notion_token or not database_id:
        raise ValueError("Notion credentials (NOTION_TOKEN or NOTION_DATABASE_ID) are missing from environment.")
        
    notion = Client(auth=notion_token)
    
    title = metadata.get('title', 'AI Generated Paper Summary') if metadata else 'AI Generated Paper Summary'
    
    # Construct blocks for Notion page
    blocks = []
    
    # Add metadata at the top if available
    if metadata:
        metadata_text = f"**Authors:** {', '.join(metadata.get('authors', [])) if isinstance(metadata.get('authors'), list) else metadata.get('authors', 'Unknown')}\\n"
        metadata_text += f"**Publication Date:** {metadata.get('date', 'Unknown')}\\n"
        metadata_text += f"**Field:** {metadata.get('field', 'Unknown')}\\n"
        metadata_text += f"**ArXiv Link:** {metadata.get('url', 'N/A')}"
        
        blocks.append({
            "object": "block",
            "type": "callout",
            "callout": {
                "rich_text": [{"type": "text", "text": {"content": metadata_text}}],
                "icon": {"type": "emoji", "emoji": "📄"}
            }
        })
        blocks.append({"object": "block", "type": "divider", "divider": {}})

    # Mapping of our structured data keys to Notion headings
    sections = [
        ('summary', 'Research Paper Summary', '📝'),
        ('problem_statement', 'Problem Statement', '🎯'),
        ('methodology', 'Methodology Used', '🧪'),
        ('results', 'Key Results', '📊'),
        ('limitations', 'Research Limitations', '⚠️'),
        ('future_improvements', 'Future Improvements', '🚀'),
        ('eli5', 'Explain Like I\'m 5', '🧠'),
        ('insights', 'Important Keywords and Insights', '💡')
    ]

    for key, heading, emoji in sections:
        content = summary_data.get(key, '').strip()
        if content:
            blocks.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [{"type": "text", "text": {"content": f"{emoji} {heading}"}}]
                }
            })
            
            # Split long content by newlines to create separate paragraph blocks (Notion limits block size)
            paragraphs = content.split('\\n\\n')
            for para in paragraphs:
                if para.strip():
                    blocks.append({
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "rich_text": [{"type": "text", "text": {"content": para.strip()}}]
                        }
                    })

    try:
        new_page = notion.pages.create(
            parent={"database_id": database_id},
            properties={
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": title
                            }
                        }
                    ]
                }
            },
            children=blocks
        )
        return new_page.get('url', '')
    except Exception as e:
        raise Exception(f"Failed to save to Notion: {str(e)}")
