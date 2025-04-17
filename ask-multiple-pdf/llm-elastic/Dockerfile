# Základný obraz - Python
FROM python:3.8

# Nastavenie pracovného adresára v kontajneri
WORKDIR /app

# Kopírovanie súborov projektu do kontajnera
COPY . /app
RUN pip install --upgrade pip
# Inštalácia potrebných Python knižníc z requirements.txt
RUN pip install --no-cache-dir flask transformers torch
RUN pip install flask-cors

# Exponovanie portu 5002
EXPOSE 5003

# Nastavenie premennej prostredia potrebnej pre transformers
ENV TRANSFORMERS_CACHE=/app/transformers_cache

# Spustenie Flask aplikácie
CMD ["flask", "run", "--host=0.0.0.0", "--port=5003"]
