import pdfplumber
import io
import PyPDF2

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """Extract text from PDF bytes — no file writing needed"""
    text = ""

    # Try pdfplumber first
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"pdfplumber error: {e}")

    # Try PyPDF2 as fallback
    if not text.strip():
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        except Exception as e:
            print(f"PyPDF2 error: {e}")

    return text.strip() if text.strip() else ""