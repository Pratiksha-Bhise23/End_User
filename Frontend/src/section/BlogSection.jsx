
import React from 'react'
import { useState } from 'react'
import background from "../assets/background1.jpg"
import Button from '../components/Button'

const BlogSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  return (
    <>
     {/* last section */}
           <section
             className="relative w-[95%]  rounded-[20px] min-h-[50vh] overflow-hidden shadow-lg flex flex-col md:flex-row bg-cover bg-center mx-auto mb-8"
             style={{ backgroundImage: `url(${background})` }}
           >
     
             
             <div className="relative mt-30 w-full md:w-3/5 p-6 md:p-10 text-white bg-opacity-40">
               <h2 className="text-2xl md:text-3xl font-bold mb-2">
                 Yellowstone National Park - Wyoming, Montana, Idaho
               </h2>
               <p className="mb-4">
                 Yellowstone National Park is a nearly 3,500-sq.-mile wilderness recreation area atop a volcanic hot spot. Mostly in Wyoming, the park spreads into parts of Montana and Idaho too.
               </p>
               <div className="flex space-x-4">
                 <Button
                 variant="softBlue"
                 className="text-xs sm:text-sm"
                 selected={selectedIndex === 0}
                 onClick={() => setSelectedIndex(0)}>
                   <i className="fas fa-book-open mr-2"></i> Read Blog
                 </Button>
                 <Button variant="softBlue"
                 className="text-xs sm:text-sm"
                 selected={selectedIndex === 1}
                 onClick={() => setSelectedIndex(1)}>
                   <i className="fas fa-play mr-2"></i> Watch
                 </Button>
               </div>
             </div>
     
            
     
           <div className="w-full md:w-2/5 bg-white shadow-lg min-h-[40vh] rounded-[20px] p-6 mt-4 md:mt-0 md:absolute md:top-1/2 md:right-6 md:transform md:-translate-y-1/2">
             <h3 className="text-xl font-bold mb-4">
               Personalized Travel Packages for Every Adventurer
             </h3>
             <p className="text-gray-600 mb-4">
               Explore custom travel packages designed to bring every adventurer's dream journey to life, from serene escapes to exhilarating adventures.
             </p>
             <ul className="space-y-4">
               <li className="flex items-center">
                 <div className="w-10 h-10 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full mr-4">
                   <i className="fas fa-calendar-alt"></i>
                 </div>
                 <span className="text-gray-800">Flexible Itinerary Plan</span>
               </li>
               <li className="flex items-center">
                 <div className="w-10 h-10 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full mr-4">
                   <i className="fas fa-map-marker-alt"></i>
                 </div>
                 <span className="text-gray-800">Check-In Hub</span>
               </li>
               <li className="flex items-center">
                 <div className="w-10 h-10 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full mr-4">
                   <i className="fas fa-smile"></i>
                 </div>
                 <span className="text-gray-800">Adventure Guide</span>
               </li>
             </ul>
           </div>
     
           </section>
       
    </>
  )
}

export default BlogSection

