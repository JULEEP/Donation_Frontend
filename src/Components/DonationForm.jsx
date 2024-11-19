import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import './UpdateDonation.css';

const DonationForm = () => {
  // Getting the donationId from the URL parameters using useParams
  const { donationId } = useParams();
  const navigate = useNavigate();  // useNavigate instead of useHistory

  const [donationData, setDonationData] = useState({
    amount: '',
    status: '',
    donorName: '',
    donationDate: '',
    paymentMethod: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch donation data on component mount
  useEffect(() => {
    if (!donationId) {
      setError('Invalid donation ID');
      setLoading(false);
      return;
    }

    const fetchDonation = async () => {
      try {
        const response = await axios.get(`https://donation-back.onrender.com/api/donations/donation/${donationId}`);
        if (response.data.success) {
          setDonationData(response.data.donation);
        } else {
          setError('Donation not found');
        }
      } catch (err) {
        console.error('Error fetching donation data', err);
        setError('Error fetching donation data');
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationData({
      ...donationData,
      [name]: value,
    });
  };

// Handle form submission (Save changes)
const handleSave = async (e) => {
  e.preventDefault();
  if (!donationId) {
    alert('Invalid donation ID');
    return;
  }

  try {
    const response = await axios.put(
      `http://localhost:4000/api/donations/update-donation/${donationId}`,
      donationData
    );
    if (response.data.success) {
      alert('Donation updated successfully!');
      navigate('/donation-data');  // Navigate to /donation-data instead of /donations/${donationId}
    } else {
      alert('Failed to update donation');
    }
  } catch (error) {
    console.error('Error updating donation', error);
    alert('Error updating donation!');
  }
};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="donation-form">
      <h2>Edit Donation</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={donationData.amount || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            id="status"
            name="status"
            value={donationData.status || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="donorName">Donor Name</label>
          <input
            type="text"
            id="donorName"
            name="donorName"
            value={donationData.donorName || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="donationDate">Donation Date</label>
          <input
            type="date"
            id="donationDate"
            name="donationDate"
            value={donationData.donationDate || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <input
            type="text"
            id="paymentMethod"
            name="paymentMethod"
            value={donationData.paymentMethod || ''}
            onChange={handleChange}
          />
        </div>

        <button className="save-button" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
