import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './DonationTable.css';

const DonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('https://donation-backend-tu84.onrender.com/api/donations/get-donations');
        if (response.data.success) {
          setDonations(response.data.donations);
        } else {
          setError('No donations found.');
        }
      } catch (error) {
        setError('Error fetching donations.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const indexOfLastDonation = currentPage * itemsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - itemsPerPage;
  const currentDonations = donations.slice(indexOfFirstDonation, indexOfLastDonation);
  const totalPages = Math.ceil(donations.length / itemsPerPage);

  const handleEdit = (donationId) => {
    window.location.href = `/edit-donation/${donationId}`;
  };

  const handleDelete = async (donationId) => {
    if (window.confirm(`Are you sure you want to delete donation with ID: ${donationId}?`)) {
      try {
        const response = await axios.delete(`https://donation-backend-tu84.onrender.com/api/donations/delete-donation/${donationId}`);
        if (response.data.success) {
          // Filter out the deleted donation based on donationId
          setDonations(donations.filter(donation => donation.donationId !== donationId));
          alert(`Donation with ID: ${donationId} deleted successfully.`);
        } else {
          alert(`Error deleting donation. Donation ID: ${donationId}`);
        }
      } catch (error) {
        console.error('Error deleting donation:', error);
        alert(`Error deleting donation. Donation ID: ${donationId}`);
      }
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading donations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="donation-table-container">
      <h1>Donation Records</h1>
      <table className="donation-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Status</th>
            <th>Donor Name</th>
            <th>Donation Date</th>
            <th>Payment Method</th>
            <th>Donation Type</th>
            <th>Relation</th>
            <th>Donation ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDonations.map((donation) => (
            <tr key={donation.donationId}>
              <td>{donation.amount || 'N/A'}</td>
              <td>{donation.status || 'N/A'}</td>
              <td>{donation.donorName || 'N/A'}</td>
              <td>{donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'N/A'}</td>
              <td>{donation.paymentMethod || 'N/A'}</td>
              <td>{donation.donationType || 'N/A'}</td>
              <td>{donation.relation || 'N/A'}</td>
              <td>{donation.donationId || 'N/A'}</td>
              <td>
                <button onClick={() => handleEdit(donation.donationId)} className="action-button edit-button">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(donation.donationId)} className="action-button delete-button">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DonationTable;
