"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PricePredictionForm = () => {
  const [formData, setFormData] = useState({
    total_sqft: '',
    bhk: '',
    bath: '',
    location: ''
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // Fetch locations on component mount
  useEffect(() => {
    fetch('https://housepriceprediction-flask-nextjs-12.onrender.com/get_location_names')
      .then(response => response.json())
      .then(data => setLocations(data.locations))
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEstimatedPrice(null);

    try {
      const response = await fetch('https://housepriceprediction-flask-nextjs-12.onrender.com/predict_home_price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total_sqft: parseFloat(formData.total_sqft),
          bhk: parseInt(formData.bhk),
          bath: parseInt(formData.bath),
          location: formData.location
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEstimatedPrice(data.estimated_price);
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400 rounded-full"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 relative z-10"
      >
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold">Bangalore Home Price Predictor</h1>
          <p className="mt-2 opacity-90">Get an accurate estimate for your dream home</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Square Feet Input */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="total_sqft" className="block text-sm font-medium text-gray-700 mb-1">
              Area (Square Feet)
            </label>
            <input
              type="number"
              id="total_sqft"
              name="total_sqft"
              value={formData.total_sqft}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400"
              min="300"
              max={"10000"}
              required
              placeholder="Enter total square feet"
            />
          </motion.div>

          {/* BHK Selection */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <div key={`bhk-${num}`} className="flex items-center">
                  <input
                    type="radio"
                    id={`bhk-${num}`}
                    name="bhk"
                    value={num}
                    checked={formData.bhk === num.toString()}
                    onChange={handleChange}
                    className="hidden peer"
                    required
                  />
                  <motion.label
                    htmlFor={`bhk-${num}`}
                    className="w-full py-3 text-center border border-gray-300 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white cursor-pointer transition-all duration-200 text-gray-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {num}
                  </motion.label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bathrooms Selection */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <div key={`bath-${num}`} className="flex items-center">
                  <input
                    type="radio"
                    id={`bath-${num}`}
                    name="bath"
                    value={num}
                    checked={formData.bath === num.toString()}
                    onChange={handleChange}
                    className="hidden peer"
                    required
                  />
                  <motion.label
                    htmlFor={`bath-${num}`}
                    className="w-full py-3 text-center border border-gray-300 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white cursor-pointer transition-all duration-200 text-gray-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {num}
                  </motion.label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Location Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800"
              required
            >
              <option value="" disabled className="text-gray-400">Select Location</option>
              {locations.map(location => (
                <option key={location} value={location} className="text-gray-800">{location}</option>
              ))}
            </select>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all flex items-center justify-center ${
                loading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Predicting...
                </>
              ) : (
                'Estimate Price'
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-6 mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded"
          >
            {error}
          </motion.div>
        )}

        {/* Result Display */}
        {estimatedPrice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 mx-6 mb-6 p-5 rounded-lg border border-blue-100 text-center"
          >
            <h2 className="text-lg font-medium text-blue-800 mb-2">Estimated Price</h2>
            <motion.p 
              className="text-3xl font-bold text-blue-600"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ₹{estimatedPrice} Lakhs
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PricePredictionForm;