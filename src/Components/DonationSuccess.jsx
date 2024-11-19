import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const DonationSuccess = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    if (sessionId) {
      axios.get(`http://localhost:4000/payment-success?session_id=${sessionId}`)
        .then((response) => {
          setPaymentStatus(response.data.message);
        })
        .catch((error) => {
          setPaymentStatus('Payment verification failed.');
        });
    }
  }, [location.search]);

  return (
    <div>
      <h2>{paymentStatus}</h2>
    </div>
  );
};

export default DonationSuccess;
