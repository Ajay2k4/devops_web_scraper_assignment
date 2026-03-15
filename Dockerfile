# -----------------------------
    # Stage 1: Run the Node.js scraper
    # -----------------------------
    
    FROM node:18-slim AS scraper
    
    # Set working directory
    WORKDIR /app
    
    # Copy Node dependency file
    COPY package.json .
    
    # Install Node dependencies
    RUN npm install
    
    # Install Chromium browser required by Puppeteer
    RUN apt-get update && \
        apt-get install -y chromium && \
        rm -rf /var/lib/apt/lists/*
    
    # Tell Puppeteer not to download its own Chromium
    ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    
    # Copy scraper script
    COPY scrape.js .
    
    # URL to scrape (can be overridden at build time)
    ARG SCRAPE_URL=https://wikipedia.org
    ENV SCRAPE_URL=$SCRAPE_URL
    
    # Run scraper to generate the JSON output
    RUN node scrape.js
    
    
    # -----------------------------
    # Stage 2: Run the Python server
    # -----------------------------
    
    FROM python:3.10-slim
    
    # Set working directory
    WORKDIR /app
    
    # Copy the scraped data from the previous stage
    COPY --from=scraper /app/scraped_data.json .
    
    # Copy Python server files
    COPY server.py .
    COPY requirements.txt .
    
    # Install Python dependencies
    RUN pip install -r requirements.txt
    
    # Expose Flask port
    EXPOSE 5000
    
    # Start the Flask server
    CMD ["python", "server.py"]