import os
# from dotenv import load_dotenv
from pathlib import Path
import fitz  # PyMuPDF for PDF processing
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import HuggingFaceInstructEmbeddings
from elasticsearch import Elasticsearch
import requests
import json

# Initialize Flask app
app = Flask(__name__)

#CORS setup for app
# CORS(app)

# Initialize Elasticsearch
es = Elasticsearch(['http://10.1.1.154:9200'])

# Generate metadata for each text chunk
def get_metadata(name, num_chunks):
    return [{'name': name, 'chunk_index': i} for i in range(num_chunks)]

# Split text into manageable chunks for processing
def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    return text_splitter.split_text(text)

# Upload text chunks and their embeddings to Elasticsearch
def upload_to_elasticsearch(text_chunks, path, page_numbers):
    print(f"Uploading {len(text_chunks)} chunks to Elasticsearch for {path}")
    
    embeddings = HuggingFaceInstructEmbeddings(model_name="all-mpnet-base-v2")
    
    for i, chunk in enumerate(text_chunks):
        embedding = embeddings.embed_documents([chunk])

        document = {
            "text": chunk,
            "vector": embedding[0],
            "metadata": {
                "name": str(path),
                "chunk_index": i,
                "page": page_numbers[i]
            }
        }

        try:
            res = requests.post(
                "http://10.1.1.154:9200/michal-test/_doc",
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                data=json.dumps(document)
            )
            res.raise_for_status()
        except Exception as e:
            print(f"❌ Failed to upload chunk {i}: {e}")
    
    print(f"✅ Successfully uploaded chunks for {path}")

# Process a single PDF file, extracting text and uploading to Elasticsearch
def process_single_file(path: Path):
    print(f"Processing file: {path}")
    try:
        doc = fitz.open(path)

        # Extrahuj text po stránkach a sleduj page number
        chunks = []
        page_numbers = []

        for page_number in range(len(doc)):
            page_text = doc[page_number].get_text()
            text_chunks = get_text_chunks(page_text)

            chunks.extend(text_chunks)
            page_numbers.extend([page_number + 1] * len(text_chunks))  # +1 aby nebol zero-based

        doc.close()

        # Upload to Elasticsearch s page info
        upload_to_elasticsearch(chunks, path, page_numbers)
    except Exception as e:
        print(f"Error processing file {path}: {e}")
        raise e


# Endpoint for processing uploaded PDF files
@app.route("/process-pdf", methods=["POST"])
def process_pdfs():
    try:
        print("🔹 Received request headers:", request.headers)
        print("🔹 Received request files:", request.files)

        if "file" not in request.files:
            print("❌ No file found in request")
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        if file.filename == "":
            print("❌ No selected file")
            return jsonify({"error": "No selected file"}), 400

        # Save uploaded file temporarily
        temp_path = Path(f"/tmp/{file.filename}")
        print(f"📁 Saving file to: {temp_path}")

        file.save(temp_path)

        # Check if file exists
        if not temp_path.exists():
            print("❌ File was not saved properly")
            return jsonify({"error": "File save failed"}), 500

        # Process the file
        print("🔄 Processing file now...")
        process_single_file(temp_path)

        # Cleanup
        os.remove(temp_path)
        print(f"✅ Successfully processed and removed {temp_path}")

        return jsonify({"message": "PDF processing finished"})
    except Exception as e:
        print("🚨 ERROR:", str(e))
        return jsonify({"error": f"Error processing PDF: {str(e)}"}), 500


# Run Flask application
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004, debug=True)