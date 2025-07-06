// import React, { useState } from "react";
// import { CreditCardIcon, InfoIcon } from "lucide-react";

// const CreditCard = ({  handlePayment}) => {
//   const [cardType, setCardType] = useState("all");
//   const [isInternational, setIsInternational] = useState(false);
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardHolderName, setCardHolderName] = useState("");
//   const [expiryMonth, setExpiryMonth] = useState("");
//   const [expiryYear, setExpiryYear] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [saveCard, setSaveCard] = useState(false);
//   const [errors, setErrors] = useState({});

//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];
//   const years = Array.from({ length: 12 }, (_, i) => 2024 + i);

//   const validateForm = () => {
//     const newErrors = {};
//     if (cardType === "all") {
//       newErrors.cardType = "Please select a card type";
//     }
//     if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
//       newErrors.cardNumber = "Please enter a valid 16-digit card number";
//     }
//     if (!cardHolderName.trim()) {
//       newErrors.cardHolderName = "Please enter the cardholder's name";
//     }
//     if (!expiryMonth) {
//       newErrors.expiryMonth = "Please select expiry month";
//     }
//     if (!expiryYear) {
//       newErrors.expiryYear = "Please select expiry year";
//     }
//     if (!/^\d{3}$/.test(cvv)) {
//       newErrors.cvv = "Please enter a valid 3-digit CVV";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       handlePayment({
//         cardType,
//         cardNumber: cardNumber.replace(/\s/g, ""),
//         cardHolderName,
//         expiry: `${expiryMonth}/${expiryYear}`,
//         cvv,
//         isInternational,
//         saveCard
//       });
//     } else {
//       alert("Please fix the errors in the form");
//     }
//   };

//   const formatCardNumber = (value) => {
//     const cleaned = value.replace(/\D/g, "");
//     const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
//     return formatted.slice(0, 19); // 16 digits + 3 spaces
//   };

//   return (
//     <div className="space-y-6">
//       {/* 3-Step Instruction Graphic */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//         <div>
//           <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
//           <p className="text-sm mt-2">Select card and enter details</p>
//         </div>
//         <div>
//           <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
//           <p className="text-sm mt-2">Verify cardholder information</p>
//         </div>
//         <div>
//           <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
//           <p className="text-sm mt-2">Confirm payment securely</p>
//         </div>
//       </div>

//       {/* Credit Card Form */}
//       <div className="space-y-4">
//         {/* Card Type */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Card
//           </label>
//           <select
//             value={cardType}
//             onChange={(e) => setCardType(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//           >
//             <option value="all">All Cards</option>
//             <option value="visa">Visa</option>
//             <option value="mastercard">MasterCard</option>
//             <option value="amex">American Express</option>
//             <option value="rupay">RuPay</option>
//           </select>
//           {errors.cardType && (
//             <p className="text-red-500 text-xs mt-1">{errors.cardType}</p>
//           )}
//           <label className="inline-flex items-center mt-2 text-sm">
//             <input
//               type="checkbox"
//               checked={isInternational}
//               onChange={(e) => setIsInternational(e.target.checked)}
//               className="mr-2"
//             />
//             Click on check box if International Card
//           </label>
//         </div>

//         {/* Card Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Card Number
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               value={cardNumber}
//               onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
//               placeholder="Card Number"
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               maxLength={19}
//             />
//             <div className="absolute right-2 top-2 flex gap-1">
//               <img src="https://img.icons8.com/color/24/visa.png" alt="Visa" />
//               <img src="https://img.icons8.com/color/24/mastercard.png" alt="MasterCard" />
//               <img src="https://img.icons8.com/color/24/american-express.png" alt="Amex" />
//             </div>
//           </div>
//           {errors.cardNumber && (
//             <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
//           )}
//         </div>

//         {/* Name on Card */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name on Card
//           </label>
//           <input
//             type="text"
//             value={cardHolderName}
//             onChange={(e) => setCardHolderName(e.target.value)}
//             placeholder="Enter name here"
//             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//           />
//           {errors.cardHolderName && (
//             <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>
//           )}
//         </div>

//         {/* Expiry Date and CVV */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Expiry Date
//             </label>
//             <div className="flex gap-2">
//               <select
//                 value={expiryMonth}
//                 onChange={(e) => setExpiryMonth(e.target.value)}
//                 className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               >
//                 <option value="">Month</option>
//                 {months.map((month) => (
//                   <option key={month} value={month}>
//                     {month}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={expiryYear}
//                 onChange={(e) => setExpiryYear(e.target.value)}
//                 className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               >
//                 <option value="">Year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {(errors.expiryMonth || errors.expiryYear) && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.expiryMonth || errors.expiryYear}
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               CVV
//               <span className="relative group inline-block ml-1">
//                 <InfoIcon className="h-4 w-4 text-gray-500" />
//                 <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white p-2 rounded-lg -top-10 left-0">
//                   3 digits printed on the back of the card
//                 </span>
//               </span>
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={cvv}
//                 onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
//                 placeholder="CVV"
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                 maxLength={3}
//               />
//               <CreditCardIcon className="absolute right-2 top-2 h-5 w-5 text-gray-500" />
//             </div>
//             {errors.cvv && (
//               <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
//             )}
//           </div>
//         </div>

//         {/* Save Card Checkbox */}
//         <div>
//           <label className="inline-flex items-center text-sm">
//             <input
//               type="checkbox"
//               checked={saveCard}
//               onChange={(e) => setSaveCard(e.target.checked)}
//               className="mr-2"
//             />
//             Save your card details for faster checkout
//           </label>
//           <p className="text-xs text-gray-500 mt-1">
//             Note: CVV is not saved for security.
//           </p>
//         </div>
//       </div>

//       {/* Make Payment Button */}
//       <div className="flex justify-between items-center">
//         {/* <div className="text-lg font-bold">
//           Total Payable Amount:{" "}
//           <span className="text-red-600">₹{totalAmount}</span>
//         </div> */}
//         <button
//           className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-1.5 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
//           onClick={handleSubmit}
//         >
//           MAKE PAYMENT
//         </button>
//       </div>

      
//     </div>
//   );
// };

// export default CreditCard;





// import React, { useState } from "react";
// import { CreditCardIcon, InfoIcon } from "lucide-react";

// const CreditCard = ({ totalAmount, handlePayment, timeLeft, disabled }) => {
//   const [cardType, setCardType] = useState("all");
//   const [isInternational, setIsInternational] = useState(false);
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardHolderName, setCardHolderName] = useState("");
//   const [expiryMonth, setExpiryMonth] = useState("");
//   const [expiryYear, setExpiryYear] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [saveCard, setSaveCard] = useState(false);
//   const [errors, setErrors] = useState({});

//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];
//   const years = Array.from({ length: 12 }, (_, i) => 2024 + i);

//   const validateForm = () => {
//     const newErrors = {};
//     if (cardType === "all") {
//       newErrors.cardType = "Please select a card type";
//     }
//     if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
//       newErrors.cardNumber = "Please enter a valid 16-digit card number";
//     }
//     if (!cardHolderName.trim()) {
//       newErrors.cardHolderName = "Please enter the cardholder's name";
//     }
//     if (!expiryMonth) {
//       newErrors.expiryMonth = "Please select expiry month";
//     }
//     if (!expiryYear) {
//       newErrors.expiryYear = "Please select expiry year";
//     }
//     if (!/^\d{3}$/.test(cvv)) {
//       newErrors.cvv = "Please enter a valid 3-digit CVV";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       handlePayment({
//         cardType,
//         cardNumber: cardNumber.replace(/\s/g, ""),
//         cardHolderName,
//         expiry: `${expiryMonth}/${expiryYear}`,
//         cvv,
//         isInternational,
//         saveCard
//       });
//     } else {
//       alert("Please fix the errors in the form");
//     }
//   };

//   const formatCardNumber = (value) => {
//     const cleaned = value.replace(/\D/g, "");
//     const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
//     return formatted.slice(0, 19); // 16 digits + 3 spaces
//   };

//   return (
//     <div className="space-y-6">
//       {/* 3-Step Instruction Graphic */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//         <div>
//           <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
//           <p className="text-sm mt-2">Select card and enter details</p>
//         </div>
//         <div>
//           <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
//           <p className="text-sm mt-2">Verify cardholder information</p>
//         </div>
//         <div>
//           <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
//           <p className="text-sm mt-2">Confirm payment securely</p>
//         </div>
//       </div>

//       {/* Credit Card Form */}
//       <div className="space-y-4">
//         {/* Card Type */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Card
//           </label>
//           <select
//             value={cardType}
//             onChange={(e) => setCardType(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//             disabled={disabled}
//           >
//             <option value="all">All Cards</option>
//             <option value="visa">Visa</option>
//             <option value="mastercard">MasterCard</option>
//             <option value="amex">American Express</option>
//             <option value="rupay">RuPay</option>
//           </select>
//           {errors.cardType && (
//             <p className="text-red-500 text-xs mt-1">{errors.cardType}</p>
//           )}
//           <label className="inline-flex items-center mt-2 text-sm">
//             <input
//               type="checkbox"
//               checked={isInternational}
//               onChange={(e) => setIsInternational(e.target.checked)}
//               className="mr-2"
//               disabled={disabled}
//             />
//             Click on check box if International Card
//           </label>
//         </div>

//         {/* Card Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Card Number
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               value={cardNumber}
//               onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
//               placeholder="Card Number"
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//               maxLength={19}
//               disabled={disabled}
//             />
//             <div className="absolute right-2 top-2 flex gap-1">
//               <img src="https://img.icons8.com/color/24/visa.png" alt="Visa" />
//               <img src="https://img.icons8.com/color/24/mastercard.png" alt="MasterCard" />
//               <img src="https://img.icons8.com/color/24/american-express.png" alt="Amex" />
//             </div>
//           </div>
//           {errors.cardNumber && (
//             <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
//           )}
//         </div>

//         {/* Name on Card */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name on Card
//           </label>
//           <input
//             type="text"
//             value={cardHolderName}
//             onChange={(e) => setCardHolderName(e.target.value)}
//             placeholder="Enter name here"
//             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//             disabled={disabled}
//           />
//           {errors.cardHolderName && (
//             <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>
//           )}
//         </div>

//         {/* Expiry Date and CVV */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Expiry Date
//             </label>
//             <div className="flex gap-2">
//               <select
//                 value={expiryMonth}
//                 onChange={(e) => setExpiryMonth(e.target.value)}
//                 className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                 disabled={disabled}
//               >
//                 <option value="">Month</option>
//                 {months.map((month) => (
//                   <option key={month} value={month}>
//                     {month}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={expiryYear}
//                 onChange={(e) => setExpiryYear(e.target.value)}
//                 className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                 disabled={disabled}
//               >
//                 <option value="">Year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {(errors.expiryMonth || errors.expiryYear) && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.expiryMonth || errors.expiryYear}
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               CVV
//               <span className="relative group inline-block ml-1">
//                 <InfoIcon className="h-4 w-4 text-gray-500" />
//                 <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white p-2 rounded-lg -top-10 left-0">
//                   3 digits printed on the back of the card
//                 </span>
//               </span>
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={cvv}
//                 onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
//                 placeholder="CVV"
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
//                 maxLength={3}
//                 disabled={disabled}
//               />
//               <CreditCardIcon className="absolute right-2 top-2 h-5 w-5 text-gray-500" />
//             </div>
//             {errors.cvv && (
//               <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
//             )}
//           </div>
//         </div>

//         {/* Save Card Checkbox */}
//         <div>
//           <label className="inline-flex items-center text-sm">
//             <input
//               type="checkbox"
//               checked={saveCard}
//               onChange={(e) => setSaveCard(e.target.checked)}
//               className="mr-2"
//               disabled={disabled}
//             />
//             Save your card details for faster checkout
//           </label>
//           <p className="text-xs text-gray-500 mt-1">
//             Note: CVV is not saved for security.
//           </p>
//         </div>
//       </div>

//       {/* Make Payment Button */}
//       <div className="flex justify-between items-center">
//         <button
//           className={`bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-1.5 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out ${
//             disabled ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           onClick={handleSubmit}
//           disabled={disabled}
//         >
//           {disabled ? "Processing..." : "MAKE PAYMENT"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreditCard;



import React, { useState } from "react";
import { CreditCardIcon, InfoIcon } from "lucide-react";

const CreditCard = ({ totalAmount, handlePayment, timeLeft, disabled }) => {
  const [cardType, setCardType] = useState("all");
  const [isInternational, setIsInternational] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [errors, setErrors] = useState({});

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const years = Array.from({ length: 12 }, (_, i) => 2024 + i);

  const validateForm = () => {
    const newErrors = {};
    if (cardType === "all") {
      newErrors.cardType = "Please select a card type";
    }
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }
    if (!cardHolderName.trim()) {
      newErrors.cardHolderName = "Please enter the cardholder's name";
    }
    if (!expiryMonth) {
      newErrors.expiryMonth = "Please select expiry month";
    }
    if (!expiryYear) {
      newErrors.expiryYear = "Please select expiry year";
    }
    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = "Please enter a valid 3-digit CVV";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handlePayment({
        cardType,
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardHolderName,
        expiry: `${expiryMonth}/${expiryYear}`,
        cvv,
        isInternational,
        saveCard
      });
    } else {
      alert("Please fix the errors in the form");
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  return (
    <div className="space-y-6">
      {/* 3-Step Instruction Graphic */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
          <p className="text-sm mt-2">Select card and enter details</p>
        </div>
        <div>
          <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
          <p className="text-sm mt-2">Verify cardholder information</p>
        </div>
        <div>
          <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
          <p className="text-sm mt-2">Confirm payment securely</p>
        </div>
      </div>

      {/* Credit Card Form */}
      <div className="space-y-4">
        {/* Card Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Card
          </label>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            disabled={disabled}
          >
            <option value="all">All Cards</option>
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
            <option value="amex">American Express</option>
            <option value="rupay">RuPay</option>
          </select>
          {errors.cardType && (
            <p className="text-red-500 text-xs mt-1">{errors.cardType}</p>
          )}
          <label className="inline-flex items-center mt-2 text-sm">
            <input
              type="checkbox"
              checked={isInternational}
              onChange={(e) => setIsInternational(e.target.checked)}
              className="mr-2"
              disabled={disabled}
            />
            Click on check box if International Card
          </label>
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="Card Number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
              maxLength={19}
              disabled={disabled}
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <img src="https://img.icons8.com/color/24/visa.png" alt="Visa" />
              <img src="https://img.icons8.com/color/24/mastercard.png" alt="MasterCard" />
              <img src="https://img.icons8.com/color/24/american-express.png" alt="Amex" />
            </div>
          </div>
          {errors.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Name on Card */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name on Card
          </label>
          <input
            type="text"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            placeholder="Enter name here"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            disabled={disabled}
          />
          {errors.cardHolderName && (
            <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <div className="flex gap-2">
              <select
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                disabled={disabled}
              >
                <option value="">Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                disabled={disabled}
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {(errors.expiryMonth || errors.expiryYear) && (
              <p className="text-red-500 text-xs mt-1">
                {errors.expiryMonth || errors.expiryYear}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
              <span className="relative group inline-block ml-1">
                <InfoIcon className="h-4 w-4 text-gray-500" />
                <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white p-2 rounded-lg -top-10 left-0">
                  3 digits printed on the back of the card
                </span>
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="CVV"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                maxLength={3}
                disabled={disabled}
              />
              <CreditCardIcon className="absolute right-2 top-2 h-5 w-5 text-gray-500" />
            </div>
            {errors.cvv && (
              <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Save Card Checkbox */}
        <div>
          <label className="inline-flex items-center text-sm">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="mr-2"
              disabled={disabled}
            />
            Save your card details for faster checkout
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Note: CVV is not saved for security.
          </p>
        </div>
      </div>

      {/* Make Payment Button */}
      <div className="flex justify-between items-center">
        <button
          className={`bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-1.5 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={disabled}
        >
          {disabled ? "Processing..." : "MAKE PAYMENT"}
        </button>
      </div>
    </div>
  );
};

export default CreditCard;