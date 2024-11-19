import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import Donation from './Components/Donation';
import DonationSuccess from './Components/DonationSuccess';
import DonationDetails from './Components/DonationDetails';
import DonationTable from './Components/DonationTable';
function App() {
  return (
    <Router>
      <div className="App">
        <main>
          {/* Routes for different pages */}
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* HomePage component rendered on '/' */}
            <Route path="/about" element={<h2>About Us</h2>} />
            <Route path="/donation" element={<Donation/>} />
            <Route path="/donation-details" element={<DonationDetails/>} />
            <Route path="/success" element={<DonationSuccess/>} />
            <Route path="/donation-data" element={<DonationTable/>} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
