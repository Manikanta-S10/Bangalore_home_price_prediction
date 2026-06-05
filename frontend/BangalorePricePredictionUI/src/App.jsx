import { useEffect, useState } from "react";
import { getLocations, predictHomePrice } from "./api";
import "./App.css";

function App() {
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    location: "",
    sqft: "",
    bath: "",
    bhk: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);

        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            location: data[0],
          }));
        }
      } catch (err) {
        setError("Unable to load locations from backend.");
      } finally {
        setLocationLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setPrediction(null);
    setError("");

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.location) {
      return "Please select a location.";
    }

    if (!formData.sqft || Number(formData.sqft) <= 0) {
      return "Please enter a valid square feet value.";
    }

    if (!formData.bath || Number(formData.bath) < 0) {
      return "Please enter a valid number of bathrooms.";
    }

    if (!formData.bhk || Number(formData.bhk) < 0) {
      return "Please enter a valid BHK value.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      location: formData.location,
      sqft: Number(formData.sqft),
      bath: Number(formData.bath),
      bhk: Number(formData.bhk),
    };

    try {
      setLoading(true);
      setError("");

      const result = await predictHomePrice(payload);
      setPrediction(result);
    } catch (err) {
      setError("Prediction failed. Please check backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="hero-section">
        <div className="hero-content">
          <p className="tagline">Machine Learning Project</p>
          <h1>Bangalore Home Price Predictor</h1>
          <p className="subtitle">
            Estimate property prices using location, area, bathrooms, and BHK.
          </p>
        </div>
      </div>

      <div className="main-card">
        <div className="form-section">
          <h2>Enter Property Details</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Location</label>

              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <option>Loading locations...</option>
                ) : (
                  locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="input-group">
              <label>Total Square Feet</label>
              <input
                type="number"
                name="sqft"
                placeholder="Example: 1000"
                value={formData.sqft}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bath"
                  placeholder="Example: 2"
                  value={formData.bath}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>BHK</label>
                <input
                  type="number"
                  name="bhk"
                  placeholder="Example: 2"
                  value={formData.bhk}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Predicting..." : "Predict Price"}
            </button>
          </form>
        </div>

        <div className="result-section">
          <h2>Prediction Result</h2>

          {!prediction && (
            <div className="empty-result">
              <p>Your estimated home price will appear here.</p>
            </div>
          )}

          {prediction && (
            <div className="prediction-card">
              <p className="result-label">Estimated Price</p>
              <h3>₹ {prediction.estimated_price} Lakhs</h3>

              <div className="details">
                <p>
                  <strong>Location:</strong> {prediction.input.location}
                </p>
                <p>
                  <strong>Area:</strong> {prediction.input.sqft} sqft
                </p>
                <p>
                  <strong>Bathrooms:</strong> {prediction.input.bath}
                </p>
                <p>
                  <strong>BHK:</strong> {prediction.input.bhk}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer>
        Built with React, Django REST Framework, and Machine Learning
      </footer>
    </div>
  );
}

export default App;
