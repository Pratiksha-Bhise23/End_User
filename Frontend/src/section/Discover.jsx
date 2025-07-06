
import React from 'react'
import { useState } from 'react';
import Card from "../components/Card";
import Button from '../components/Button'


const destinations = [
    {
      name: "Aurangabad Maharashtra",
      location: "Maharashtra, India",
      rating: "4.5/5 (2,312 Reviews)",
      price: "₹12,900",
      image: "https://storage.googleapis.com/a1aa/image/GkLhJoPG8pWFV3HHAlOVIVtwOXVBjGAy6pAj98iwZqg.jpg",
    },
    {
      name: "River Wonders Singapore",
      location: "Singapore",
      rating: "4.9/5 (5,431 Reviews)",
      price: "₹570,000",
      image: "https://storage.googleapis.com/a1aa/image/K9Xw0BxuMzsFOPfjWwSa-yh5JiyYisKYnm3UQkdfEAI.jpg",
    },
    {
      name: "The Amazing Taman Safari",
      location: "Bali, Indonesia",
      rating: "4.6/5 (3,910 Reviews)",
      price: "₹300,004",
      image: "https://storage.googleapis.com/a1aa/image/yy21gdGp5INQ47EHvJM0ZSwzp6nrxeVN967nvVaPfJc.jpg",
    },
    {
      name: "Uluwatu Kecak & Fire Dance",
      location: "Bali, Indonesia",
      rating: "4.9/5 (10,322 Reviews)",
      price: "₹100,009",
      image: "https://storage.googleapis.com/a1aa/image/6pa2hNuAEAoeN90U784645tXO-NGxJqEENeCRvOG6rI.jpg",
    },
    {
      name: "Eiffel Tower",
      location: "Paris, France",
      rating: "4.8/5 (15,200 Reviews)",
      price: "₹150,000",
      image: "https://storage.googleapis.com/a1aa/image/GkLhJoPG8pWFV3HHAlOVIVtwOXVBjGAy6pAj98iwZqg.jpg",
    },
    {
      name: "Great Wall of China",
      location: "Beijing, China",
      rating: "4.7/5 (9,800 Reviews)",
      price: "₹90,000",
      image: "https://storage.googleapis.com/a1aa/image/K9Xw0BxuMzsFOPfjWwSa-yh5JiyYisKYnm3UQkdfEAI.jpg",
    },
  ];
  
const Discover = () => {
const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <>
      <div className="bg-white min-h-[80vh] md:min-h-[60vh] p-4 sm:p-8">
            <div className="container mx-auto text-center px-4">
              <h2 className="text-gray-500 text-sm">DISCOVER</h2>
              <h1 className="text-3xl sm:text-4xl font-semibold mt-2">
                Find Popular Destination on Multify!
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Explore our curated list of trending destinations that are capturing the hearts of travelers worldwide
              </p>
            </div>
      
            <div className="flex flex-wrap justify-center mt-6 gap-2">
              {[
                "Trending",
                "5-Star",
                "Asian",
                "Europe",
                "Middle-East",
                "Budget-Friendly",
                "Adventure",
                "Family-Friendly",
              ].map((category, index) => (
                <Button
                  key={index}
                  variant="pill"
                  selected={selectedIndex === index} 
                  className="text-xs sm:text-sm"
                  onClick={() => setSelectedIndex(index)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="overflow-x-auto scrollbar-hide mt-8 px-4">
         <div className="flex space-x-20 w-[calc(4*250px)] sm:w-[calc(4*250px)] lg:w-[calc(4*250px)]">
            {destinations.map((destination, index) => (
                <div key={index} className="inline-block min-w-[250px] sm:min-w-[250px] lg:min-w-[250px]">
                    <Card 
                        name={destination.name}
                        location={destination.location}
                        rating={destination.rating}
                        price={destination.price}
                        image={destination.image}
                    />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </>
  )
}

export default Discover;




