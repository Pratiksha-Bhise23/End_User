


// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Menu, X, Plane, User, LogOut, Settings, Database } from "lucide-react";
// import Button from "../components/Button";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import VerifyOTP from "../pages/VerifyOTP";
// import { CurrencyContext } from "./CurrencyContext";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
//   const [isVerifyOtpModalOpen, setIsVerifyOtpModalOpen] = useState(false);
//   // eslint-disable-next-line no-unused-vars
//   const [otpData, setOtpData] = useState(null);
//   const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

//   const { countries, selectedCountry, updateSelectedCountry, loading, error } =
//     useContext(CurrencyContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("sessionToken");
//     if (token) {
//       setIsLoggedIn(true);
//       try {
//         const decodedToken = JSON.parse(atob(token.split(".")[1]));
//         setUserName(decodedToken.name || "User");
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         setUserName("User");
//       }
//     } else {
//       setIsLoggedIn(false);
//       setUserName("");
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("sessionToken");
//     setIsLoggedIn(false);
//     setUserName("");
//     setIsDropdownOpen(false);
//     setIsOpen(false);
//     navigate("/");
//   };

//   const handleCountrySelect = (country) => {
//     updateSelectedCountry(country);
//     setIsCountryDropdownOpen(false);
//   };

//   return (
//     <>
//       <nav className="bg-white p-4 flex justify-between items-center mx-6 lg:mx-12">
//         <div className="flex items-center space-x-2">
//           <Plane className="w-7 h-7 text-blue-500" />
//           <h1 className="text-2xl font-bold text-gray-800">Multifly</h1>
//         </div>
//         <button
//           className="md:hidden text-gray-700"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//         <div
//           className={`md:flex space-x-10 items-center ${
//             isOpen ? "block" : "hidden"
//           } absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}
//         >
//           <Link
//             to="/promo"
//             className="block md:inline text-gray-700 hover:text-blue-500 p-2 font-medium"
//             onClick={() => setIsOpen(false)}
//           >
//             Promo
//           </Link>
//           <Link
//             to="/help"
//             className="block md:inline text-gray-700 hover:text-blue-500 p-2 font-medium"
//             onClick={() => setIsOpen(false)}
//           >
//             Help
//           </Link>
//           <Link
//             to="/order"
//             className="block md:inline text-gray-700 hover:text-blue-500 p-2 font-medium"
//             onClick={() => setIsOpen(false)}
//           >
//             Order
//           </Link>
//           {/* Country Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
//               className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 focus:outline-none p-2"
//             >
//               <span className="text-sm font-medium">
//                 {selectedCountry ? selectedCountry.currency_code : "USD"}
//               </span>
//               <svg
//                 className={`w-4 h-4 transition-transform ${
//                   isCountryDropdownOpen ? "rotate-180" : ""
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             {isCountryDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 max-h-60 overflow-y-auto">
//                 {loading ? (
//                   <div className="px-4 py-2 text-sm text-gray-700">
//                     Loading countries...
//                   </div>
//                 ) : error ? (
//                   <div className="px-4 py-2 text-sm text-red-500">{error}</div>
//                 ) : (
//                   <div className="py-2">
//                     {countries.map((country) => (
//                       <button
//                         key={country.id}
//                         onClick={() => handleCountrySelect(country)}
//                         className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors ${
//                           selectedCountry && selectedCountry.name === country.name
//                             ? "bg-blue-100"
//                             : ""
//                         }`}
//                       >
//                         {country.name} ({country.currency_code})
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//           {isLoggedIn ? (
//             <div className="relative">
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 focus:outline-none p-2"
//               >
//                 <User className="w-5 h-5" />
//                 <span className="text-sm font-medium">{userName}</span>
//                 <svg
//                   className={`w-4 h-4 transition-transform ${
//                     isDropdownOpen ? "rotate-180" : ""
//                   }`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
//                   <div className="py-2">
//                     <button
//                       onClick={() => {
//                         navigate("/masterdata");
//                         setIsDropdownOpen(false);
//                         setIsOpen(false);
//                       }}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
//                     >
//                       <Database className="w-5 h-5 mr-2" />
//                       Masterdata
//                     </button>
//                     <button
//                       onClick={() => {
//                         navigate("/settings");
//                         setIsDropdownOpen(false);
//                         setIsOpen(false);
//                       }}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
//                     >
//                       <Settings className="w-5 h-5 mr-2" />
//                       Settings
//                     </button>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
//                     >
//                       <LogOut className="w-5 h-5 mr-2" />
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Button
//               className="text-xs sm:text-sm bg-blue-600 hover:bg-blue-400"
//               variant=""
//               onClick={() => {
//                 setIsLoginModalOpen(true);
//                 setIsOpen(false);
//               }}
//             >
//               Login
//             </Button>
//           )}
//         </div>
//       </nav>

//       {isLoginModalOpen && (
//         <Login
//           onClose={() => setIsLoginModalOpen(false)}
//           onRegister={(phone) => {
//             setIsLoginModalOpen(false);
//             setIsRegisterModalOpen(true);
//             navigate("/register", { state: { phone } });
//           }}
//           onVerifyOtp={(phone) => {
//             setIsLoginModalOpen(false);
//             setOtpData({ phone });
//             setIsVerifyOtpModalOpen(true);
//             navigate("/verify-otp", { state: { phone } });
//           }}
//         />
//       )}

//       {isRegisterModalOpen && (
//         <Register
//           onClose={() => setIsRegisterModalOpen(false)}
//           onVerifyOtp={(phone, email) => {
//             setIsRegisterModalOpen(false);
//             setOtpData({ phone, email });
//             setIsVerifyOtpModalOpen(true);
//             navigate("/verify-otp", { state: { phone, email } });
//           }}
//         />
//       )}

//       {isVerifyOtpModalOpen && (
//         <VerifyOTP onClose={() => setIsVerifyOtpModalOpen(false)} />
//       )}
//     </>
//   );
// };

// export default Navbar;

// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Menu, X, Plane, User, LogOut, Settings, Database } from "lucide-react";
// import Button from "../components/Button";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import VerifyOTP from "../pages/VerifyOTP";
// import { CurrencyContext } from "./CurrencyContext";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
//   const [isVerifyOtpModalOpen, setIsVerifyOtpModalOpen] = useState(false);
//   // eslint-disable-next-line no-unused-vars
//   const [otpData, setOtpData] = useState(null);
//   const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

//   const { countries, selectedCountry, updateSelectedCountry, resetSelectedCountry, loading, error } =
//     useContext(CurrencyContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("sessionToken");
//     if (token) {
//       setIsLoggedIn(true);
//       try {
//         const decodedToken = JSON.parse(atob(token.split(".")[1]));
//         setUserName(decodedToken.name || "User");
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         setUserName("User");
//       }
//     } else {
//       setIsLoggedIn(false);
//       setUserName("");
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("sessionToken");
//     localStorage.removeItem("selectedCountry"); // Clear selected country
//     resetSelectedCountry(); // Reset selectedCountry in context
//     setIsLoggedIn(false);
//     setUserName("");
//     setIsDropdownOpen(false);
//     setIsOpen(false);
//     navigate("/");
//   };

//   const handleCountrySelect = (country) => {
//     updateSelectedCountry(country);
//     setIsCountryDropdownOpen(false);
//   };

//   return (
//     <>
//       <nav className="bg-white p-4 flex justify-between items-center mx-6 lg:mx-12">
//         <div className="flex items-center space-x-2">
//           <Plane className="w-7 h-7 text-blue-500" />
//           <h1 className="text-2xl font-bold text-gray-800">Multifly</h1>
//         </div>
//         <button
//           className="md:hidden text-gray-700"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//         <div
//           className={`md:flex space-x-10 items-center ${
//             isOpen ? "block" : "hidden"
//           } absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}
//         >
//           <Link
//             to="/promo"
//             className="block md:inline text-gray-700 hover:text-blue-500 p-2 font-medium"
//             onClick={() => setIsOpen(false)}
//           >
//             Promo
//           </Link>
//           <Link
//             to="/help"
//             className="block md:inline text-gray-700 hover:text-blue-500 p-2 font-medium"
//             onClick={() => setIsOpen(false)}
//           >
//             Help
//           </Link>
//           <Link
//             to="/order"
//             className="block md:inline text-gray-700 hover:text-blue-500 p-2 font-medium"
//             onClick={() => setIsOpen(false)}
//           >
//             Order
//           </Link>
//           {/* Country Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
//               className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 focus:outline-none p-2"
//             >
//               <span className="text-sm font-medium">
//                 {selectedCountry ? selectedCountry.currency_code : "USD"}
//               </span>
//               <svg
//                 className={`w-4 h-4 transition-transform ${
//                   isCountryDropdownOpen ? "rotate-180" : ""
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             {isCountryDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 max-h-60 overflow-y-auto">
//                 {loading ? (
//                   <div className="px-4 py-2 text-sm text-gray-700">
//                     Loading countries...
//                   </div>
//                 ) : error ? (
//                   <div className="px-4 py-2 text-sm text-red-500">{error}</div>
//                 ) : (
//                   <div className="py-2">
//                     {countries.map((country) => (
//                       <button
//                         key={country.id}
//                         onClick={() => handleCountrySelect(country)}
//                         className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors ${
//                           selectedCountry && selectedCountry.name === country.name
//                             ? "bg-blue-100"
//                             : ""
//                         }`}
//                       >
//                         {country.name} ({country.currency_code})
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//           {isLoggedIn ? (
//             <div className="relative">
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 focus:outline-none p-2"
//               >
//                 <User className="w-5 h-5" />
//                 <span className="text-sm font-medium">{userName}</span>
//                 <svg
//                   className={`w-4 h-4 transition-transform ${
//                     isDropdownOpen ? "rotate-180" : ""
//                   }`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
//                   <div className="py-2">
//                     <button
//                       onClick={() => {
//                         navigate("/masterdata");
//                         setIsDropdownOpen(false);
//                         setIsOpen(false);
//                       }}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
//                     >
//                       <Database className="w-5 h-5 mr-2" />
//                       Masterdata
//                     </button>
//                     <button
//                       onClick={() => {
//                         navigate("/settings");
//                         setIsDropdownOpen(false);
//                         setIsOpen(false);
//                       }}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
//                     >
//                       <Settings className="w-5 h-5 mr-2" />
//                       Settings
//                     </button>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
//                     >
//                       <LogOut className="w-5 h-5 mr-2" />
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Button
//               className="text-xs sm:text-sm bg-blue-600 hover:bg-blue-400"
//               variant=""
//               onClick={() => {
//                 setIsLoginModalOpen(true);
//                 setIsOpen(false);
//               }}
//             >
//               Login
//             </Button>
//           )}
//         </div>
//       </nav>

//       {isLoginModalOpen && (
//         <Login
//           onClose={() => setIsLoginModalOpen(false)}
//           onRegister={(phone) => {
//             setIsLoginModalOpen(false);
//             setIsRegisterModalOpen(true);
//             navigate("/register", { state: { phone } });
//           }}
//           onVerifyOtp={(phone) => {
//             setIsLoginModalOpen(false);
//             setOtpData({ phone });
//             setIsVerifyOtpModalOpen(true);
//             navigate("/verify-otp", { state: { phone } });
//           }}
//         />
//       )}

//       {isRegisterModalOpen && (
//         <Register
//           onClose={() => setIsRegisterModalOpen(false)}
//           onVerifyOtp={(phone, email) => {
//             setIsRegisterModalOpen(false);
//             setOtpData({ phone, email });
//             setIsVerifyOtpModalOpen(true);
//             navigate("/verify-otp", { state: { phone, email } });
//           }}
//         />
//       )}

//       {isVerifyOtpModalOpen && (
//         <VerifyOTP onClose={() => setIsVerifyOtpModalOpen(false)} />
//       )}
//     </>
//   );
// };

// export default Navbar;



import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, Plane, User, LogOut, Settings, Database } from "lucide-react";
import Button from "../components/Button";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOTP from "../pages/VerifyOTP";
import { CurrencyContext } from "./CurrencyContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVerifyOtpModalOpen, setIsVerifyOtpModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [otpData, setOtpData] = useState(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const { countries, selectedCountry, updateSelectedCountry, resetSelectedCountry, loading, error } =
    useContext(CurrencyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const updateLoginStatus = () => {
      const token = localStorage.getItem("sessionToken");
      if (token) {
        setIsLoggedIn(true);
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          console.log("Decoded Token:", decodedToken); // Debug log
          setUserName(decodedToken.name || decodedToken.username || decodedToken.email || "User");
        } catch (error) {
          console.error("Error decoding token:", error);
          setUserName("User");
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    updateLoginStatus();
    window.addEventListener("storage", updateLoginStatus);
    return () => window.removeEventListener("storage", updateLoginStatus);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector("nav");
      if (window.scrollY > 50) {
        navbar.classList.add("bg-opacity-90", "backdrop-blur-sm");
      } else {
        navbar.classList.remove("bg-opacity-90", "backdrop-blur-sm");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("selectedCountry");
    resetSelectedCountry();
    setIsLoggedIn(false);
    setUserName("");
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate("/");
  };

  const handleCountrySelect = (country) => {
    updateSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-white w-full px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm rounded-3xl ">
        <div className="flex items-center space-x-2">
          <Plane className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-sans">
            Multifly
          </h1>
        </div>
        <button
          className="md:hidden text-gray-800 hover:text-blue-600 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div
          className={`md:flex space-x-10 items-center ${
            isOpen ? "block" : "hidden"
          } absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 shadow-md md:shadow-none`}
        >
          <Link
            to="/promo"
            className="block md:inline text-gray-800 hover:text-blue-600 p-2 font-medium transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Promo
          </Link>
          <Link
            to="/help"
            className="block md:inline text-gray-800 hover:text-blue-600 p-2 font-medium transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Help
          </Link>
          <Link
            to="/order"
            className="block md:inline text-gray-800 hover:text-blue-600 p-2 font-medium transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Order
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 focus:outline-none p-2 transition-colors duration-200"
            >
              <span className="text-sm font-medium">
                {selectedCountry ? selectedCountry.currency_code : "USD"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isCountryDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isCountryDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-10 max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Loading countries...
                  </div>
                ) : error ? (
                  <div className="px-4 py-2 text-sm text-red-500">{error}</div>
                ) : (
                  <div className="py-2">
                    {countries.map((country) => (
                      <button
                        key={country.id}
                        onClick={() => handleCountrySelect(country)}
                        className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded-md ${
                          selectedCountry && selectedCountry.name === country.name
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }`}
                      >
                        {country.name} ({country.currency_code})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 focus:outline-none p-2 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{userName}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/masterdata");
                        setIsDropdownOpen(false);
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded-md"
                    >
                      <Database className="w-5 h-5 mr-2" />
                      Masterdata
                    </button>
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setIsDropdownOpen(false);
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded-md"
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white transition-colors duration-200 rounded-md"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              className="text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-full px-4 py-2 transition-colors duration-200"
              variant=""
              onClick={() => {
                setIsLoginModalOpen(true);
                setIsOpen(false);
              }}
            >
              Login
            </Button>
          )}
        </div>
      </nav>

      {isLoginModalOpen && (
        <Login
          onClose={() => setIsLoginModalOpen(false)}
          onRegister={(phone) => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
            navigate("/register", { state: { phone } });
          }}
          onVerifyOtp={(phone) => {
            setIsLoginModalOpen(false);
            setOtpData({ phone });
            setIsVerifyOtpModalOpen(true);
            navigate("/verify-otp", { state: { phone } });
          }}
        />
      )}

      {isRegisterModalOpen && (
        <Register
          onClose={() => setIsRegisterModalOpen(false)}
          onVerifyOtp={(phone, email) => {
            setIsRegisterModalOpen(false);
            setOtpData({ phone, email });
            setIsVerifyOtpModalOpen(true);
            navigate("/verify-otp", { state: { phone, email } });
          }}
        />
      )}

      {isVerifyOtpModalOpen && (
        <VerifyOTP onClose={() => setIsVerifyOtpModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;