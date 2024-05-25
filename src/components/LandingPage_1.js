import React, { useState } from "react";
import NavBar from "./NavBar";

// Assuming you have images in a folder named `images` inside the `src` directory.
import lp_11 from "./lp_11.png";
import lp_10 from "./lp_10.png";
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
        <NavBar></NavBar>
      <div className="bg-gray-900 text-white font-sans min-h-screen flex items-center justify-center">
        <div
          className="w-[1400px] h-[450px] mt-[-180px] flex"
          onMouseEnter={() => setTimeout(onEnter, 500)}
          onMouseHover={() => setTimeout(onLeave, 700)}
          onMouseLeave={() => setTimeout(onLeave, 600)}

        >
          {/* Image */}
          <div className="flex-grow relative overflow-hidden transition-transform duration-10000 ease-in-out transform hover:scale-105">
          <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-10000 ease-in-out ${
                !isHovered ? "opacity-100" : "opacity-0"
              }`}
              src={lp_10}
              alt="Landing page illustration"
            />
            <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-10000 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              src={lp_12}
              alt="Landing page illustration"
            />
             <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-10000 ease-in-out ${
                !isHovered ? "opacity-100" : "opacity-0"
              }`}
              src={lp_11}
              alt="Landing page illustration"
            />
            
          </div>

          {/* Content */}
          <div className="flex flex-col text-custom-blue space-y-8 w-2/5 p-8 bg-gray-800 shadow-lg ml-4 rounded-lg transition-transform duration-10000 ease-in-out transform hover:scale-105">
            <div className="space-y-4">
              <p className="text-lg font-mono">
              The Secure Electronic Health Records App is revolutionizing EHR management by leveraging blockchain technology. Utilizing key components such as blockchain for secure and transparent data storage, Ganache for rapid development, Metamask for seamless blockchain interaction, and IPFS desktop for decentralized file storage, It ensures enhanced security, improved accessibility, data interoperability, and trust. By adopting this innovative approach, It aims to transform healthcare data management, leading to better patient outcomes and improved healthcare delivery.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;