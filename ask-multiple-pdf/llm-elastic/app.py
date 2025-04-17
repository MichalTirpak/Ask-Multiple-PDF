from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
# CORS(app)

# Robustnejší summarizačný model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def chunk_text(text, chunk_size=1024):
    words = text.split()
    chunks = []
    current_chunk = words.pop(0)
    for word in words:
        if len(current_chunk) + len(word) < chunk_size:
            current_chunk += " " + word
        else:
            chunks.append(current_chunk)
            current_chunk = word
    chunks.append(current_chunk)
    return chunks

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.json
    input_text = data.get('text')

    if not input_text:
        return jsonify({"error": "No text provided"}), 400

    text_chunks = chunk_text(input_text)

    summaries = []
    for chunk in text_chunks:
        summary = summarizer(chunk, max_length=128, min_length=30, do_sample=False)
        summaries.append(summary[0]['summary_text'])

    final_input = " ".join(summaries)
    final_summary = summarizer(final_input, max_length=150, min_length=40, do_sample=False)

    return jsonify({"summary": final_summary[0]['summary_text']})

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5003)
