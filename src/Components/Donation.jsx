import React, { useState } from 'react';
import axios from 'axios';
import './Donation.css';

const Donation = () => {
  const [amount, setAmount] = useState('');  // Amount entered by user
  const [qrCode, setQrCode] = useState(null);  // QR code state to hold the generated QR code
  const [donationId, setDonationId] = useState('');  // Donation ID to store after donation creation
  const [message, setMessage] = useState('');  // Message state to show success or error messages
  const [statusUpdated, setStatusUpdated] = useState(false);  // To track if status is updated to 'paid'
  const [invoiceUrl, setInvoiceUrl] = useState(null); // To store the URL of the generated invoice
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false); // To track if the invoice has been downloaded

  // Handle change in donation amount input field
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // Handle donation process
  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid donation amount.');
      return;
    }

    try {
      // Sending donation amount to the backend to generate the QR code and donation ID
      const response = await axios.post('https://donation-backend-tu84.onrender.com/api/donations/create-donations', { amount });

      if (response.data.success) {
        setMessage('Donation created successfully!');
        setQrCode(response.data.qr_code);  // Set the QR code from response
        setDonationId(response.data.donationId);  // Set the donation ID from response
        setStatusUpdated(false);  // Reset status update flag
        setInvoiceUrl(null);  // Reset invoice URL
        setInvoiceDownloaded(false); // Reset invoice downloaded flag
      } else {
        setMessage(response.data.error || 'Donation creation failed.');
      }
    } catch (error) {
      setMessage('Error generating donation QR code.');
      console.error('Error generating donation QR code:', error);
    }
  };

  // Update donation status to 'paid'
  const handleUpdateStatus = async () => {
    if (!donationId) {
      setMessage('Please make a donation first to update the status.');
      return;
    }

    try {
      // Send PUT request to update donation status to 'paid'
      const response = await axios.put(`https://donation-backend-tu84.onrender.com/api/donations/update-status/${donationId}`);

      if (response.data.success) {
        setMessage('Donation status updated to paid!');
        setStatusUpdated(true);  // Set flag to indicate that the status has been updated
      } else {
        setMessage(response.data.message || 'Failed to update donation status.');
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
      setMessage('Error updating donation status.');
    }
  };

  // Handle downloading the invoice
  const handleDownloadInvoice = async () => {
    if (!donationId) {
      setMessage('Please make a donation first to download the invoice.');
      return;
    }

    try {
      // Send POST request to the backend to generate the invoice
      const response = await axios.post(`https://donation-backend-tu84.onrender.com/api/donations/download-invoice/${donationId}`, null, {
        responseType: 'blob', // Important to handle binary data (file)
      });

      // Check if invoice generation was successful
      if (response.data) {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        setInvoiceUrl(fileURL);

        // Trigger file download
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `donation_invoice_${donationId}.pdf`;
        link.click();

        // Update the state to indicate that the invoice has been downloaded
        setInvoiceDownloaded(true);
      } else {
        setMessage('Failed to generate invoice.');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      setMessage('Error generating invoice.');
    }
  };

  return (
    <div className="donation-container">
    <p>
    Donate to <span>Shri Gopal Ganpati Devasthan</span> Trust
  </p>
  <input
        type="number"
        placeholder="Enter donation amount (INR)"
        value={amount}
        onChange={handleAmountChange}
      />
      <button onClick={handleDonate}>Donate</button>

      {message && <p>{message}</p>}

      {/* Show QR code only if status is not updated to 'paid' */}
      {qrCode && !statusUpdated && (
        <div>
          <h3>Scan this QR code to make a payment:</h3>
          <img src={qrCode} alt="Donation QR Code" />
        </div>
      )}

      {donationId && (
        <div className="donation-id-container">
          <button onClick={handleUpdateStatus} disabled={statusUpdated}>
            {statusUpdated ? 'Status Paid' : 'Mark as Paid'}
          </button>

          {/* Show 'Download Invoice' button when donation status is 'paid' */}
          {statusUpdated && (
            <button
              onClick={handleDownloadInvoice}
              className={`download-invoice-btn ${invoiceDownloaded ? 'downloaded' : ''}`}
              disabled={invoiceDownloaded} // Disable the button after invoice download
            >
              {invoiceDownloaded ? 'Invoice Downloaded' : 'Download Invoice'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Donation;
