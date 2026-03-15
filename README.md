# DevOps Assignment – Web Scraper with Docker

## Overview

This project demonstrates a simple containerized application that combines **Node.js** and **Python** using a **multi-stage Docker build**.

The application performs two main tasks:

1. **Scrapes a webpage** using Node.js with Puppeteer and a headless Chromium browser.
2. **Hosts the scraped data** using a Python Flask server that returns the result as JSON.

The purpose of this assignment is to show how different technologies can work together inside a Docker container while keeping the final image lightweight.

---

## How the Application Works

The workflow of the application is:

```
User provides a URL
        ↓
Node.js + Puppeteer launches a headless browser
        ↓
The script extracts the page title and first heading
        ↓
Scraped data is saved as a JSON file
        ↓
Python Flask server reads the JSON file
        ↓
Flask exposes an HTTP endpoint that returns the data
```

The Dockerfile uses a **multi-stage build**:

* **Stage 1 (Scraper Stage)**
  Uses Node.js to run the Puppeteer script and generate the scraped JSON file.

* **Stage 2 (Server Stage)**
  Uses Python and Flask to host the scraped data through a web API.

This approach ensures that the final container only includes the necessary runtime components.

---

## Project Structure

```
web-scraper-docker
│
├── Dockerfile
├── scrape.js
├── server.py
├── package.json
├── requirements.txt
├── README.md
└── .dockerignore
```

### File Description

| File             | Description                              |
| ---------------- | ---------------------------------------- |
| Dockerfile       | Multi-stage Docker build configuration   |
| scrape.js        | Node.js script that scrapes webpage data |
| server.py        | Python Flask server to return JSON data  |
| package.json     | Node.js dependencies                     |
| requirements.txt | Python dependencies                      |
| .dockerignore    | Files excluded from Docker build         |
| README.md        | Project documentation                    |

---

## Technologies Used

* **Docker**
* **Node.js**
* **Puppeteer**
* **Chromium**
* **Python**
* **Flask**
* **JSON**

---

## Prerequisites

Make sure the following tools are installed:

* Docker
* Node.js (optional for local testing)
* Python 3 (optional for local testing)

Check installation:

```
docker --version
node --version
python --version
```

---

## Building the Docker Image

Navigate to the project folder and run:

```
docker build -t scraper-app .
```

During the build process:

* Node.js installs dependencies
* Puppeteer launches Chromium
* The target webpage is scraped
* The extracted data is stored in `scraped_data.json`
* The final image is prepared with the Python Flask server

---

## Running the Container

After the image is built, run:

```
docker run -p 5000:5000 scraper-app
```

This starts the Flask web server inside the container.

---

## Accessing the Application

Open your browser and visit:

```
http://localhost:5000
```

The server will return the scraped data in JSON format.

Example response:

```
{
  "title": "Example Domain",
  "heading": "Example Domain"
}
```

---

## Passing a Different URL

You can provide a different URL at build time:

```
docker build \
--build-arg SCRAPE_URL=https://example.com \
-t scraper-app .
```

Then run the container as usual:

```
docker run -p 5000:5000 scraper-app
```

---

## Additional Endpoints

Health check endpoint:

```
http://localhost:5000/health
```

Response:

```
{
  "status": "running"
}
```

---

## Design Decisions

* **Puppeteer** was used because it can scrape pages that require a real browser environment.
* **Flask** was chosen since it is lightweight and easy to use for simple APIs.
* **Multi-stage Docker build** was used to keep the final container image smaller by separating the scraping stage from the runtime server stage.

---

## Possible Improvements

Some potential improvements for future versions include:

* Adding better error handling for invalid URLs
* Scraping additional webpage elements
* Adding structured logging
* Scheduling periodic scraping
* Caching scraped results

---

## Author

Ajay

This project was created as part of a **DevOps internship assignment** to demonstrate containerization, web scraping, and API hosting using Docker.
