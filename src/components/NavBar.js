import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo_new.jpg";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white h-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-0">
          {/* Logo */}
          <div className="shrink-0">
            <img
              className="h-16 w-auto my-[17px]"
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Title */}
          <div className="mt-4 sm:mt-0 sm:ml-10 text-center">
            <span
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold cursor-pointer"
              onClick={() => navigate("/")}
            >
              Secure Electronic Health Records
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4 sm:mt-0">
            <button
              className="text-lg px-3 py-1.5 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
              className="text-lg px-3 py-1.5 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={() => navigate("/AboutPage")}
            >
              About Us
            </button>
            <button
              className="text-lg px-3 py-1.5 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              className="text-lg px-3 py-1.5 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
