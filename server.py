from flask import Flask, jsonify
import json
import os

# Create Flask application
app = Flask(__name__)

# Main endpoint that returns the scraped data
@app.route("/")
def get_scraped_data():
    print("Received request for scraped data")

    data_file = "scraped_data.json"

    # Check if the scraped data file exists
    if not os.path.exists(data_file):
        print("Scraped data file not found")
        return jsonify({"error": "Scraped data is not available"}), 404

    # Read the JSON data from file
    with open(data_file, "r") as file:
        data = json.load(file)

    print("Sending scraped data as response")
    return jsonify(data)


# Health check endpoint to confirm the server is running
@app.route("/health")
def health_check():
    print("Health check request received")
    return {"status": "running"}


# Start the Flask server
if __name__ == "__main__":
    print("Starting Flask server on port 5000")
    app.run(host="0.0.0.0", port=5000)