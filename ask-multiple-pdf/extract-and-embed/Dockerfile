# Use a lightweight Python base image
FROM python:3.8

# Set the working directory in the container
WORKDIR /app

# Kopírovanie súborov potrebných pre aplikáciu do kontajnera
COPY . /app
RUN pip install --upgrade pip

# Inštalácia Python závislostí
RUN pip install --no-cache-dir flask flask_cors elasticsearch sentence-transformers pathlib fitz langchain langchain-community sentence-transformers==2.2.2
# Upgrade pip, setuptools, and wheel to avoid install issues
# RUN pip install --upgrade pip setuptools wheel

# Install the correct version of huggingface_hub
RUN pip install --no-cache-dir huggingface_hub==0.15.1

# Install all other dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Force Install a Specific Version of InstructorEmbedding (1.0.1)
# RUN pip install --no-cache-dir InstructorEmbedding==1.0.1

# Expose the necessary port
EXPOSE 5004

# Set Flask environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_PORT=5004

# Run Flask application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5004"]