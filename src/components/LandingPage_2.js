import React, { useState } from "react";
import logo from "./logo.png";

// Assuming you have images in a folder named `images` inside the `src` directory.

function LandingPage_2() {
  const [isHovered, setIsHovered] = useState(false);
  function onEnter() {
    setIsHovered(true);
  }
  function onLeave() {
    setIsHovered(false);
  }

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen flex items-center justify-center">
      <div
        className="w-[1400px] h-[350px] mt-[-580px] flex"
        onMouseEnter={() => setTimeout(onEnter, 150)}
        onMouseLeave={() => setTimeout(onLeave, 200)}
      >
        {/* Content */}
        <div className="flex flex-col text-custom-blue space-y-8 w-2/3 p-8 bg-gray-800 shadow-lg mr-4 rounded-lg transition-transform duration-10000 ease-in-out transform hover:scale-105">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold font-mono">Who Are We</h1>
            <p className="text-lg font-mono">
              CURACHAIN: A decentralized healthcare platform empowering
              patients, doctors, and insurers with secure, transparent, and
              controlled access to medical records. Revolutionizing verification
              and data autonomy in healthcare."
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="w-1/3 relative overflow-hidden transition-transform duration-10000 ease-in-out transform hover:scale-105">
          <img
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-10000 ease-in-out"
            src={logo}
            alt="Landing page illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage_2;
