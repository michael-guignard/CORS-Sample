from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)

# Default CORS configuration
cors_config = {
    "allow_origins": [],  # Empty by default to demonstrate CORS blocking
    "allow_methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type"],
    "allow_credentials": False
}

# Initialize CORS with default settings
CORS(app, resources={
    r"/*": {
        "origins": cors_config["allow_origins"],
        "methods": cors_config["allow_methods"],
        "allow_headers": cors_config["allow_headers"],
        "supports_credentials": cors_config["allow_credentials"]
    }
})

@app.route('/api/config/cors', methods=['GET', 'POST'])
def handle_cors_config():
    global cors_config
    if request.method == 'POST':
        new_config = request.json
        cors_config.update(new_config)
        # Update CORS settings
        CORS(app, resources={
            r"/*": {
                "origins": cors_config["allow_origins"],
                "methods": cors_config["allow_methods"],
                "allow_headers": cors_config["allow_headers"],
                "supports_credentials": cors_config["allow_credentials"]
            }
        })
        return jsonify({"message": "CORS configuration updated", "config": cors_config})
    return jsonify(cors_config)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        "message": "Data from secondary API",
        "server": "secondary",
        "cors_config": cors_config
    })

@app.route('/api/echo', methods=['POST'])
def echo_data():
    data = request.json
    return jsonify({
        "message": "Echo from secondary API",
        "received_data": data,
        "server": "secondary"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 