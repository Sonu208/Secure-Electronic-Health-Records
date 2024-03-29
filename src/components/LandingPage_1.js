import React, { useState } from "react";
import LandingPage_2 from "./LandingPage_2";

// Assuming you have images in a folder named `images` inside the `src` directory.
import lp_13 from "./lp_13.png";
import lp_12 from "./lp_12.png";

function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  function onEnter() {
    setIsHovered(true);
  }
  function onLeave() {
    setIsHovered(false);
  }

  return (
    <div>
      <div className="bg-gray-900 text-white font-sans min-h-screen flex items-center justify-center">
        <div
          className="w-[1400px] h-[450px] mt-[-180px] flex"
          onMouseEnter={() => setTimeout(onEnter, 150)}
          onMouseLeave={() => setTimeout(onLeave, 200)}
        >
          {/* Image */}
          <div className="flex-grow relative overflow-hidden transition-transform duration-10000 ease-in-out transform hover:scale-105">
            <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-10000 ease-in-out ${
                !isHovered ? "opacity-100" : "opacity-0"
              }`}
              src={lp_12}
              alt="Landing page illustration"
            />
            <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-10000 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              src={lp_13}
              alt="Landing page illustration"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col text-custom-blue space-y-8 w-2/5 p-8 bg-gray-800 shadow-lg ml-4 rounded-lg transition-transform duration-10000 ease-in-out transform hover:scale-105">
            <div className="space-y-4">
              <p className="text-lg font-mono">
                Secure Accessible Patient is a pioneering project revolutionizing Electronic Health Records (EHR) through blockchain technology.
                Key components include blockchain for secure, transparent data storage, Ganache for rapid development, Metamask for seamless blockchain interaction, and Pinata for decentralized file storage. SAP ensures enhanced security, improved accessibility, data interoperability, and trust through its innovative approach.
                Ultimately, SAP aims to transform healthcare data management, fostering better patient outcomes and healthcare delivery.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
