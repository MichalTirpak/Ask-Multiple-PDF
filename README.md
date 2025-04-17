# Ask-Multiple-PDF

Tento projekt predstavuje webovú aplikáciu, ktorá umožňuje používateľovi nahrávať PDF dokumenty, analyzovať ich obsah pomocou NLP modelov a vyhľadávať v nich odpovede na otázky na základe významovej podobnosti. Výsledky dopytov sú následne sumarizované a zobrazené v prehľadnej forme.

## 🔧 Použité technológie

- **Python + Flask** – mikroslužby pre spracovanie PDF, vyhľadávanie a sumarizáciu
- **React** – frontendová aplikácia (priečinok `PDF`)
- **Elasticsearch** – databáza pre fulltextové a vektorové vyhľadávanie
- **HuggingFace NLP modely** – generovanie embeddingov a sumarizácia textu
- **Docker & Docker Compose** – kontajnerizácia jednotlivých služieb
- **NGINX** – reverzné proxy smerovanie medzi službami

## 🗂️ Štruktúra projektu

/
├── PDF/                 → Frontend aplikácia (React)
├── ask-multiple-pdf/
    ├── extract-and-embed/  → Extrakcia textu z PDF a generovanie embeddingov
    ├── search-elasticsearch/ → Vyhľadávanie v Elasticsearch pomocou embeddingov
    ├── summarize-text/     → Sumarizácia výsledkov pomocou NLP modelu
    ├── proxy/              → Konfigurácia reverzného proxy (NGINX)
    ├── swagger/  → Jednoduchá vygenerovaná dokumentácia

### 1. Spustenie backendových služieb

Každú mikroslužbu spusti osobitne pomocou Docker Compose:

```
cd extract-and-embed
docker-compose up --build -d

cd ../search-elasticsearch
docker-compose up --build -d

cd ../summarize-text
docker-compose up --build -d

cd ../proxy
docker-compose up --build -d
```
2. Spustenie frontendu

Frontend (v priečinku PDF) sa spúšťa manuálne cez npm:
```
cd PDF
npm install
npm start
```
Frontend sa spustí na http://localhost:3000
Backendové služby sú prístupné cez reverzné proxy na http://localhost:88.
📄 Dokumentácia

Podrobný popis fungovania aplikácie nájdeš v diplomovej práci, najmä v kapitolách:

    3.7 Frontend aplikácie a interakcia s backendom

    3.8 Celkový priebeh fungovania aplikácie

🧠 Funkcionalita v skratke

    Používateľ nahraje PDF súbor cez frontend.

    Backendová služba extrahuje text, rozdelí ho na bloky a vygeneruje embeddingy.

    Tieto embeddingy sa uložia do Elasticsearch.

    Používateľ zadá otázku – systém vygeneruje embedding otázky a nájde podobné texty.

    Výsledné texty sú odoslané do sumarizačnej služby, ktorá vygeneruje zhrnutie.

    Výstup sa zobrazí vo webovej aplikácii.

✍️ Autor

Bc. Michal Tirpák
Technická univerzita v Košiciach
Fakulta elektrotechniky a informatiky
Diplomová práca, 2025
