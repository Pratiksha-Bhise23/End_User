import React from "react";
import CardComponent from "../components/CardComponent";
import offer from "../assets/offer.jpg";

const Offers = () => {
  return (
    <div className="bg-white min-h-[40vh] p-6 sm:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div>
          <h2 className="text-sm font-semibold text-gray-500">BEST OFFER</h2>
          <h1 className="text-4xl font-semibold text-gray-900 leading-tight">
            Get Ready to Save Big on Your <br />
            Next Trip with Our Services
          </h1>
          <p className="text-gray-500 mt-4">
            We're excited to offer you exclusive services to help you save <br />
            on your next adventure. Whether you're planning a weekend getaway,
            <br />
            a family vacation, or a solo expedition.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl p-4  bg-transparent">
            <CardComponent
              image={offer}
              name="SAVE UP TO"
              offer="50%"
              destinations="Only for family package, it won’t last forever. Book now!"
              className="w-full h-[180px] rounded-lg object-cover "
            />
          </div>

          
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl  p-4  bg-transperent">
            <CardComponent
              image={offer}
              name="SAVE UP TO"
              offer="20%"
              destinations="On your next flight with this exclusive voucher!"
              className="w-full h-[180px] rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;


