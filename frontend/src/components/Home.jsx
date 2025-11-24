import React from 'react';
import '../App.css';
import Cards from './Cards';
import HeroSection from './HeroSection';
import Footer from './Footer';
import Navbar from './Navbar';
import PopularDestinationsIndia from './PopularDestinationsIndia';
import UniqueExperiences from './UniqueExperiences';

function Home() {
  return (
    <>
      <Navbar/>
      <HeroSection />
      <PopularDestinationsIndia />
      <Cards />
      <UniqueExperiences />
      <Footer />
    </>
  );
}

export default Home;
