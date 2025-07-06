
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import Button from "../components/Button";

const Masterdata = () => {
  const navigate = useNavigate();
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionToken");
    if (!sessionId) {
      alert("Please log in to view travellers.");
      setLoading(false);
      return;
    }

    const fetchTravelers = async () => {
      try {
        const response = await axios.get("https://end-user.onrender.com/api/travelers", {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        });
        console.log("API Response:", response.status, response.data);
        if (response.status === 200) {
          setTravelers(response.data.travelers || []);
        } else {
          setError("Unexpected response status: " + response.status);
        }
      } catch (error) {
        console.error("API Error:", error.response?.status, error.response?.data || error.message);
        setError("Failed to fetch travellers: " + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchTravelers();
  }, []);

  const handleAddTraveller = () => {
    navigate("/add-traveller");
  };

  const handleDeleteTraveler = async (id) => {
    const sessionId = localStorage.getItem("sessionToken");
    if (!sessionId) {
      alert("Please log in to delete a traveller.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this traveller?")) {
      try {
        const response = await axios.delete(`https://end-user.onrender.com/api/travelers/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        });
        if (response.status === 200) {
          setTravelers(travelers.filter((traveler) => traveler.id !== id));
          alert("Traveller deleted successfully");
        }
      } catch (error) {
        alert("Failed to delete traveller: " + error.message);
      }
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-500 text-sm sm:text-base">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-red-500 text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-[700px] sm:max-w-3xl">
        <div className="flex items-center justify-between rounded-t-lg bg-purple-800 p-3 text-white sm:p-4">
          <Button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-200 text-lg sm:text-xl"
          >
            ←
          </Button>
          <h2 className="text-lg font-bold sm:text-xl">Travellers</h2>
          <span className="w-6 sm:w-8"></span>
        </div>
        <Button
          onClick={handleAddTraveller}
          className="my-4 flex w-full items-center justify-center space-x-2 rounded-md bg-none px-4 py-2 text-orange-600 transition duration-200 hover:text-orange-800 sm:w-auto sm:px-6 sm:py-3"
        >
          <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-sm sm:text-base">Add New Traveller</span>
        </Button>
        <div className="rounded-b-lg border border-gray-300 bg-white p-4 sm:p-6">
          {travelers.length === 0 ? (
            <p className="py-4 text-center text-gray-500 text-sm sm:text-base">
              No travellers found.
            </p>
          ) : (
            travelers.map((traveler) => (
              <div
                key={traveler.id}
                className="mb-3 flex items-center rounded-md bg-white p-3 shadow-sm transition duration-200 hover:bg-gray-50 sm:p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 sm:h-12 sm:w-12">
                  {/* Placeholder for avatar */}
                </div>
  


                <span className="ml-3 flex-1 text-sm sm:text-base">
                  {traveler.prefix} {traveler.first_name} {traveler.last_name}
                </span>
                <Button
                  onClick={() => navigate(`/add-traveller/${traveler.id}`)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <Edit className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Button
                  onClick={() => handleDeleteTraveler(traveler.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>
            ))
          )}
        </div>
        <Button
          onClick={handleBackToHome}
          className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-200 hover:bg-indigo-700 sm:w-auto sm:px-6 sm:py-3"
        >
          <span className="text-sm sm:text-base">Back to Home</span>
        </Button>
      </div>
    </div>
  );
};

export default Masterdata;