import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
// No need to import "./LandingPage.css" if you are using Tailwind CSS classes

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div>
        <NavBar></NavBar>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-800 font-mono">
      <div className="space-y-6 mt-[-50px] w-full max-w-xs mx-auto">
        <button
          className="bg-teal-500 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600" // Added transform and grey color for hover
          onClick={() => {
            navigate("/doctor_registration");
          }}
        >
          Doctor Registration
        </button>
        <button
          className="bg-teal-500 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600" // Added transform and grey color for hover
          onClick={() => {
            navigate("/patient_registration");
          }}
        >
          Patient Registration
        </button>
        <button
          className="bg-teal-500 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600" // Added transform and grey color for hover
          onClick={() => {
            navigate("/diagnostic_registration");
          }}
        >
          Diagnostics Registration
        </button>
      </div>
      </div>
      </div>
  );
};

export default RegisterPage;
