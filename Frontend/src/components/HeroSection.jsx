

import React from 'react';
import SearchForm from '../section/SearchForm';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useModal } from '../Auth/ModalContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showModalMessage } = useModal();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      showModalMessage('You are already logged in.');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="bg-gray-900 text-white mx-4 mt-1 my-6 lg:mx-8 lg:mt-2 lg:my-10 rounded-3xl p-6 lg:p-12 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-4xl font-bold">
            Your Gateway to Effortless <span className="text-blue-400">Flight Booking</span> and Unbeatable Deals!
          </h1>
          <p className="mt-4 text-gray-300">
            Let us take care of the details while you focus on creating unforgettable travel memories!
          </p>
          <Button
            className="mt-6 bg-blue-600 hover:bg-blue-400 px-6 py-3 rounded-4xl text-lg font-semibold"
            onClick={handleGetStarted}
          >
            Getting Started
          </Button>
        </div>
        <div className="w-full">
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
