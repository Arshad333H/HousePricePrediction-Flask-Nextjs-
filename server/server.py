from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/get_location_names", methods=["GET"])
def get_location_names():
    try:
        locations = util.get_location_names()
        return jsonify({
            'locations': locations,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route("/predict_home_price", methods=["POST"])
def predict_home_price():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(field in data for field in ['total_sqft', 'bhk', 'bath', 'location']):
            return jsonify({
                'error': 'Missing required fields',
                'status': 'error'
            }), 400

        # Get prediction
        estimated_price = util.get_estimated_price(
            data["location"],
            float(data["total_sqft"]),
            int(data["bhk"]),
            int(data["bath"])
        )

        return jsonify({
            'estimated_price': estimated_price,
            'status': 'success'
        })
        
    except ValueError as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == "__main__":
    print("Starting Python Flask Server...")
    util.load_saved_artifacts()  # Pre-load artifacts
    app.run(host='0.0.0.0', port=5000, debug=True)