import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/Home';

import PlannerPage from './components/PlannerPage';
import Explore from './pages/Explore';
import AuthPage from './pages/AuthPage';
import CityList from './pages/CityList';
import Packages from './pages/Packages';
import Payment from './pages/Payment';
import { AuthProvider } from './context/AuthContext';
import CityDestinations from './pages/CityDestinations';
import PackageDetail from './pages/PackageDetail';
import PopularDestinationsIndia from './components/PopularDestinationsIndia';
import Bookings from './pages/Bookings';
import PackagePlanner from './components/PackagePlanner';

const App = () => {


  return (
    <AuthProvider>
      <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/popular-destinations" element={<PopularDestinationsIndia />} />
        <Route path="/cities" element={<CityList />} />
        <Route path="/planner/:locationId" element={<PlannerPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path='/explore' element={<Explore />} />
        <Route path="/packages/:destinationId" element={<Packages />} />
        <Route path="/payment/:packageId" element={<Payment />} />
        <Route path="/city/:cityId/destinations" element={<CityDestinations />} />
        <Route path="/destinations/:destinationId/packages" element={<Packages />} />
        <Route path="/package/:id" element={<PackageDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/package-planner/:packageId" element={<PackagePlanner />} />
      </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
