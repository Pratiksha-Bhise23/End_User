

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// const AddTraveller = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     prefix: "Mr",
//     first_name: "",
//     last_name: "",
//     gender: "Male",
//     date_of_birth: "",
//     nationality: "",
//     passport_number: "",
//     passport_issuing_country: "",
//     passport_issue_date: "",
//     passport_expiry_date: "",
//     berth_preference: "",
//     food_preference: "Veg"
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const sessionId = localStorage.getItem("sessionToken");
//     if (!sessionId) {
//       alert("Please log in to edit or add traveller details.");
//       return;
//     }

//     if (id) {
//       setIsEditing(true);
//       const fetchTraveler = async () => {
//         try {
//           const response = await axios.get(`http://localhost:3000/api/travelers/${id}`, {
//             headers: {
//               Authorization: `Bearer ${sessionId}`
//             }
//           });
//           console.log("GET Response:", response.status, response.data);
//           if (response.status === 200) {
//             const traveler = response.data.traveler;
//             setFormData({
//               prefix: traveler.prefix || "Mr",
//               first_name: traveler.first_name || "",
//               last_name: traveler.last_name || "",
//               gender: traveler.gender || "Male",
//               date_of_birth: traveler.date_of_birth || "",
//               nationality: traveler.nationality || "",
//               passport_number: traveler.passport_number || "",
//               passport_issuing_country: traveler.passport_issuing_country || "",
//               passport_issue_date: traveler.passport_issue_date || "",
//               passport_expiry_date: traveler.passport_expiry_date || "",
//               berth_preference: traveler.berth_preference || "",
//               food_preference: traveler.food_preference || "Veg"
//             });
//           }
//         } catch (error) {
//           console.error("API Error:", error.response?.status, error.response?.data || error.message);
//           setError(`Failed to fetch traveler with ID ${id}. ${error.response?.data?.error || 'Please ensure the traveler ID is correct and belongs to you.'}`);
//         }
//       };
//       fetchTraveler();
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     const sessionId = localStorage.getItem("sessionToken");
//     if (!sessionId) {
//       alert("Please log in to save traveller details.");
//       return;
//     }

//     if (!formData.first_name || !formData.last_name) {
//       alert("First name and last name are required.");
//       return;
//     }

//     try {
//       if (isEditing) {
//         const response = await axios.put(
//           `http://localhost:3000/api/travelers/${id}`,
//           {
//             first_name: formData.first_name,
//             last_name: formData.last_name,
//             prefix: formData.prefix
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${sessionId}`
//             }
//           }
//         );
//         console.log("PUT Response:", response.status, response.data);
//         if (response.status === 200) {
//           navigate("/masterdata");
//         }
//       } else {
//         const response = await axios.post(
//           "http://localhost:3000/api/travelers",
//           {
//             first_name: formData.first_name,
//             last_name: formData.last_name,
//             prefix: formData.prefix
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${sessionId}`
//             }
//           }
//         );
//         console.log("POST Response:", response.status, response.data);
//         if (response.status === 200 || response.status === 201) {
//           console.log("Navigating to /masterdata");
//           navigate("/masterdata");
//         }
//       }
//     } catch (error) {
//       console.error("API Error:", error.response?.status, error.response?.data || error.message);
//       const errorMessage = error.response?.data?.error || error.message;
//       if (error.response?.status === 400 && errorMessage === "Maximum limit of 5 travelers reached") {
//         setError("You have reached the maximum limit of 5 travelers. Please delete an existing traveler to add a new one.");
//       } else {
//         setError("Failed to save traveler: " + errorMessage);
//       }
//     }
//   };

//   if (error) {
//     return (
//       <div className="p-4 flex justify-center min-h-screen bg-gray-100">
//         <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg" style={{ maxWidth: "550px", width: "100%" }}>
//           <p className="text-red-500">{error}</p>
//           <button onClick={() => navigate("/masterdata")} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md">
//             Back to Travellers
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 flex justify-center min-h-screen bg-gray-100">
//       <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg" style={{ maxWidth: "550px", width: "100%" }}>
//         <div className="flex items-center justify-between bg-purple-800 text-white p-3 rounded-t-lg mb-6">
//           <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200">
//             ←
//           </button>
//           <h2 className="text-lg font-bold">{isEditing ? "Edit Traveller" : "Add Traveller"}</h2>
//           <span></span>
//         </div>
//         <div className="bg-yellow-100 text-yellow-800 p-3 mb-6 flex justify-between items-center rounded">
//           <span>Enter your name as mentioned on your Passport or Govt. ID proof</span>
//           <a href="#" className="text-orange-600 hover:text-orange-800 font-medium">
//             View Sample
//           </a>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Prefix
//           </label>
//           <select
//             name="prefix"
//             value={formData.prefix}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="Mr">Mr</option>
//             <option value="Mrs">Mrs</option>
//             <option value="Ms">Ms</option>
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             First Name
//           </label>
//           <input
//             type="text"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="Enter first name"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Last Name
//           </label>
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="Enter last name"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Gender
//           </label>
//           <div className="flex space-x-6">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="gender"
//                 value="Male"
//                 checked={formData.gender === "Male"}
//                 onChange={handleChange}
//                 className="mr-2 text-purple-600 focus:ring-purple-500"
//               />
//               Male
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="gender"
//                 value="Female"
//                 checked={formData.gender === "Female"}
//                 onChange={handleChange}
//                 className="mr-2 text-purple-600 focus:ring-purple-500"
//               />
//               Female
//             </label>
//           </div>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Date of Birth
//           </label>
//           <input
//             type="date"
//             name="date_of_birth"
//             value={formData.date_of_birth}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>
//         <div className="border-t border-gray-300 my-6"></div>
//         <div className="mb-4">
//           <h3 className="text-gray-700 text-sm font-semibold mb-2">
//             Optional Details
//           </h3>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Nationality
//           </label>
//           <select
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="">Select country</option>
//             <option value="India">India</option>
//             <option value="USA">USA</option>
//             <option value="UK">UK</option>
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Passport Number
//           </label>
//           <input
//             type="text"
//             name="passport_number"
//             value={formData.passport_number}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="Enter passport number"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Passport Issuing Country
//           </label>
//           <select
//             name="passport_issuing_country"
//             value={formData.passport_issuing_country}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="">Select country</option>
//             <option value="India">India</option>
//             <option value="USA">USA</option>
//             <option value="UK">UK</option>
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Passport Issue Date
//           </label>
//           <input
//             type="date"
//             name="passport_issue_date"
//             value={formData.passport_issue_date}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Passport Expiry Date
//           </label>
//           <input
//             type="date"
//             name="passport_expiry_date"
//             value={formData.passport_expiry_date}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>
//         <div className="border-t border-gray-300 my-6"></div>
//         <div className="mb-4">
//           <h3 className="text-gray-700 text-sm font-semibold mb-2">
//             Train Specific Options
//           </h3>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Berth Preference
//           </label>
//           <select
//             name="berth_preference"
//             value={formData.berth_preference}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="">Select Preference</option>
//             <option value="Lower">Lower</option>
//             <option value="Middle">Middle</option>
//             <option value="Upper">Upper</option>
//           </select>
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-semibold mb-2">
//             Food Preference
//           </label>
//           <div className="flex space-x-6">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="food_preference"
//                 value="Veg"
//                 checked={formData.food_preference === "Veg"}
//                 onChange={handleChange}
//                 className="mr-2 text-purple-600 focus:ring-purple-500"
//               />
//               Veg
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="food_preference"
//                 value="Non Veg"
//                 checked={formData.food_preference === "Non Veg"}
//                 onChange={handleChange}
//                 className="mr-2 text-purple-600 focus:ring-purple-500"
//               />
//               Non Veg
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="food_preference"
//                 value="No Food"
//                 checked={formData.food_preference === "No Food"}
//                 onChange={handleChange}
//                 className="mr-2 text-purple-600 focus:ring-purple-500"
//               />
//               No Food
//             </label>
//           </div>
//         </div>
//         <button
//           onClick={handleSave}
//           className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
//         >
//           {isEditing ? "Update" : "SAVE"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddTraveller;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddTraveller = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    prefix: "Mr",
    first_name: "",
    last_name: "",
    gender: "Male",
    date_of_birth: "",
    nationality: "",
    passport_number: "",
    passport_issuing_country: "",
    passport_issue_date: "",
    passport_expiry_date: "",
    berth_preference: "",
    food_preference: "Veg"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionToken");
    if (!sessionId) {
      alert("Please log in to edit or add traveller details.");
      return;
    }

    if (id) {
      setIsEditing(true);
      const fetchTraveler = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/travelers/${id}`, {
            headers: {
              Authorization: `Bearer ${sessionId}`
            }
          });
          console.log("GET Response:", response.status, response.data);
          if (response.status === 200) {
            const traveler = response.data.traveler;
            setFormData({
              prefix: traveler.prefix || "Mr",
              first_name: traveler.first_name || "",
              last_name: traveler.last_name || "",
              gender: traveler.gender || "Male",
              date_of_birth: traveler.date_of_birth || "",
              nationality: traveler.nationality || "",
              passport_number: traveler.passport_number || "",
              passport_issuing_country: traveler.passport_issuing_country || "",
              passport_issue_date: traveler.passport_issue_date || "",
              passport_expiry_date: traveler.passport_expiry_date || "",
              berth_preference: traveler.berth_preference || "",
              food_preference: traveler.food_preference || "Veg"
            });
          }
        } catch (error) {
          console.error("API Error:", error.response?.status, error.response?.data || error.message);
          setError(`Failed to fetch traveler with ID ${id}. ${error.response?.data?.error || 'Please ensure the traveler ID is correct and belongs to you.'}`);
        }
      };
      fetchTraveler();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const sessionId = localStorage.getItem("sessionToken");
    if (!sessionId) {
      alert("Please log in to save traveller details.");
      return;
    }

    if (!formData.first_name || !formData.last_name) {
      alert("First name and last name are required.");
      return;
    }

    try {
      if (isEditing) {
        const response = await axios.put(
          `http://localhost:3000/api/travelers/${id}`,
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            prefix: formData.prefix
          },
          {
            headers: {
              Authorization: `Bearer ${sessionId}`
            }
          }
        );
        console.log("PUT Response:", response.status, response.data);
        if (response.status === 200) {
          navigate("/masterdata");
        }
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/travelers",
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            prefix: formData.prefix
          },
          {
            headers: {
              Authorization: `Bearer ${sessionId}`
            }
          }
        );
        console.log("POST Response:", response.status, response.data);
        if (response.status === 200 || response.status === 201) {
          console.log("Navigating to /masterdata");
          navigate("/masterdata");
        }
      }
    } catch (error) {
      console.error("API Error:", error.response?.status, error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.message;
      if (error.response?.status === 400 && errorMessage === "Maximum limit of 5 travelers reached") {
        setError("You have reached the maximum limit of 5 travelers. Please delete an existing traveler to add a new one.");
      } else {
        setError("Failed to save traveler: " + errorMessage);
      }
    }
  };

  if (error) {
    return (
      <div className="p-4 flex justify-center min-h-screen bg-gray-100">
        <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg" style={{ maxWidth: "550px", width: "100%" }}>
          <p className="text-red-500">{error}</p>
          <button onClick={() => navigate("/masterdata")} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md">
            Back to Travellers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center min-h-screen bg-gray-100">
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg" style={{ maxWidth: "550px", width: "100%" }}>
        <div className="flex items-center justify-between bg-purple-800 text-white p-3 rounded-t-lg mb-6">
          <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200">
            ←
          </button>
          <h2 className="text-lg font-bold">{isEditing ? "Edit Traveller" : "Add Traveller"}</h2>
          <span></span>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-3 mb-6 flex justify-between items-center rounded">
          <span>Enter your name as mentioned on your Passport or Govt. ID proof</span>
          <a href="#" className="text-orange-600 hover:text-orange-800 font-medium">
            View Sample
          </a>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Prefix
          </label>
          <select
            name="prefix"
            value={formData.prefix}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter first name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter last name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Gender
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
                className="mr-2 text-purple-600 focus:ring-purple-500"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
                className="mr-2 text-purple-600 focus:ring-purple-500"
              />
              Female
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="border-t border-gray-300 my-6"></div>
        <div className="mb-4">
          <h3 className="text-gray-700 text-sm font-semibold mb-2">
            Optional Details
          </h3>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Nationality
          </label>
          <select
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Passport Number
          </label>
          <input
            type="text"
            name="passport_number"
            value={formData.passport_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter passport number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Passport Issuing Country
          </label>
          <select
            name="passport_issuing_country"
            value={formData.passport_issuing_country}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Passport Issue Date
          </label>
          <input
            type="date"
            name="passport_issue_date"
            value={formData.passport_issue_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Passport Expiry Date
          </label>
          <input
            type="date"
            name="passport_expiry_date"
            value={formData.passport_expiry_date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="border-t border-gray-300 my-6"></div>
        <div className="mb-4">
          <h3 className="text-gray-700 text-sm font-semibold mb-2">
            Train Specific Options
          </h3>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Berth Preference
          </label>
          <select
            name="berth_preference"
            value={formData.berth_preference}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Preference</option>
            <option value="Lower">Lower</option>
            <option value="Middle">Middle</option>
            <option value="Upper">Upper</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Food Preference
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="food_preference"
                value="Veg"
                checked={formData.food_preference === "Veg"}
                onChange={handleChange}
                className="mr-2 text-purple-600 focus:ring-purple-500"
              />
              Veg
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="food_preference"
                value="Non Veg"
                checked={formData.food_preference === "Non Veg"}
                onChange={handleChange}
                className="mr-2 text-purple-600 focus:ring-purple-500"
              />
              Non Veg
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="food_preference"
                value="No Food"
                checked={formData.food_preference === "No Food"}
                onChange={handleChange}
                className="mr-2 text-purple-600 focus:ring-purple-500"
              />
              No Food
            </label>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {isEditing ? "Update" : "SAVE"}
        </button>
      </div>
    </div>
  );
};

export default AddTraveller;