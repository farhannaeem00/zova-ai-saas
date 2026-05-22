print("Script started")

try:
    from services.pdf_service import extract_text_from_pdf, chunk_text
    print("Import successful")

    text = extract_text_from_pdf("C:/Users/dell/OneDrive/Desktop/Master/pdf1.pdf")
    print(f"Total characters: {len(text)}")

    chunks = chunk_text(text)
    print(f"Total chunks: {len(chunks)}")
    print(f"First chunk: {chunks[0][:200]}")

except Exception as e:
    print("ERROR:", e)