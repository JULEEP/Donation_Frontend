import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./HomePage.css";

// Import images directly
import Image1 from '../Images/Image1.jpeg';
import Image2 from '../Images/Image2.jpeg';
import Image3 from '../Images/Image3.jpeg';
import Image4 from '../Images/Image4.jpeg';

const HomePage = () => {
  const navigate = useNavigate();  // Hook to navigate programmatically
  
  // List of background images (using imported images)
  const images = [
    Image1,
    Image2,
    Image3,
    Image4,
  ];

  // List of circular images to display
  const circleImages = [
    'https://5.imimg.com/data5/ANDROID/Default/2023/7/323817792/YA/IV/KY/74384735/product-jpeg-500x500.jpg',
    'https://i.etsystatic.com/isla/416b94/21049782/isla_fullxfull.21049782_pjxgb5qa.jpg?version=0',
    'https://cdn2.vectorstock.com/i/thumb-large/18/36/golden-ganesh-puja-ganesh-chaturthi-sign-vector-43861836.jpg',
    'https://cdn.vectorstock.com/i/preview-1x/18/10/golden-ganesh-puja-ganesh-chaturthi-sign-vector-43861810.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCircleImageIndex, setCurrentCircleImageIndex] = useState(0); // State for circular images

  // Function to handle image slide for background and circular images
  const handleImageSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setCurrentCircleImageIndex((prevIndex) => (prevIndex + 1) % circleImages.length); // Update circular image
  };

  // Automatically change the image every 3 seconds
  useEffect(() => {
    const interval = setInterval(handleImageSlide, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);  // Cleanup interval on component unmount
  }, []);

  const handleDonateClick = () => {
    navigate("/donation");  // Navigate to the /donation route when clicked
  };

  return (
    <div className="home-page" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
      <div className="left-side">
        <h1>श्री गोपाळ गणपती देवस्थान ट्रस्ट फर्मागुडी बांदिवडे फोंडा</h1>
        <button className="donate-button" onClick={handleDonateClick}>
          Donate
        </button>
      </div>

      <div className="right-side">
        <div className="image-container">
          <img 
            src={circleImages[currentCircleImageIndex]}  // Using circular images array
            alt="Circle Slide" 
            className="slider-image" 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
