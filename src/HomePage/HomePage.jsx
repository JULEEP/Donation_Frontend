import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();  // Hook to navigate programmatically
  const image =
    "https://static.vecteezy.com/system/resources/previews/006/847/169/non_2x/donate-for-ukraine-2d-isolated-illustration-vector.jpg";

  const handleDonateClick = () => {
    navigate("/donation");  // Navigate to the /donation route when clicked
  };

  return (
    <div className="home-page">
      <div className="left-side">
        <h1>Shri Gopal Ganpati Devasthan Trust</h1>
        <button className="donate-button" onClick={handleDonateClick}>
          Donate
        </button>
      </div>

      <div className="right-side">
        <div className="image-container">
          <img src={image} alt="Donate Illustration" className="slider-image" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
