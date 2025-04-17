from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import requests
import json

app = Flask(__name__)
# CORS(app)

# Načítanie embedding modelu
model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')

# Elasticsearch URL
ES_URL = "http://10.1.1.154:9200"
INDEX_NAME = "michal-test"

@app.route('/search-similar', methods=['POST'])
def search_similar():
    data = request.json
    query_text = data.get('text')

    if not query_text:
        return jsonify({"error": "Missing text in request"}), 400

    # Vygeneruj embedding
    query_embedding = model.encode(query_text, convert_to_numpy=True)
    query_vector = query_embedding.tolist()

    if len(query_vector) != 768:
        return jsonify({"error": f"Invalid embedding length: {len(query_vector)}"}), 400

    # Vytvor dotaz do Elasticsearch
    es_query = {
        "query": {
            "script_score": {
                "query": {
                    "bool": {
                        "filter": {
                            "exists": {
                                "field": "vector"
                            }
                        }
                    }
                },
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'vector') + 1.0",
                    "params": {
                        "query_vector": query_vector
                    }
                }
            }
        }
    }


    try:
        response = requests.post(
            f"{ES_URL}/{INDEX_NAME}/_search",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data=json.dumps(es_query)
        )
        response.raise_for_status()

        hits = response.json()["hits"]["hits"]
        results = [{
            "name": hit["_source"]["metadata"]["name"],
            "page": hit["_source"]["metadata"]["page"],
            "text": hit["_source"]["text"],
            "score": hit["_score"]
        } for hit in hits]

        return jsonify(results)

    except Exception as e:
        print("❌ Elasticsearch query failed:", e)
        if 'response' in locals():
            print("📨 Response content:", response.text)
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    try:
        res = requests.get(f"{ES_URL}/", headers={"Accept": "application/json"})
        res.raise_for_status()
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5002)
