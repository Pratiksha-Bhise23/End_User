



// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Button from "../components/Button";

// const BookingResponse = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const bookingResponse = location.state?.bookingResponse;

//   useEffect(() => {
//     if (!bookingResponse) {
//       console.warn("No bookingResponse data found, redirecting to /results");
//       navigate("/results", { replace: true });
//     }
//   }, [location.state, bookingResponse, navigate]);

//   if (!bookingResponse) return null;

//   const {
//     departure = { iataCode: "N/A", terminal: "N/A", at: "" },
//     arrival = { iataCode: "N/A", terminal: "N/A", at: "" },
//     departureTime = "N/A",
//     arrivalTime = "N/A",
//     duration = "N/A",
//     stops = 0,
//     aircraft = "AIRBUS JET",
//     fare = 5387,
//     discount = 0,
//     insurance = 0,
//     additionalDiscount = 0,
//   } = bookingResponse;

//   const passengers = bookingResponse.passengers || {
//     adults: 1,
//     children: 0,
//     infants: 0,
//   };
//   const totalPassengers =
//     passengers.adults + passengers.children + passengers.infants;
//   const totalAmount = totalPassengers * fare;

//   const [travelerDetails, setTravelerDetails] = useState(
//     Array(totalPassengers)
//       .fill()
//       .map(() => ({
//         isOpen: false,
//         title: "",
//         firstName: "",
//         lastName: "",
//         dateOfBirth: "",
//         selectedTravelerId: null,
//       }))
//   );

//   const [contactInfo, setContactInfo] = useState({
//     email: "",
//     phone: "",
//     countryCode: "+91",
//     companyName: "",
//     gstin: "",
//     gstAddress: "",
//     gstPincode: "",
//     saveGst: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [masterTravelers, setMasterTravelers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addOnServices, setAddOnServices] = useState({
//     mealPreference: "None",
//     seatPreference: "None",
//     baggageUpgrade: false,
//     travelInsurance: false,
//   });
//   const [showGstinSection, setShowGstinSection] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const fetchMasterTravelers = async () => {
//       try {
//         const sessionToken = localStorage.getItem("sessionToken");
//         if (!sessionToken) throw new Error("No session token found");
//         const response = await fetch("http://localhost:3000/api/travelers", {
//           headers: { Authorization: `Bearer ${sessionToken}` },
//         });
//         if (!response.ok) throw new Error("Failed to fetch master travelers");
//         const data = await response.json();
//         if (data.status !== "success")
//           throw new Error(data.error || "Invalid response");
//         setMasterTravelers(data.travelers || []);
//       } catch (err) {
//         setError(
//           "Error loading master travelers. Please try again or add manually."
//         );
//         console.error("API Error:", err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMasterTravelers();
//   }, []);

//   const handleTravelerToggle = (index) => {
//     const updatedDetails = [...travelerDetails];
//     updatedDetails[index].isOpen = !updatedDetails[index].isOpen;
//     setTravelerDetails(updatedDetails);
//   };

//   const handleTravelerChange = (index, field, value) => {
//     const updatedDetails = [...travelerDetails];
//     updatedDetails[index][field] = value;
//     setTravelerDetails(updatedDetails);
//   };

//   const handleTravelerSelect = (index, travelerId) => {
//     const selectedTraveler = masterTravelers.find((t) => t.id === travelerId);
//     if (selectedTraveler) {
//       const updatedDetails = [...travelerDetails];
//       updatedDetails[index] = {
//         ...updatedDetails[index],
//         title: selectedTraveler.prefix || "",
//         firstName: selectedTraveler.first_name || "",
//         lastName: selectedTraveler.last_name || "",
//         dateOfBirth: "",
//         selectedTravelerId: travelerId,
//       };
//       setTravelerDetails(updatedDetails);
//     }
//   };

//   const handleContactChange = (field, value) => {
//     setContactInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddOnChange = (field, value) => {
//     setAddOnServices((prev) => ({ ...prev, [field]: value }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!contactInfo.email || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
//       newErrors.email = "Please enter a valid email address (required)";
//     }
//     if (!contactInfo.phone || !/^\+?\d{10,15}$/.test(contactInfo.phone)) {
//       newErrors.phone = "Please enter a valid phone number (10-15 digits, required)";
//     }
//     if (
//       contactInfo.gstin &&
//       !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/.test(
//         contactInfo.gstin
//       )
//     ) {
//       newErrors.gstin = "Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)";
//     }
//     travelerDetails.forEach((traveler, index) => {
//       if (
//         traveler.isOpen &&
//         (!traveler.title ||
//           !traveler.firstName ||
//           !traveler.lastName ||
//           !traveler.dateOfBirth)
//       ) {
//         newErrors[`traveler${index}`] =
//           "All fields are required for each traveler";
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       setShowPopup(true); // Show popup
//       // Auto-redirect after 2 seconds
//       setTimeout(() => {
//         setShowPopup(false);
//         navigate("/payment", {
//           state: { travelerDetails, contactInfo, bookingResponse, addOnServices },
//         });
//       }, 2000);
//     }
//   };

//   const handlePopupCancel = () => {
//     setShowPopup(false);
//   };

//   const getAvailableTravelers = (index) => {
//     const selectedIds = travelerDetails
//       .slice(0, index)
//       .map((t) => t.selectedTravelerId)
//       .filter((id) => id !== null);
//     const selectedMasterCount = selectedIds.filter((id) =>
//       masterTravelers.some((t) => t.id === id)
//     ).length;
//     return masterTravelers.filter(
//       (t) =>
//         !selectedIds.includes(t.id) &&
//         (totalPassengers <= 5 || selectedMasterCount < 5)
//     );
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 relative">
//       <h2 className="text-lg font-bold text-indigo-800 mb-6">
//         Review and Complete Your Booking
//       </h2>

//       {/* Travel Details Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Travel Details
//         </h3>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <p className="text-sm text-gray-600">Departure</p>
//             <p className="font-semibold">{departure.iataCode}</p>
//             <p className="text-xs text-gray-500">
//               {departure.at
//                 ? new Date(departure.at).toLocaleDateString("en-US", {
//                     day: "2-digit",
//                     month: "short",
//                   })
//                 : "N/A"}
//             </p>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-lg font-bold">{departureTime}</p>
//             <p className="text-xs text-gray-600">
//               {departure.iataCode}, Terminal {departure.terminal || "N/A"}
//             </p>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-sm text-gray-600">{duration}</p>
//             <p className="text-xs text-gray-500">
//               {stops} stop{stops !== 1 ? "s" : ""}
//             </p>
//             <div className="flex items-center justify-center mt-1">
//               <div className="h-px w-6 bg-gray-400"></div>
//               <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
//               <div className="h-px w-6 bg-gray-400"></div>
//             </div>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-lg font-bold">{arrivalTime}</p>
//             <p className="text-xs text-gray-600">
//               {arrival.iataCode}, Terminal {arrival.terminal || "N/A"}
//             </p>
//           </div>
//         </div>
//         <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <p className="text-sm text-gray-600">Aircraft</p>
//             <p className="font-semibold">{aircraft}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Travel Class</p>
//             <p className="font-semibold">Economy</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Check-In Baggage</p>
//             <p className="font-semibold">Adult - 15kg</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Cabin Baggage</p>
//             <p className="font-semibold">Adult - 7kg</p>
//           </div>
//         </div>
//       </section>

//       {/* Traveler Details Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Traveler Details
//         </h3>
//         {loading ? (
//           <p className="text-gray-600">Loading master travelers...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           travelerDetails.map((traveler, index) => {
//             const isManualInput =
//               totalPassengers > 5 &&
//               travelerDetails.filter(
//                 (t) =>
//                   t.selectedTravelerId &&
//                   masterTravelers.some((mt) => mt.id === t.selectedTravelerId)
//               ).length >= 5;
//             return (
//               <div
//                 key={index}
//                 className="mb-4 p-4 bg-white rounded-lg shadow-md"
//               >
//                 <button
//                   className="w-full text-left font-medium text-gray-700 flex justify-between items-center"
//                   onClick={() => handleTravelerToggle(index)}
//                 >
//                   <span>
//                     Traveler {index + 1} (
//                     {index < passengers.adults
//                       ? "Adult"
//                       : index < passengers.adults + passengers.children
//                       ? "Child"
//                       : "Infant"}
//                     )
//                   </span>
//                   <span>{traveler.isOpen ? "−" : "+"}</span>
//                 </button>
//                 {traveler.isOpen && (
//                   <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {!isManualInput && (
//                       <div>
//                         <label className="block text-sm text-gray-600 mb-1">
//                           Select from Master
//                         </label>
//                         <select
//                           value=""
//                           onChange={(e) =>
//                             handleTravelerSelect(
//                               index,
//                               parseInt(e.target.value)
//                             )
//                           }
//                           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         >
//                           <option value="">Select Traveler</option>
//                           {getAvailableTravelers(index).map((traveler) => (
//                             <option key={traveler.id} value={traveler.id}>
//                               {`${traveler.prefix || ""} ${
//                                 traveler.first_name
//                               } ${traveler.last_name}`}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Title
//                       </label>
//                       <select
//                         value={traveler.title}
//                         onChange={(e) =>
//                           handleTravelerChange(index, "title", e.target.value)
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                       >
//                         <option value="">Select Title</option>
//                         <option value="Mr">Mr</option>
//                         <option value="Mrs">Mrs</option>
//                         <option value="Ms">Ms</option>
//                         <option value="Master">Master</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         value={traveler.firstName}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "firstName",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         placeholder="Enter First Name"
//                         disabled={
//                           !isManualInput && traveler.selectedTravelerId !== null
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         value={traveler.lastName}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "lastName",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         placeholder="Enter Last Name"
//                         disabled={
//                           !isManualInput && traveler.selectedTravelerId !== null
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Date of Birth
//                       </label>
//                       <input
//                         type="date"
//                         value={traveler.dateOfBirth}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "dateOfBirth",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                       />
//                     </div>
//                   </div>
//                 )}
//                 {errors[`traveler${index}`] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors[`traveler${index}`]}
//                   </p>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </section>

//       {/* Contact Section */}
//       <section className="mb-8 bg-gradient-to-r from-indigo-100 to-white p-6 rounded-xl shadow-lg border border-indigo-200">
//         <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
//           <svg
//             className="w-6 h-6 mr-2 text-indigo-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//             ></path>
//           </svg>
//           Contact Information
//         </h3>
//         <p className="text-sm text-gray-600 mb-6">
//           📧✆ Ensure your details are correct—your ticket and flight information
//           will be sent here!
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
//           <div className="flex items-end space-x-2">
//             <div className="relative">
//               <select
//                 value={contactInfo.countryCode}
//                 onChange={(e) => handleContactChange("countryCode", e.target.value)}
//                 className="w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               >
//                 <option value="+91">+91</option>
//                 <option value="+1">+1</option>
//                 <option value="+44">+44</option>
//                 <option value="+86">+86</option>
//                 <option value="+81">+81</option>
//                 <option value="+971">+971</option>
//                 <option value="+61">+61</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
//                 <svg
//                   className="w-3 h-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   ></path>
//                 </svg>
//               </div>
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Mobile Number
//               </label>
//               <input
//                 type="tel"
//                 value={contactInfo.phone}
//                 onChange={(e) => handleContactChange("phone", e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                 placeholder="81234 56789"
//                 required
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
//               )}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               value={contactInfo.email}
//               onChange={(e) => handleContactChange("email", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               placeholder="example@email.com"
//               required
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* GSTIN Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         {!showGstinSection ? (
//           <div className="flex items-center justify-between p-2">
//             <div>
//               <h3 className="text-lg font-semibold text-indigo-800">
//                 💼 Use GSTIN for this booking{" "}
//                 <span className="text-sm text-gray-500">(Optional)</span>
//               </h3>
//               <p className="text-sm text-gray-500 mb-4">
//                 Claim credit of GST charges. Your taxes may get updated post
//                 submitting your GST details.
//               </p>
//             </div>
//             <button
//               className="px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
//               onClick={() => setShowGstinSection(true)}
//             >
//               ADD
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-lg font-semibold text-indigo-800">
//                 💼 Use GSTIN for this booking{" "}
//                 <span className="text-sm text-gray-500">(Optional)</span>
//               </h3>
//               <button
//                 className="text-gray-500 hover:text-red-500"
//                 onClick={() => setShowGstinSection(false)}
//               >
//                 ✕
//               </button>
//             </div>
//             <p className="text-sm text-gray-500 mb-4">
//               Claim credit of GST charges. Your taxes may get updated post
//               submitting your GST details.
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//               <input
//                 type="text"
//                 placeholder="GSTIN"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstin}
//                 onChange={(e) => handleContactChange("gstin", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="GST Holder Name"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.companyName}
//                 onChange={(e) =>
//                   handleContactChange("companyName", e.target.value)
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Address"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstAddress}
//                 onChange={(e) =>
//                   handleContactChange("gstAddress", e.target.value)
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Pincode"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstPincode}
//                 onChange={(e) =>
//                   handleContactChange("gstPincode", e.target.value)
//                 }
//               />
//             </div>
//             <div className="mt-2">
//               <label className="inline-flex items-center text-sm">
//                 <input
//                   type="checkbox"
//                   className="mr-2"
//                   checked={contactInfo.saveGst || false}
//                   onChange={(e) =>
//                     handleContactChange("saveGst", e.target.checked)
//                   }
//                 />
//                 Save GST Details
//               </label>
//             </div>
//           </>
//         )}
//       </section>

//       {/* Addon Services Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
//           🛍️ Addon Services
//         </h3>
//         <div className="flex flex-wrap gap-4">
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               addOnServices.mealPreference !== "None"
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() =>
//               handleAddOnChange(
//                 "mealPreference",
//                 addOnServices.mealPreference === "None" ? "Vegetarian" : "None"
//               )
//             }
//           >
//             🍽️ Add Meals
//           </button>
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               addOnServices.baggageUpgrade
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() =>
//               handleAddOnChange("baggageUpgrade", !addOnServices.baggageUpgrade)
//             }
//           >
//             🧳 Add Baggage
//           </button>
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               addOnServices.seatPreference !== "None"
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() =>
//               handleAddOnChange(
//                 "seatPreference",
//                 addOnServices.seatPreference === "None" ? "Window" : "None"
//               )
//             }
//           >
//             💺 Seat Selection
//           </button>
//         </div>
//       </section>

//       {/* Fare Summary Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Fare Summary
//         </h3>
//         <div className="space-y-2">
//           <div className="flex justify-between">
//             <span>Fare</span>
//             <span>₹{fare.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Instant Discount</span>
//             <span>₹{discount.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Insurance</span>
//             <span>₹{insurance.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Discount</span>
//             <span>₹{additionalDiscount.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between font-bold text-lg">
//             <span>Total Amount:</span>
//             <span>₹{totalAmount.toFixed(2)}</span>
//           </div>
//         </div>
//         <div className="mt-4">
//           <p className="text-sm text-gray-600">
//             INFO: Meal, seat, rescheduling & cancellation are chargeable.
//           </p>
//         </div>
//       </section>

//       <div className="flex justify-between">
//         <Button
//           className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </Button>
//         <Button
//           className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
//           onClick={handleSubmit}
//         >
//           Continue to Payment
//         </Button>
//       </div>

//       {/* Popup Modal */}
//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="absolute inset-0 backdrop-blur-md"></div>
//           <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-auto text-center transform transition-all duration-300 ease-in-out animate-pulse">
//             <h3 className="text-2xl font-bold text-indigo-800 mb-4">
//               Please wait
//             </h3>
//             <p className="text-gray-600 mb-4">
//               While we transfer to the payment page. This may take some time.
//             </p>
//             <hr className="border-t-2 border-gray-300 my-4" />
//             <p className="text-yellow-600 flex items-center justify-center text-sm">
//               <span className="mr-2">⚠️</span> Do not refresh the page
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingResponse;


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Button from "../components/Button";
// import SeatMap from "./SeatMap";

// const BookingResponse = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const bookingResponse = location.state?.bookingResponse;

//   useEffect(() => {
//     if (!bookingResponse) {
//       navigate("/results", { replace: true });
//     }
//   }, [location.state, bookingResponse, navigate]);

//   if (!bookingResponse) return null;

//   const [travelDetails, setTravelDetails] = useState(bookingResponse);
//   const totalTravelers = (bookingResponse.passengers?.adults || 0) + (bookingResponse.passengers?.children || 0) + (bookingResponse.passengers?.infants || 0);
//   const [travelerDetails, setTravelerDetails] = useState(
//     Array(totalTravelers)
//       .fill()
//       .map((_, index) => ({
//         isOpen: false,
//         title: "",
//         firstName: "",
//         lastName: "",
//         mobileNo: "",
//         selectedTravelerId: null,
//       }))
//   );
//   const [contactInfo, setContactInfo] = useState({
//     email: "",
//     phone: "",
//     countryCode: "+91",
//     companyName: "",
//     gstin: "",
//     gstAddress: "",
//     gstPincode: "",
//     saveGst: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [masterTravelers, setMasterTravelers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addOnServices, setAddOnServices] = useState({
//     mealPreference: "None",
//     seatPreference: {},
//     baggageUpgrade: false,
//     travelInsurance: false,
//   });
//   const [showGstinSection, setShowGstinSection] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showSeatMap, setShowSeatMap] = useState(false);
//   const [selectedSeats, setSelectedSeats] = useState({});
//   const [seatMapData, setSeatMapData] = useState(bookingResponse.seatMap || []);

//   useEffect(() => {
//     const fetchMasterTravelers = async () => {
//       try {
//         const sessionToken = localStorage.getItem("sessionToken");
//         if (!sessionToken) throw new Error("No session token found");
//         const response = await fetch("http://localhost:3000/api/travelers", {
//           headers: { Authorization: `Bearer ${sessionToken}` },
//         });
//         if (!response.ok) throw new Error("Failed to fetch master travelers");
//         const data = await response.json();
//         if (data.status !== "success") throw new Error(data.error || "Invalid response");
//         setMasterTravelers(data.travelers || []);
//       } catch (err) {
//         setError("Error loading master travelers. Please try again or add manually.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMasterTravelers();
//   }, []);

//   const handleTravelerToggle = (index) => {
//     const updatedDetails = [...travelerDetails];
//     updatedDetails[index].isOpen = !updatedDetails[index].isOpen;
//     setTravelerDetails(updatedDetails);
//   };

//   const handleTravelerChange = (index, field, value) => {
//     const updatedDetails = [...travelerDetails];
//     updatedDetails[index][field] = value;
//     setTravelerDetails(updatedDetails);
//   };

//   const handleTravelerSelect = (index, travelerId) => {
//     const selectedTraveler = masterTravelers.find((t) => t.id === travelerId);
//     if (selectedTraveler) {
//       const updatedDetails = [...travelerDetails];
//       updatedDetails[index] = {
//         ...updatedDetails[index],
//         title: selectedTraveler.prefix || "",
//         firstName: selectedTraveler.first_name || "",
//         lastName: selectedTraveler.last_name || "",
//         mobileNo: selectedTraveler.mobileNo || "",
//         selectedTravelerId: travelerId,
//       };
//       setTravelerDetails(updatedDetails);
//     }
//   };

//   const handleContactChange = (field, value) => {
//     setContactInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddOnChange = (field, value) => {
//     setAddOnServices((prev) => ({ ...prev, [field]: value }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!contactInfo.email || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
//       newErrors.email = "Please enter a valid email address (required)";
//     }
//     if (!contactInfo.phone || !/^\+?\d{10,15}$/.test(contactInfo.phone)) {
//       newErrors.phone = "Please enter a valid phone number (10-15 digits, required)";
//     }
//     if (
//       contactInfo.gstin &&
//       !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/.test(contactInfo.gstin)
//     ) {
//       newErrors.gstin = "Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)";
//     }
//     travelerDetails.forEach((traveler, index) => {
//       const missingFields = [];
//       if (!traveler.title) missingFields.push("Title");
//       if (!traveler.firstName) missingFields.push("First Name");
//       if (!traveler.lastName) missingFields.push("Last Name");
//       if (!traveler.mobileNo) missingFields.push("Mobile No");
//       if (missingFields.length > 0) {
//         newErrors[`traveler${index}`] = `Required fields missing: ${missingFields.join(", ")}`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       setShowPopup(true);
//       setTimeout(() => {
//         setShowPopup(false);
//         navigate("/payment", {
//           state: { travelerDetails, contactInfo, bookingResponse: travelDetails, addOnServices, selectedSeats },
//         });
//       }, 2000);
//     }
//   };

//   const handleSeatSelect = (travellerId, seatObj) => {
//     setSelectedSeats((prev) => ({ ...prev, [travellerId]: seatObj.seatNo }));
//     setAddOnServices((prev) => ({
//       ...prev,
//       seatPreference: { ...prev.seatPreference, [travellerId]: seatObj.seatNo },
//     }));
//   };

//   const handleSeatMapClose = () => {
//     setShowSeatMap(false);
//   };

//   const getAvailableTravelers = (index) => {
//     const selectedIds = travelerDetails
//       .slice(0, index)
//       .map((t) => t.selectedTravelerId)
//       .filter((id) => id !== null);
//     const selectedMasterCount = selectedIds.filter((id) =>
//       masterTravelers.some((t) => t.id === id)
//     ).length;
//     return masterTravelers.filter(
//       (t) =>
//         !selectedIds.includes(t.id) &&
//         (travelerDetails.length <= 5 || selectedMasterCount < 5)
//     );
//   };

//   const travellers = travelerDetails.map((traveller, index) => ({
//     id: traveller.selectedTravelerId || `traveller${index + 1}`,
//     name: `${traveller.title} ${traveller.firstName} ${traveller.lastName}`.trim(),
//   }));

//   const totalAmount = parseFloat(bookingResponse.pricedOffer?.price?.grandTotal || 0) * totalTravelers;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 relative">
//       <h1 className="text-2xl font-bold text-indigo-800 mb-6">
//         Review and Complete Your Booking
//       </h1>

//       {/* Travel Details Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Travel Details
//         </h3>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <p className="text-sm text-gray-600">Departure</p>
//             <p className="font-semibold">
//               {travelDetails.departure.iataCode} ({travelDetails.departure.city || "N/A"})
//             </p>
//             <p className="text-xs text-gray-500">
//               {new Date(travelDetails.departure.at).toLocaleDateString("en-US", {
//                 day: "2-digit",
//                 month: "short",
//               })}
//             </p>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-lg font-bold">
//               {travelDetails.departureTime}
//             </p>
//             <p className="text-xs text-gray-600">
//               {travelDetails.departure.iataCode}, Terminal {travelDetails.departure.terminal || "N/A"}
//             </p>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-sm text-gray-600">{travelDetails.duration}</p>
//             <p className="text-xs text-gray-500">{travelDetails.stops} stop{travelDetails.stops !== 1 ? "s" : ""}</p>
//             <div className="flex items-center justify-center mt-1">
//               <div className="h-px w-6 bg-gray-400"></div>
//               <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
//               <div className="h-px w-6 bg-gray-400"></div>
//             </div>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-lg font-bold">
//               {travelDetails.arrivalTime}
//             </p>
//             <p className="text-xs text-gray-600">
//               {travelDetails.arrival.iataCode} ({travelDetails.arrival.city || "N/A"}), Terminal {travelDetails.arrival.terminal || "N/A"}
//             </p>
//           </div>
//         </div>
//         <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <p className="text-sm text-gray-600">Aircraft</p>
//             <p className="font-semibold">{travelDetails.aircraft}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Travel Class</p>
//             <p className="font-semibold">{travelDetails.class}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Check-In Baggage</p>
//             <p className="font-semibold">Adult - {travelDetails.baggage.checkIn}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Cabin Baggage</p>
//             <p className="font-semibold">Adult - {travelDetails.baggage.cabin}</p>
//           </div>
//         </div>
//       </section>

//       {/* Traveler Details Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Traveler Details
//         </h3>
//         {loading ? (
//           <p className="text-gray-600">Loading master travelers...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           travelerDetails.map((traveler, index) => {
//             const isManualInput =
//               travelerDetails.length > 5 &&
//               travelerDetails.filter(
//                 (t) =>
//                   t.selectedTravelerId &&
//                   masterTravelers.some((mt) => mt.id === t.selectedTravelerId)
//               ).length >= 5;
//             return (
//               <div
//                 key={index}
//                 className="mb-4 p-4 bg-white rounded-lg shadow-md"
//               >
//                 <button
//                   className="w-full text-left font-medium text-gray-700 flex justify-between items-center"
//                   onClick={() => handleTravelerToggle(index)}
//                 >
//                   <span>
//                     Traveler {index + 1} (
//                     {index < (bookingResponse.passengers?.adults || 0)
//                       ? "Adult"
//                       : index < (bookingResponse.passengers?.adults || 0) + (bookingResponse.passengers?.children || 0)
//                       ? "Child"
//                       : "Infant"}
//                     )
//                   </span>
//                   <span>{traveler.isOpen ? "−" : "+"}</span>
//                 </button>
//                 {traveler.isOpen && (
//                   <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {!isManualInput && (
//                       <div>
//                         <label className="block text-sm text-gray-600 mb-1">
//                           Select from Master
//                         </label>
//                         <select
//                           value={traveler.selectedTravelerId || ""}
//                           onChange={(e) =>
//                             handleTravelerSelect(
//                               index,
//                               parseInt(e.target.value)
//                             )
//                           }
//                           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         >
//                           <option value="">Select Traveler</option>
//                           {getAvailableTravelers(index).map((traveler) => (
//                             <option key={traveler.id} value={traveler.id}>
//                               {`${traveler.prefix || ""} ${
//                                 traveler.first_name
//                               } ${traveler.last_name}`}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Title <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={traveler.title}
//                         onChange={(e) =>
//                           handleTravelerChange(index, "title", e.target.value)
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         required
//                       >
//                         <option value="">Select Title</option>
//                         <option value="Mr">Mr</option>
//                         <option value="Mrs">Mrs</option>
//                         <option value="Ms">Ms</option>
//                         <option value="Master">Master</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         First Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={traveler.firstName}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "firstName",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         placeholder="Enter First Name"
//                         required
//                         disabled={
//                           !isManualInput && traveler.selectedTravelerId !== null
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Last Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={traveler.lastName}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "lastName",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         placeholder="Enter Last Name"
//                         required
//                         disabled={
//                           !isManualInput && traveler.selectedTravelerId !== null
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Mobile No <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         value={traveler.mobileNo}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "mobileNo",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         placeholder="Enter Mobile No"
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}
//                 {errors[`traveler${index}`] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors[`traveler${index}`]}
//                   </p>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </section>

//       {/* Contact Section */}
//       <section className="mb-8 bg-gradient-to-r from-indigo-100 to-white p-6 rounded-xl shadow-lg border border-indigo-200">
//         <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
//           <svg
//             className="w-6 h-6 mr-2 text-indigo-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//             ></path>
//           </svg>
//           Contact Information
//         </h3>
//         <p className="text-sm text-gray-600 mb-6">
//           📧✆ Ensure your details are correct—your ticket and flight information
//           will be sent here!
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
//           <div className="flex items-end space-x-2">
//             <div className="relative">
//               <select
//                 value={contactInfo.countryCode}
//                 onChange={(e) => handleContactChange("countryCode", e.target.value)}
//                 className="w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               >
//                 <option value="+91">+91</option>
//                 <option value="+1">+1</option>
//                 <option value="+44">+44</option>
//                 <option value="+86">+86</option>
//                 <option value="+81">+81</option>
//                 <option value="+971">+971</option>
//                 <option value="+61">+61</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
//                 <svg
//                   className="w-3 h-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   ></path>
//                 </svg>
//               </div>
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Mobile Number
//               </label>
//               <input
//                 type="tel"
//                 value={contactInfo.phone}
//                 onChange={(e) => handleContactChange("phone", e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                 placeholder="81234 56789"
//                 required
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
//               )}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               value={contactInfo.email}
//               onChange={(e) => handleContactChange("email", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               placeholder="example@email.com"
//               required
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* GSTIN Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         {!showGstinSection ? (
//           <div className="flex items-center justify-between p-2">
//             <div>
//               <h3 className="text-lg font-semibold text-indigo-800">
//                 💼 Use GSTIN for this booking{" "}
//                 <span className="text-sm text-gray-500">(Optional)</span>
//               </h3>
//               <p className="text-sm text-gray-500 mb-4">
//                 Claim credit of GST charges. Your taxes may get updated post
//                 submitting your GST details.
//               </p>
//             </div>
//             <button
//               className="px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
//               onClick={() => setShowGstinSection(true)}
//             >
//               ADD
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-lg font-semibold text-indigo-800">
//                 💼 Use GSTIN for this booking{" "}
//                 <span className="text-sm text-gray-500">(Optional)</span>
//               </h3>
//               <button
//                 className="text-gray-500 hover:text-red-500"
//                 onClick={() => setShowGstinSection(false)}
//               >
//                 ✕
//               </button>
//             </div>
//             <p className="text-sm text-gray-500 mb-4">
//               Claim credit of GST charges. Your taxes may get updated post
//               submitting your GST details.
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//               <input
//                 type="text"
//                 placeholder="GSTIN"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstin}
//                 onChange={(e) => handleContactChange("gstin", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="GST Holder Name"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.companyName}
//                 onChange={(e) =>
//                   handleContactChange("companyName", e.target.value)
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Address"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstAddress}
//                 onChange={(e) =>
//                   handleContactChange("gstAddress", e.target.value)
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Pincode"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstPincode}
//                 onChange={(e) =>
//                   handleContactChange("gstPincode", e.target.value)
//                 }
//               />
//             </div>
//             <div className="mt-2">
//               <label className="inline-flex items-center text-sm">
//                 <input
//                   type="checkbox"
//                   className="mr-2"
//                   checked={contactInfo.saveGst || false}
//                   onChange={(e) =>
//                     handleContactChange("saveGst", e.target.checked)
//                   }
//                 />
//                 Save GST Details
//               </label>
//             </div>
//           </>
//         )}
//       </section>

//       {/* Addon Services Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
//           🛍️ Addon Services
//         </h3>
//         <div className="flex flex-wrap gap-4">
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               addOnServices.mealPreference !== "None"
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() =>
//               handleAddOnChange(
//                 "mealPreference",
//                 addOnServices.mealPreference === "None" ? "Vegetarian" : "None"
//               )
//             }
//           >
//             🍽️ Add Meals
//           </button>
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               addOnServices.baggageUpgrade
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() =>
//               handleAddOnChange("baggageUpgrade", !addOnServices.baggageUpgrade)
//             }
//           >
//             🧳 Add Baggage
//           </button>
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               Object.keys(addOnServices.seatPreference).length > 0
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() => setShowSeatMap(true)}
//           >
//             💺 Seat Selection
//           </button>
//         </div>
//       </section>

//       {/* Fare Summary Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Fare Summary
//         </h3>
//         <div className="space-y-2">
//           <div className="flex justify-between">
//             <span>Fare</span>
//             <span>₹{parseFloat(travelDetails.pricedOffer?.price?.grandTotal || 0).toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Instant Discount</span>
//             <span>₹0.00</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Insurance</span>
//             <span>₹0.00</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Discount</span>
//             <span>₹0.00</span>
//           </div>
//           <div className="flex justify-between font-bold text-lg">
//             <span>Total Amount:</span>
//             <span>₹{totalAmount.toFixed(2)}</span>
//           </div>
//         </div>
//         <div className="mt-4">
//           <p className="text-sm text-gray-600">
//             INFO: Meal, seat, rescheduling & cancellation are chargeable.
//           </p>
//         </div>
//       </section>

//       <div className="flex justify-between">
//         <Button
//           className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </Button>
//         <Button
//           className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
//           onClick={handleSubmit}
//         >
//           Continue to Payment
//         </Button>
//       </div>

//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="absolute inset-0 backdrop-blur-md"></div>
//           <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-auto text-center transform transition-all duration-300 ease-in-out animate-pulse">
//             <h3 className="text-2xl font-bold text-indigo-800 mb-4">
//               Please wait
//             </h3>
//             <p className="text-gray-600 mb-4">
//               While we transfer to the payment page. This may take some time.
//             </p>
//             <hr className="border-t-2 border-gray-300 my-4" />
//             <p className="text-yellow-600 flex items-center justify-center text-sm">
//               <span className="mr-2">⚠️</span> Do not refresh the page
//             </p>
//           </div>
//         </div>
//       )}

//       {showSeatMap && (
//         <div className="fixed inset-0 z-50 flex items-start justify-end">
//           <div className="absolute inset-0 bg-black bg-opacity-30"></div>
//           <SeatMap
//             open={showSeatMap}
//             onClose={handleSeatMapClose}
//             travellers={travellers}
//             seatMap={seatMapData}
//             selectedSeats={selectedSeats}
//             onSelect={handleSeatSelect}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingResponse;



// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Button from "../components/Button";
// import SeatMap from "./SeatMap";

// const BookingResponse = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const bookingResponse = location.state?.bookingResponse;

//   useEffect(() => {
//     if (!bookingResponse) {
//       navigate("/results", { replace: true });
//     }
//   }, [location.state, bookingResponse, navigate]);

//   if (!bookingResponse) return null;

//   const [travelDetails, setTravelDetails] = useState(bookingResponse);
//   const totalTravelers = (bookingResponse.passengers?.adults || 0) + (bookingResponse.passengers?.children || 0) + (bookingResponse.passengers?.infants || 0);
//   const [travelerDetails, setTravelerDetails] = useState(
//     Array(totalTravelers)
//       .fill()
//       .map((_, index) => ({
//         isOpen: false,
//         title: "",
//         firstName: "",
//         lastName: "",
//         mobileNo: "",
//         selectedTravelerId: null,
//       }))
//   );
//   const [contactInfo, setContactInfo] = useState({
//     email: "",
//     phone: "",
//     countryCode: "+91",
//     companyName: "",
//     gstin: "",
//     gstAddress: "",
//     gstPincode: "",
//     saveGst: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [masterTravelers, setMasterTravelers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addOnServices, setAddOnServices] = useState({
//     mealPreference: "None",
//     seatPreference: {},
//     baggageUpgrade: false,
//     travelInsurance: false,
//   });
//   const [showGstinSection, setShowGstinSection] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showSeatMap, setShowSeatMap] = useState(false);
//   const [selectedSeats, setSelectedSeats] = useState({});
//   const [seatMapData, setSeatMapData] = useState(bookingResponse.seatMap || []);

//   useEffect(() => {
//     const fetchMasterTravelers = async () => {
//       try {
//         const sessionToken = localStorage.getItem("sessionToken");
//         if (!sessionToken) throw new Error("No session token found");
//         const response = await fetch("http://localhost:3000/api/travelers", {
//           headers: { Authorization: `Bearer ${sessionToken}` },
//         });
//         if (!response.ok) throw new Error("Failed to fetch master travelers");
//         const data = await response.json();
//         if (data.status !== "success") throw new Error(data.error || "Invalid response");
//         setMasterTravelers(data.travelers || []);
//       } catch (err) {
//         setError("Error loading master travelers. Please try again or add manually.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMasterTravelers();
//   }, []);

//   const handleTravelerToggle = (index) => {
//     const updatedDetails = [...travelerDetails];
//     updatedDetails[index].isOpen = !updatedDetails[index].isOpen;
//     setTravelerDetails(updatedDetails);
//   };

//   const handleTravelerChange = (index, field, value) => {
//     const updatedDetails = [...travelerDetails];
//     updatedDetails[index][field] = value;
//     setTravelerDetails(updatedDetails);
//   };

//   const handleTravelerSelect = (index, travelerId) => {
//     const selectedTraveler = masterTravelers.find((t) => t.id === travelerId);
//     if (selectedTraveler) {
//       const updatedDetails = [...travelerDetails];
//       updatedDetails[index] = {
//         ...updatedDetails[index],
//         title: selectedTraveler.prefix || "",
//         firstName: selectedTraveler.first_name || "",
//         lastName: selectedTraveler.last_name || "",
//         mobileNo: selectedTraveler.mobileNo || "",
//         selectedTravelerId: travelerId,
//       };
//       setTravelerDetails(updatedDetails);
//     }
//   };

//   const handleContactChange = (field, value) => {
//     setContactInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddOnChange = (field, value) => {
//     setAddOnServices((prev) => ({ ...prev, [field]: value }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!contactInfo.email || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
//       newErrors.email = "Please enter a valid email address (required)";
//     }
//     if (!contactInfo.phone || !/^\+?\d{10,15}$/.test(contactInfo.phone)) {
//       newErrors.phone = "Please enter a valid phone number (10-15 digits, required)";
//     }
//     if (
//       contactInfo.gstin &&
//       !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/.test(contactInfo.gstin)
//     ) {
//       newErrors.gstin = "Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)";
//     }
//     travelerDetails.forEach((traveler, index) => {
//       const missingFields = [];
//       if (!traveler.title) missingFields.push("Title");
//       if (!traveler.firstName) missingFields.push("First Name");
//       if (!traveler.lastName) missingFields.push("Last Name");
//       if (!traveler.mobileNo) missingFields.push("Mobile No");
//       if (missingFields.length > 0) {
//         newErrors[`traveler${index}`] = `Required fields missing: ${missingFields.join(", ")}`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       setShowPopup(true);
//       setTimeout(() => {
//         setShowPopup(false);
//         navigate("/payment", {
//           state: { travelerDetails, contactInfo, bookingResponse: travelDetails, addOnServices, selectedSeats },
//         });
//       }, 2000);
//     }
//   };

//   const handleSeatSelect = (travellerId, seatObj) => {
//     setSelectedSeats((prev) => {
//       const newSelectedSeats = { ...prev, [travellerId]: seatObj.seatNo };
//       console.log("Selected Seats:", newSelectedSeats); // Debug: Log selected seats
//       console.log("Seat Map Data:", seatMapData); // Debug: Log seat map data
//       return newSelectedSeats;
//     });
//     setAddOnServices((prev) => ({
//       ...prev,
//       seatPreference: { ...prev.seatPreference, [travellerId]: seatObj.seatNo },
//     }));
//   };

//   const handleSeatMapClose = () => {
//     setShowSeatMap(false);
//   };

//   const handleSeatMapUpdate = (newSeatMap) => {
//     setSeatMapData(newSeatMap);
//     console.log("Updated Seat Map Data:", newSeatMap); // Debug: Log updated seat map
//   };

//   const getAvailableTravelers = (index) => {
//     const selectedIds = travelerDetails
//       .slice(0, index)
//       .map((t) => t.selectedTravelerId)
//       .filter((id) => id !== null);
//     const selectedMasterCount = selectedIds.filter((id) =>
//       masterTravelers.some((t) => t.id === id)
//     ).length;
//     return masterTravelers.filter(
//       (t) =>
//         !selectedIds.includes(t.id) &&
//         (travelerDetails.length <= 5 || selectedMasterCount < 5)
//     );
//   };

//   const travellers = travelerDetails.map((traveler, index) => ({
//     id: traveler.selectedTravelerId || `traveller${index + 1}`,
//     name: `${traveler.title} ${traveler.firstName} ${traveler.lastName}`.trim(),
//   }));

//   // Calculate total seat fare (aligned with SeatMap.jsx)
//   const seatFare = Object.keys(selectedSeats).reduce((sum, travellerId) => {
//     const seat = seatMapData
//       .flatMap((row) => row.seats || [])
//       .find((s) => s?.seatNo === selectedSeats[travellerId]);
//     return sum + (seat?.fare || 0);
//   }, 0);
//   console.log("Calculated Seat Fare:", seatFare); // Debug: Log seat fare

//   // Calculate flight fare including seat costs
//   const flightPrice = parseFloat(bookingResponse.pricedOffer?.price?.grandTotal || 0);
//   const flightFareWithSeats = (flightPrice * totalTravelers + seatFare).toFixed(2);

//   // Calculate total amount (flight fare with seats + other line items)
//   const totalAmount = (parseFloat(flightFareWithSeats)).toFixed(2);

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 relative">
//       <h1 className="text-2xl font-bold text-indigo-800 mb-6">
//         Review and Complete Your Booking
//       </h1>

//       {/* Travel Details Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Travel Details
//         </h3>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <p className="text-sm text-gray-600">Departure</p>
//             <p className="font-semibold">
//               {travelDetails.departure.iataCode} ({travelDetails.departure.city || "N/A"})
//             </p>
//             <p className="text-xs text-gray-500">
//               {new Date(travelDetails.departure.at).toLocaleDateString("en-US", {
//                 day: "2-digit",
//                 month: "short",
//               })}
//             </p>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-lg font-bold">
//               {travelDetails.departureTime}
//             </p>
//             <p className="text-xs text-gray-600">
//               {travelDetails.departure.iataCode}, Terminal {travelDetails.departure.terminal || "N/A"}
//             </p>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-sm text-gray-600">{travelDetails.duration}</p>
//             <p className="text-xs text-gray-500">{travelDetails.stops} stop{travelDetails.stops !== 1 ? "s" : ""}</p>
//             <div className="flex items-center justify-center mt-1">
//               <div className="h-px w-6 bg-gray-400"></div>
//               <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
//               <div className="h-px w-6 bg-gray-400"></div>
//             </div>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-lg font-bold">
//               {travelDetails.arrivalTime}
//             </p>
//             <p className="text-xs text-gray-600">
//               {travelDetails.arrival.iataCode} ({travelDetails.arrival.city || "N/A"}), Terminal {travelDetails.arrival.terminal || "N/A"}
//             </p>
//           </div>
//         </div>
//         <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <p className="text-sm text-gray-600">Aircraft</p>
//             <p className="font-semibold">{travelDetails.aircraft}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Travel Class</p>
//             <p className="font-semibold">{travelDetails.class}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Check-In Baggage</p>
//             <p className="font-semibold">Adult - {travelDetails.baggage.checkIn}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Cabin Baggage</p>
//             <p className="font-semibold">Adult - {travelDetails.baggage.cabin}</p>
//           </div>
//         </div>
//       </section>

//       {/* Traveler Details Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Traveler Details
//         </h3>
//         {loading ? (
//           <p className="text-gray-600">Loading master travelers...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           travelerDetails.map((traveler, index) => {
//             const isManualInput =
//               travelerDetails.length > 5 &&
//               travelerDetails.filter(
//                 (t) =>
//                   t.selectedTravelerId &&
//                   masterTravelers.some((mt) => mt.id === t.selectedTravelerId)
//               ).length >= 5;
//             return (
//               <div
//                 key={index}
//                 className="mb-4 p-4 bg-white rounded-lg shadow-md"
//               >
//                 <button
//                   className="w-full text-left font-medium text-gray-700 flex justify-between items-center"
//                   onClick={() => handleTravelerToggle(index)}
//                 >
//                   <span>
//                     Traveler {index + 1} (
//                     {index < (bookingResponse.passengers?.adults || 0)
//                       ? "Adult"
//                       : index < (bookingResponse.passengers?.adults || 0) + (bookingResponse.passengers?.children || 0)
//                       ? "Child"
//                       : "Infant"}
//                     )
//                   </span>
//                   <span>{traveler.isOpen ? "−" : "+"}</span>
//                 </button>
//                 {traveler.isOpen && (
//                   <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {!isManualInput && (
//                       <div>
//                         <label className="block text-sm text-gray-600 mb-1">
//                           Select from Master
//                         </label>
//                         <select
//                           value={traveler.selectedTravelerId || ""}
//                           onChange={(e) =>
//                             handleTravelerSelect(
//                               index,
//                               parseInt(e.target.value)
//                             )
//                           }
//                           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         >
//                           <option value="">Select Traveler</option>
//                           {getAvailableTravelers(index).map((traveler) => (
//                             <option key={traveler.id} value={traveler.id}>
//                               {(traveler.prefix || "") + " " + (traveler.first_name || "") + " " + (traveler.last_name || "")}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Title <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={traveler.title}
//                         onChange={(e) =>
//                           handleTravelerChange(index, "title", e.target.value)
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         required
//                       >
//                         <option value="">Select Title</option>
//                         <option value="Mr">Mr</option>
//                         <option value="Mrs">Mrs</option>
//                         <option value="Ms">Ms</option>
//                         <option value="Master">Master</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         First Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={traveler.firstName}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "firstName",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         placeholder="Enter First Name"
//                         required
//                         disabled={
//                           !isManualInput && traveler.selectedTravelerId !== null
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Last Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={traveler.lastName}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "lastName",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         placeholder="Enter Last Name"
//                         required
//                         disabled={
//                           !isManualInput && traveler.selectedTravelerId !== null
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Mobile No <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         value={traveler.mobileNo}
//                         onChange={(e) =>
//                           handleTravelerChange(
//                             index,
//                             "mobileNo",
//                             e.target.value
//                           )
//                         }
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                         placeholder="Enter Mobile No"
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}
//                 {errors[`traveler${index}`] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {errors[`traveler${index}`]}
//                   </p>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </section>

//       {/* Contact Section */}
//       <section className="mb-8 bg-gradient-to-r from-indigo-100 to-white p-6 rounded-xl shadow-lg border border-indigo-200">
//         <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
//           <svg
//             className="w-6 h-6 mr-2 text-indigo-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//             ></path>
//           </svg>
//           Contact Information
//         </h3>
//         <p className="text-sm text-gray-600 mb-6">
//           📧✆ Ensure your details are correct—your ticket and flight information
//           will be sent here!
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
//           <div className="flex items-end space-x-2">
//             <div className="relative">
//               <select
//                 value={contactInfo.countryCode}
//                 onChange={(e) => handleContactChange("countryCode", e.target.value)}
//                 className="w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               >
//                 <option value="+91">+91</option>
//                 <option value="+1">+1</option>
//                 <option value="+44">+44</option>
//                 <option value="+86">+86</option>
//                 <option value="+81">+81</option>
//                 <option value="+971">+971</option>
//                 <option value="+61">+61</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
//                 <svg
//                   className="w-3 h-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   ></path>
//                 </svg>
//               </div>
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Mobile Number
//               </label>
//               <input
//                 type="tel"
//                 value={contactInfo.phone}
//                 onChange={(e) => handleContactChange("phone", e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                 placeholder="81234 56789"
//                 required
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
//               )}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               value={contactInfo.email}
//               onChange={(e) => handleContactChange("email", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               placeholder="example@email.com"
//               required
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* GSTIN Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         {!showGstinSection ? (
//           <div className="flex items-center justify-between p-2">
//             <div>
//               <h3 className="text-lg font-semibold text-indigo-800">
//                 💼 Use GSTIN for this booking{" "}
//                 <span className="text-sm text-gray-500">(Optional)</span>
//               </h3>
//               <p className="text-sm text-gray-500 mb-4">
//                 Claim credit of GST charges. Your taxes may get updated post
//                 submitting your GST details.
//               </p>
//             </div>
//             <button
//               className="px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
//               onClick={() => setShowGstinSection(true)}
//             >
//               ADD
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-lg font-semibold text-indigo-800">
//                 💼 Use GSTIN for this booking{" "}
//                 <span className="text-sm text-gray-500">(Optional)</span>
//               </h3>
//               <button
//                 className="text-gray-500 hover:text-red-500"
//                 onClick={() => setShowGstinSection(false)}
//               >
//                 ✕
//               </button>
//             </div>
//             <p className="text-sm text-gray-500 mb-4">
//               Claim credit of GST charges. Your taxes may get updated post
//               submitting your GST details.
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//               <input
//                 type="text"
//                 placeholder="GSTIN"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstin}
//                 onChange={(e) => handleContactChange("gstin", e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="GST Holder Name"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.companyName}
//                 onChange={(e) =>
//                   handleContactChange("companyName", e.target.value)
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Address"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstAddress}
//                 onChange={(e) =>
//                   handleContactChange("gstAddress", e.target.value)
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Pincode"
//                 className="p-2 border border-gray-300 rounded-lg"
//                 value={contactInfo.gstPincode}
//                 onChange={(e) =>
//                   handleContactChange("gstPincode", e.target.value)
//                 }
//               />
//             </div>
//             <div className="mt-2">
//               <label className="inline-flex items-center text-sm">
//                 <input
//                   type="checkbox"
//                   className="mr-2"
//                   checked={contactInfo.saveGst || false}
//                   onChange={(e) =>
//                     handleContactChange("saveGst", e.target.checked)
//                   }
//                 />
//                 Save GST Details
//               </label>
//             </div>
//           </>
//         )}
//       </section>

//       {/* Addon Services Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
//           🛍️ Addon Services
//         </h3>
//         <div className="flex flex-wrap gap-4">
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               addOnServices.mealPreference !== "None"
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() =>
//               handleAddOnChange(
//                 "mealPreference",
//                 addOnServices.mealPreference === "None" ? "Vegetarian" : "None"
//               )
//             }
//           >
//             🍽️ Add Meals
//           </button>
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               addOnServices.baggageUpgrade
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() =>
//               handleAddOnChange("baggageUpgrade", !addOnServices.baggageUpgrade)
//             }
//           >
//             🧳 Add Baggage
//           </button>
//           <button
//             className={`flex items-center gap-2 border p-3 rounded-lg ${
//               Object.keys(addOnServices.seatPreference).length > 0
//                 ? "bg-indigo-100 border-indigo-500"
//                 : "bg-white border-gray-300"
//             }`}
//             onClick={() => setShowSeatMap(true)}
//           >
//             💺 Seat Selection
//           </button>
//         </div>
//       </section>

//       {/* Fare Summary Section */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-indigo-800 mb-4">
//           Fare Summary
//         </h3>
//         <div className="space-y-2">
//           <div className="flex justify-between">
//             <span>Flight Fare ({totalTravelers} Traveler{totalTravelers !== 1 ? "s" : ""})</span>
//             <span>€{flightFareWithSeats}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Instant Discount</span>
//             <span>€0.00</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Insurance</span>
//             <span>€0.00</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Discount</span>
//             <span>€0.00</span>
//           </div>
//           <div className="flex justify-between font-bold text-lg">
//             <span>Total Amount:</span>
//             <span>€{totalAmount}</span>
//           </div>
//         </div>
//         <div className="mt-4">
//           <p className="text-sm text-gray-600">
//             INFO: Meal, seat, rescheduling & cancellation are chargeable.
//           </p>
//         </div>
//       </section>

//       <div className="flex justify-between">
//         <Button
//           className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </Button>
//         <Button
//           className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
//           onClick={handleSubmit}
//         >
//           Continue to Payment
//         </Button>
//       </div>

//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="absolute inset-0 backdrop-blur-md"></div>
//           <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-auto text-center transform transition-all duration-300 ease-in-out animate-pulse">
//             <h3 className="text-2xl font-bold text-indigo-800 mb-4">
//               Please wait
//             </h3>
//             <p className="text-gray-600 mb-4">
//               While we transfer to the payment page. This may take some time.
//             </p>
//             <hr className="border-t-2 border-gray-300 my-4" />
//             <p className="text-yellow-600 flex items-center justify-center text-sm">
//               <span className="mr-2">⚠️</span> Do not refresh the page
//             </p>
//           </div>
//         </div>
//       )}

//       {showSeatMap && (
//         <div className="fixed inset-0 z-50 flex items-start justify-end">
//           <div className="absolute inset-0 bg-black bg-opacity-30"></div>
//           <SeatMap
//             open={showSeatMap}
//             onClose={handleSeatMapClose}
//             travellers={travellers}
//             seatMap={seatMapData}
//             selectedSeats={selectedSeats}
//             onSelect={handleSeatSelect}
//             departure={travelDetails.departure.iataCode}
//             destination={travelDetails.arrival.iataCode}
//             pricedOffer={bookingResponse.pricedOffer}
//             onSeatMapUpdate={handleSeatMapUpdate}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingResponse;



import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import SeatMap from "./SeatMap";

const BookingResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingResponse = location.state?.bookingResponse;

  useEffect(() => {
    if (!bookingResponse) {
      navigate("/results", { replace: true });
    }
  }, [location.state, bookingResponse, navigate]);

  if (!bookingResponse) return null;

  const [travelDetails, setTravelDetails] = useState(bookingResponse);
  const totalTravelers = (bookingResponse.passengers?.adults || 0) + (bookingResponse.passengers?.children || 0) + (bookingResponse.passengers?.infants || 0);
  const [travelerDetails, setTravelerDetails] = useState(
    Array(totalTravelers)
      .fill()
      .map((_, index) => ({
        isOpen: false,
        title: "",
        firstName: "",
        lastName: "",
        mobileNo: "",
        selectedTravelerId: null,
      }))
  );
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    countryCode: "+91",
    companyName: "",
    gstin: "",
    gstAddress: "",
    gstPincode: "",
    saveGst: false,
  });
  const [errors, setErrors] = useState({});
  const [masterTravelers, setMasterTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addOnServices, setAddOnServices] = useState({
    mealPreference: "None",
    seatPreference: {},
    baggageUpgrade: false,
    travelInsurance: false,
  });
  const [showGstinSection, setShowGstinSection] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [seatMapData, setSeatMapData] = useState(bookingResponse.seatMap || []);

  useEffect(() => {
    const fetchMasterTravelers = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        if (!sessionToken) throw new Error("No session token found");
        const response = await fetch("http://localhost:3000/api/travelers", {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch master travelers");
        const data = await response.json();
        if (data.status !== "success") throw new Error(data.error || "Invalid response");
        setMasterTravelers(data.travelers || []);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Error loading master travelers. Please try again or add manually.");
      } finally {
        setLoading(false);
      }
    };
    fetchMasterTravelers();
  }, []);

  const handleTravelerToggle = (index) => {
    const updatedDetails = [...travelerDetails];
    updatedDetails[index].isOpen = !updatedDetails[index].isOpen;
    setTravelerDetails(updatedDetails);
  };

  const handleTravelerChange = (index, field, value) => {
    const updatedDetails = [...travelerDetails];
    updatedDetails[index][field] = value;
    setTravelerDetails(updatedDetails);
  };

  const handleTravelerSelect = (index, travelerId) => {
    const selectedTraveler = masterTravelers.find((t) => t.id === travelerId);
    if (selectedTraveler) {
      const updatedDetails = [...travelerDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        title: selectedTraveler.prefix || "",
        firstName: selectedTraveler.first_name || "",
        lastName: selectedTraveler.last_name || "",
        mobileNo: selectedTraveler.mobileNo || "",
        selectedTravelerId: travelerId,
      };
      setTravelerDetails(updatedDetails);
    }
  };

  const handleContactChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddOnChange = (field, value) => {
    setAddOnServices((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!contactInfo.email || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = "Please enter a valid email address (required)";
    }
    if (!contactInfo.phone || !/^\+?\d{10,15}$/.test(contactInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits, required)";
    }
    if (
      contactInfo.gstin &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/.test(contactInfo.gstin)
    ) {
      newErrors.gstin = "Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)";
    }
    travelerDetails.forEach((traveler, index) => {
      const missingFields = [];
      if (!traveler.title) missingFields.push("Title");
      if (!traveler.firstName) missingFields.push("First Name");
      if (!traveler.lastName) missingFields.push("Last Name");
      if (!traveler.mobileNo) missingFields.push("Mobile No");
      if (missingFields.length > 0) {
        newErrors[`traveler${index}`] = `Required fields missing: ${missingFields.join(", ")}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/payment", {
          state: { travelerDetails, contactInfo, bookingResponse: travelDetails, addOnServices, selectedSeats, seatMapData },
        });
      }, 2000);
    }
  };

  const handleSeatSelect = (travellerId, seatObj) => {
    setSelectedSeats((prev) => {
      const newSelectedSeats = { ...prev, [travellerId]: seatObj.seatNo };
      console.log("Selected Seats:", newSelectedSeats); // Debug: Log selected seats
      console.log("Seat Map Data:", seatMapData); // Debug: Log seat map data
      return newSelectedSeats;
    });
    setAddOnServices((prev) => ({
      ...prev,
      seatPreference: { ...prev.seatPreference, [travellerId]: seatObj.seatNo },
    }));
  };

  const handleSeatMapClose = () => {
    setShowSeatMap(false);
  };

  const handleSeatMapUpdate = (newSeatMap) => {
    setSeatMapData(newSeatMap);
    console.log("Updated Seat Map Data:", newSeatMap); // Debug: Log updated seat map
  };

  const getAvailableTravelers = (index) => {
    const selectedIds = travelerDetails
      .slice(0, index)
      .map((t) => t.selectedTravelerId)
      .filter((id) => id !== null);
    const selectedMasterCount = selectedIds.filter((id) =>
      masterTravelers.some((t) => t.id === id)
    ).length;
    return masterTravelers.filter(
      (t) =>
        !selectedIds.includes(t.id) &&
        (travelerDetails.length <= 5 || selectedMasterCount < 5)
    );
  };

  const travellers = travelerDetails.map((traveler, index) => ({
    id: traveler.selectedTravelerId || `traveller${index + 1}`,
    name: `${traveler.title} ${traveler.firstName} ${traveler.lastName}`.trim(),
  }));

  // Calculate total seat fare (aligned with SeatMap.jsx)
  const seatFare = Object.keys(selectedSeats).reduce((sum, travellerId) => {
    const seat = seatMapData
      .flatMap((row) => row.seats || [])
      .find((s) => s?.seatNo === selectedSeats[travellerId]);
    return sum + (seat?.fare || 0);
  }, 0);
  console.log("Calculated Seat Fare:", seatFare); // Debug: Log seat fare

  // Calculate flight fare including seat costs
  const flightPrice = parseFloat(bookingResponse.pricedOffer?.price?.grandTotal || 0);
  const flightFareWithSeats = (flightPrice * totalTravelers + seatFare).toFixed(2);

  // Calculate total amount (flight fare with seats + other line items)
  const totalAmount = (parseFloat(flightFareWithSeats)).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 relative">
      <h1 className="text-2xl font-bold text-indigo-800 mb-6">
        Review and Complete Your Booking
      </h1>

      {/* Travel Details Section */}
      <section className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4">
          Travel Details
        </h3>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-sm text-gray-600">Departure</p>
            <p className="font-semibold">
              {travelDetails.departure.iataCode} ({travelDetails.departure.city || "N/A"})
            </p>
            <p className="text-xs text-gray-500">
              {new Date(travelDetails.departure.at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })}
            </p>
          </div>
          <div className="text-center mt-2 sm:mt-0">
            <p className="text-lg font-bold">
              {travelDetails.departureTime}
            </p>
            <p className="text-xs text-gray-600">
              {travelDetails.departure.iataCode}, Terminal {travelDetails.departure.terminal || "N/A"}
            </p>
          </div>
          <div className="text-center mt-2 sm:mt-0">
            <p className="text-sm text-gray-600">{travelDetails.duration}</p>
            <p className="text-xs text-gray-500">{travelDetails.stops} stop{travelDetails.stops !== 1 ? "s" : ""}</p>
            <div className="flex items-center justify-center mt-1">
              <div className="h-px w-6 bg-gray-400"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <div className="h-px w-6 bg-gray-400"></div>
            </div>
          </div>
          <div className="text-center mt-2 sm:mt-0">
            <p className="text-lg font-bold">
              {travelDetails.arrivalTime}
            </p>
            <p className="text-xs text-gray-600">
              {travelDetails.arrival.iataCode} ({travelDetails.arrival.city || "N/A"}), Terminal {travelDetails.arrival.terminal || "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-sm text-gray-600">Aircraft</p>
            <p className="font-semibold">{travelDetails.aircraft}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Travel Class</p>
            <p className="font-semibold">{travelDetails.class}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Check-In Baggage</p>
            <p className="font-semibold">Adult - {travelDetails.baggage.checkIn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cabin Baggage</p>
            <p className="font-semibold">Adult - {travelDetails.baggage.cabin}</p>
          </div>
        </div>
      </section>

      {/* Traveler Details Section */}
      <section className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4">
          Traveler Details
        </h3>
        {loading ? (
          <p className="text-gray-600">Loading master travelers...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          travelerDetails.map((traveler, index) => {
            const isManualInput =
              travelerDetails.length > 5 &&
              travelerDetails.filter(
                (t) =>
                  t.selectedTravelerId &&
                  masterTravelers.some((mt) => mt.id === t.selectedTravelerId)
              ).length >= 5;
            return (
              <div
                key={index}
                className="mb-4 p-4 bg-white rounded-lg shadow-md"
              >
                <button
                  className="w-full text-left font-medium text-gray-700 flex justify-between items-center"
                  onClick={() => handleTravelerToggle(index)}
                >
                  <span>
                    Traveler {index + 1} (
                    {index < (bookingResponse.passengers?.adults || 0)
                      ? "Adult"
                      : index < (bookingResponse.passengers?.adults || 0) + (bookingResponse.passengers?.children || 0)
                      ? "Child"
                      : "Infant"}
                    )
                  </span>
                  <span>{traveler.isOpen ? "−" : "+"}</span>
                </button>
                {traveler.isOpen && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!isManualInput && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Select from Master
                        </label>
                        <select
                          value={traveler.selectedTravelerId || ""}
                          onChange={(e) =>
                            handleTravelerSelect(
                              index,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                        >
                          <option value="">Select Traveler</option>
                          {getAvailableTravelers(index).map((traveler) => (
                            <option key={traveler.id} value={traveler.id}>
                              {(traveler.prefix || "") + " " + (traveler.first_name || "") + " " + (traveler.last_name || "")}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={traveler.title}
                        onChange={(e) =>
                          handleTravelerChange(index, "title", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      >
                        <option value="">Select Title</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Master">Master</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={traveler.firstName}
                        onChange={(e) =>
                          handleTravelerChange(
                            index,
                            "firstName",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                        placeholder="Enter First Name"
                        required
                        disabled={
                          !isManualInput && traveler.selectedTravelerId !== null
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={traveler.lastName}
                        onChange={(e) =>
                          handleTravelerChange(
                            index,
                            "lastName",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                        placeholder="Enter Last Name"
                        required
                        disabled={
                          !isManualInput && traveler.selectedTravelerId !== null
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Mobile No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={traveler.mobileNo}
                        onChange={(e) =>
                          handleTravelerChange(
                            index,
                            "mobileNo",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                        placeholder="Enter Mobile No"
                        required
                      />
                    </div>
                  </div>
                )}
                {errors[`traveler${index}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`traveler${index}`]}
                  </p>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Contact Section */}
      <section className="mb-8 bg-gradient-to-r from-indigo-100 to-white p-6 rounded-xl shadow-lg border border-indigo-200">
        <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            ></path>
          </svg>
          Contact Information
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          📧✆ Ensure your details are correct—your ticket and flight information
          will be sent here!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="flex items-end space-x-2">
            <div className="relative">
              <select
                value={contactInfo.countryCode}
                onChange={(e) => handleContactChange("countryCode", e.target.value)}
                className="w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+86">+86</option>
                <option value="+81">+81</option>
                <option value="+971">+971</option>
                <option value="+61">+61</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                placeholder="81234 56789"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="example@email.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </section>

      {/* GSTIN Section */}
      <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
        {!showGstinSection ? (
          <div className="flex items-center justify-between p-2">
            <div>
              <h3 className="text-lg font-semibold text-indigo-800">
                💼 Use GSTIN for this booking{" "}
                <span className="text-sm text-gray-500">(Optional)</span>
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Claim credit of GST charges. Your taxes may get updated post
                submitting your GST details.
              </p>
            </div>
            <button
              className="px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={() => setShowGstinSection(true)}
            >
              ADD
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-indigo-800">
                💼 Use GSTIN for this booking{" "}
                <span className="text-sm text-gray-500">(Optional)</span>
              </h3>
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={() => setShowGstinSection(false)}
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Claim credit of GST charges. Your taxes may get updated post
              submitting your GST details.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="GSTIN"
                className="p-2 border border-gray-300 rounded-lg"
                value={contactInfo.gstin}
                onChange={(e) => handleContactChange("gstin", e.target.value)}
              />
              <input
                type="text"
                placeholder="GST Holder Name"
                className="p-2 border border-gray-300 rounded-lg"
                value={contactInfo.companyName}
                onChange={(e) =>
                  handleContactChange("companyName", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="p-2 border border-gray-300 rounded-lg"
                value={contactInfo.gstAddress}
                onChange={(e) =>
                  handleContactChange("gstAddress", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Pincode"
                className="p-2 border border-gray-300 rounded-lg"
                value={contactInfo.gstPincode}
                onChange={(e) =>
                  handleContactChange("gstPincode", e.target.value)
                }
              />
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={contactInfo.saveGst || false}
                  onChange={(e) =>
                    handleContactChange("saveGst", e.target.checked)
                  }
                />
                Save GST Details
              </label>
            </div>
          </>
        )}
      </section>

      {/* Addon Services Section */}
      <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
          🛍️ Addon Services
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            className={`flex items-center gap-2 border p-3 rounded-lg ${
              addOnServices.mealPreference !== "None"
                ? "bg-indigo-100 border-indigo-500"
                : "bg-white border-gray-300"
            }`}
            onClick={() =>
              handleAddOnChange(
                "mealPreference",
                addOnServices.mealPreference === "None" ? "Vegetarian" : "None"
              )
            }
          >
            🍽️ Add Meals
          </button>
          <button
            className={`flex items-center gap-2 border p-3 rounded-lg ${
              addOnServices.baggageUpgrade
                ? "bg-indigo-100 border-indigo-500"
                : "bg-white border-gray-300"
            }`}
            onClick={() =>
              handleAddOnChange("baggageUpgrade", !addOnServices.baggageUpgrade)
            }
          >
            🧳 Add Baggage
          </button>
          <button
            className={`flex items-center gap-2 border p-3 rounded-lg ${
              Object.keys(addOnServices.seatPreference).length > 0
                ? "bg-indigo-100 border-indigo-500"
                : "bg-white border-gray-300"
            }`}
            onClick={() => setShowSeatMap(true)}
          >
            💺 Seat Selection
          </button>
        </div>
      </section>

      {/* Fare Summary Section */}
      <section className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4">
          Fare Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Flight Fare ({totalTravelers} Traveler{totalTravelers !== 1 ? "s" : ""})</span>
            <span>€{flightFareWithSeats}</span>
          </div>
          <div className="flex justify-between">
            <span>Instant Discount</span>
            <span>€0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Insurance</span>
            <span>€0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>€0.00</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span>€{totalAmount}</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            INFO: Meal, seat, rescheduling & cancellation are chargeable.
          </p>
        </div>
      </section>

      <div className="flex justify-between">
        <Button
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
          onClick={handleSubmit}
        >
          Continue to Payment
        </Button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-md"></div>
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-auto text-center transform transition-all duration-300 ease-in-out animate-pulse">
            <h3 className="text-2xl font-bold text-indigo-800 mb-4">
              Please wait
            </h3>
            <p className="text-gray-600 mb-4">
              While we transfer to the payment page. This may take some time.
            </p>
            <hr className="border-t-2 border-gray-300 my-4" />
            <p className="text-yellow-600 flex items-center justify-center text-sm">
              <span className="mr-2">⚠️</span> Do not refresh the page
            </p>
          </div>
        </div>
      )}

      {showSeatMap && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <SeatMap
            open={showSeatMap}
            onClose={handleSeatMapClose}
            travellers={travellers}
            seatMap={seatMapData}
            selectedSeats={selectedSeats}
            onSelect={handleSeatSelect}
            departure={travelDetails.departure.iataCode}
            destination={travelDetails.arrival.iataCode}
            pricedOffer={bookingResponse.pricedOffer}
            onSeatMapUpdate={handleSeatMapUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default BookingResponse;