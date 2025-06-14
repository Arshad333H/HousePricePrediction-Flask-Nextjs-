import pickle
import json
import numpy as np
import os

__locations = None
__data_columns = None
__model = None

def load_saved_artifacts():
    global __data_columns, __locations, __model
    
    try:
        # Get absolute paths
        base_dir = os.path.dirname(os.path.abspath(__file__))
        columns_path = os.path.join(base_dir, "artifacts", "columns.json")
        model_path = os.path.join(base_dir, "artifacts", "banglore_home_prices_model.pickle")

        # Load columns
        with open("./artifacts/columns.json", "r") as f:
            data = json.load(f)
            __data_columns = data['data_columns']
            __locations = __data_columns[3:] 

        # Load model
        with open("./artifacts/Price_prediction_Model_In_Banglore.pickle", "rb") as f:
            __model = pickle.load(f)

    except Exception as e:
        raise RuntimeError(f"Error loading artifacts: {str(e)}")

def get_estimated_price(location, sqft, bhk, bath):
    try:
        if __model is None or __data_columns is None:
            load_saved_artifacts()

        loc_index = __data_columns.index(location.lower()) if location.lower() in __data_columns else -1

        x = np.zeros(len(__data_columns))
        x[0] = sqft
        x[1] = bath
        x[2] = bhk
        if loc_index >= 0:
            x[loc_index] = 1

        return round(__model.predict([x])[0], 2)
        
    except Exception as e:
        raise ValueError(f"Prediction failed: {str(e)}")

def get_location_names():
    if __locations is None:
        load_saved_artifacts()
    return __locations

if __name__ == '__main__':
    print("Testing the model...")
    load_saved_artifacts()
    print("Locations:", get_location_names())
    print("Price for 1000 sqft, 2 bhk, 2 bath in 1st Phase JP Nagar:", 
          get_estimated_price("1st Phase JP Nagar", 1000, 2, 2))