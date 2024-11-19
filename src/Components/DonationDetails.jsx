import React, { useState } from 'react';
import axios from 'axios';

const DonationDetails = () => {
  const [donationId, setDonationId] = useState('');  // Donation ID entered by user
  const [donationDetails, setDonationDetails] = useState(null);  // State to hold the fetched donation details
  const [error, setError] = useState('');  // State to show error message

  // Handle change in donation ID input field
  const handleDonationIdChange = (e) => {
    setDonationId(e.target.value);
  };

  // Handle fetching donation details by ID
  const fetchDonationDetails = async () => {
    if (!donationId.trim()) {
      setError('Please enter a valid Donation ID.');
      return;
    }

    try {
      // Make API request to get donation details by ID
      const response = await axios.get(`https://donation-backend-tu84.onrender.com/api/donations/donation/${donationId}`);

      if (response.data.success) {
        setDonationDetails(response.data.donation);  // Set the fetched donation details
        setError('');  // Clear error message
      } else {
        setError('Donation not found.');
        setDonationDetails(null);  // Clear previous donation details
      }
    } catch (error) {
      console.error('Error fetching donation details:', error);
      setError('An error occurred while fetching the donation details.');
      setDonationDetails(null);  // Clear previous donation details
    }
  };

  return (
    <div className="donation-details-container">
      <h1>Donation Details</h1>
      
      {/* Input for donation ID */}
      <input
        type="text"
        placeholder="Enter Donation ID"
        value={donationId}
        onChange={handleDonationIdChange}
      />
      <button onClick={fetchDonationDetails}>Get Donation Details</button>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display Donation Details */}
      {donationDetails && (
        <div className="donation-details">
          <div className="result-item">
            <label>Amount:</label>
            <p>₹{donationDetails.amount}</p>
          </div>
          <div className="result-item">
            <label>UPI Link:</label>
            <p><a href={donationDetails.upiLink} target="_blank" rel="noopener noreferrer">{donationDetails.upiLink}</a></p>
          </div>
          <div className="result-item">
            <label>Status:</label>
            <p>{donationDetails.status}</p>
          </div>
          <div className="result-item qr-code">
            <label>QR Code:</label>
            <img src={donationDetails.qrCodeUrl} alt="Donation QR Code" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
