
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import FlightResults from "./pages/FlightResult";
import VerifyOTP from "./pages/VerifyOTP";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Promo from "./pages/Promo";
import Help from "./pages/Help";
import Order from "./pages/Order";
import BookingResponse from "./pages/BookingResponse";
import { ModalProvider } from "./Auth/ModalContext";
import "./index.css";
import Masterdata from "./pages/Masterdata";
import AddTraveller from "./pages/AddTraveller";
import {CurrencyProvider}  from '../src/components/CurrencyContext';
import Payment from "./pages/Payment";
const App = () => {
  return (
    <ModalProvider>
      <CurrencyProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/results" element={<FlightResults />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/help" element={<Help />} />
          <Route path="/order" element={<Order />} />
          <Route path="/booking" element={<BookingResponse />} />
          <Route path="/masterdata" element={<Masterdata />} />
          <Route path="/add-traveller/:id?" element={<AddTraveller />} />
          <Route path="/payment" element={<Payment/>} />
        </Routes>
        </CurrencyProvider>
    </ModalProvider>
  );
};

export default App;