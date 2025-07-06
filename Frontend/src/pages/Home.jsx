// import React from "react";
// import Navbar from "../components/Navbar";
// import HeroSection from "../components/HeroSection";

// import Footer from "../components/Footer";
// import Offers from "../section/Offers";
// import BlogSection from "../section/BlogSection";

// import  Discover  from "../section/Discover";
// import Services from "../section/Services";
// import Destinations from "../section/Destinations";

// const Home = () => {
//   return (
//     <>
//       <Navbar />
//       <HeroSection />
//       <Services/>
//       <Discover/>      
//       <Destinations/>
//       <Offers />
//       <BlogSection />
//       <Footer />
//     </>
//   );
// };
// export default Home;
import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import Offers from '../section/Offers';
import BlogSection from '../section/BlogSection';
import Discover from '../section/Discover';
import Services from '../section/Services';
import Destinations from '../section/Destinations';
import CountryPopup from '../section/CountryPopup';

import { CurrencyContext } from '../components/CurrencyContext';

const Home = () => {
  const { selectedCountry } = useContext(CurrencyContext);

  const handleClosePopup = () => {
    // No need to manage showPopup state; popup is controlled by selectedCountry
  };

  return (
    <>
      {!selectedCountry && <CountryPopup onClose={handleClosePopup} />}
      <Navbar />
      <HeroSection />
      <Services />
      <Discover />
      <Destinations />
      <Offers />
      <BlogSection />
      <Footer />
    </>
  );
};

export default Home;