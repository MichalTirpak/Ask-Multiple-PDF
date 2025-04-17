# Použitie ľahkého Python obrazu
FROM python:3.8-slim

# Nastavenie pracovného adresára
WORKDIR /app

# Kopírovanie súborov do kontajnera
COPY . /app

# Inštalácia požiadaviek
RUN pip install --upgrade pip

# Inštalácia hlavných závislostí
RUN pip install --no-cache-dir flask flask-cors requests sentence-transformers

# Exponovanie portu
EXPOSE 5002

# Spustenie aplikácie (štandardný Flask spôsob)
CMD ["flask", "run", "--host=0.0.0.0", "--port=5002"]
