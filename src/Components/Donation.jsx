import React, { useState } from 'react';
import axios from 'axios';
import './Donation.css'; // Import the CSS file

const Donation = () => {
  const amounts = ['50', '10', '20', '100', '200', '500']; // Predefined donation amounts
  const purposes = ['Abhishek', 'Donation', 'Annadaan', 'Jeernoddhar']; // Purpose options for dropdown
  const [selectedAmount, setSelectedAmount] = useState(''); // The selected amount
  const [customAmount, setCustomAmount] = useState(''); // Custom amount input
  const [donorName, setDonorName] = useState(''); // Donor's name
  const [phoneNumber, setPhoneNumber] = useState(''); // Donor's phone number
  const [address, setAddress] = useState(''); // Donor's address
  const [purpose, setPurpose] = useState(''); // Purpose selection
  const [qrCode, setQrCode] = useState(null); // QR code state to hold the generated QR code
  const [donationId, setDonationId] = useState(''); // Donation ID to store after donation creation
  const [message, setMessage] = useState(''); // Message state to show success or error messages
  const [statusUpdated, setStatusUpdated] = useState(false); // To track if status is updated to 'paid'
  const [invoiceUrl, setInvoiceUrl] = useState(null); // To store the URL of the generated invoice
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false); // To track if the invoice has been downloaded
  const [upiLink, setUpiLink] = useState(''); // Store the generated UPI link

  // Handle selecting an amount from predefined options
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(''); // Clear custom amount when selecting a predefined one
  };

  // Handle change in custom amount input field
  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(''); // Clear selected amount when typing in custom amount
  };

  // Handle change in donor's name input field
  const handleDonorNameChange = (e) => {
    setDonorName(e.target.value);
  };

  // Handle change in phone number input field
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Handle change in address input field
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  // Handle change in purpose dropdown
  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
  };

  const handleDonate = async () => {
    const amountToDonate = selectedAmount || customAmount; // Use either selected or custom amount

    if (!amountToDonate) {
      setMessage('Please enter a donation amount.');
      return;
    }
    if (!donorName.trim()) {
      setMessage('Please enter your name.');
      return;
    }
    if (!phoneNumber.trim() || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!address.trim()) {
      setMessage('Please enter your address.');
      return;
    }
    if (!purpose) {
      setMessage('Please select a donation type.');
      return;
    }

    try {
      console.log("Sending request with:", { amount: amountToDonate, donorName, phoneNumber, address, purpose });

      // Make the POST request to the backend
      const response = await axios.post(
        'https://donation-back-1.onrender.com/api/donations/create-donations',
        { amount: amountToDonate, donorName, phoneNumber, address, purpose }
      );

      console.log("Backend response:", response.data);

      if (response.data.success) {
        setMessage('Donation created successfully!');
        setQrCode(response.data.qr_code); // Set the QR code from response
        setDonationId(response.data.donationId); // Set the donation ID from response
        setUpiLink(response.data.genericUPILink); // Set the UPI link for manual payment
      } else {
        setMessage(response.data.error || 'Donation creation failed.');
      }
    } catch (error) {
      console.error('Error generating donation QR code:', error);
      setMessage('Error generating donation QR code.');
    }
  };

  // Update donation status to 'paid'
  const handleUpdateStatus = async () => {
    if (!donationId) {
      setMessage('Please make a donation first to update the status.');
      return;
    }

    try {
      const response = await axios.put(`https://donation-back-1.onrender.com/api/donations/update-status/${donationId}`);

      if (response.data.success) {
        setMessage('Donation status updated to paid!');
        setStatusUpdated(true);
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
      const response = await axios.post(`https://donation-back-1.onrender.com/api/donations/download-invoice/${donationId}`, null, {
        responseType: 'blob',
      });

      if (response.data) {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        setInvoiceUrl(fileURL);

        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `donation_invoice_${donationId}.pdf`;
        link.click();

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
      <h4>Donate to <span>Shri Gopal Ganpati Devasthan</span> Trust</h4>

      <div className="amount-selection">
        {amounts.map((amount) => (
          <button
            key={amount}
            className={`amount-button ${selectedAmount === amount ? 'selected' : ''}`}
            onClick={() => handleAmountSelect(amount)}
          >
            ₹{amount}
          </button>
        ))}
      </div>

      {/* Custom donation amount input */}
      <input
        type="number"
        placeholder="Enter Amount"
        value={customAmount}
        onChange={handleCustomAmountChange}
      />

      {/* Donor name input */}
      <input
        type="text"
        placeholder="Enter your name"
        value={donorName}
        onChange={handleDonorNameChange}
      />

      {/* Phone number input */}
      <input
        type="text"
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />

      {/* Address input */}
      <input
        type="text"
        placeholder="Enter your address"
        value={address}
        onChange={handleAddressChange}
      />

      {/* Donation type dropdown */}
      <select
        value={purpose}
        onChange={handlePurposeChange}
        className="donation-type-dropdown"
      >
        <option value="">Choose Donation Type</option>
        {purposes.map((purposeOption) => (
          <option key={purposeOption} value={purposeOption}>
            {purposeOption}
          </option>
        ))}
      </select>
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
              disabled={invoiceDownloaded}
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
