import React, { useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorLoginPage.css";
import NavBar from "./NavBar";

const DoctorLoginPage = () => {
  const navigate = useNavigate();
  const [doctorAddress, setDoctorAddress] = useState("");
  const [password, setPassword] = useState(""); // State for password
  const [isRegistered, setIsRegistered] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);

  const handleCheckRegistration = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        DoctorRegistration.abi,
        DoctorRegistration.networks[networkId].address
      );

      const isRegisteredResult = await contract.methods
        .isRegisteredDoctor(doctorAddress)
        .call();
      setIsRegistered(isRegisteredResult);

      if (isRegisteredResult) {
        // Check password here
        const isValidPassword = await contract.methods
          .validateDoctorPassword(doctorAddress, password)
          .call();

        if (isValidPassword) {
          const doctor = await contract.methods
            .getDoctorDetails(doctorAddress)
            .call();
          setDoctorDetails(doctor);
          navigate("/doctor/" + doctorAddress);
        } else {
          alert("Incorrect password");
        }
      } else {
        alert("Doctor not registered");
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("An error occurred while checking registration.");
    }
  };

  return (
    <div>
    <NavBar></NavBar>
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <div className="w-full max-w-4xl bg-gray-900 p-20 rounded-lg shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Doctor Login</h2>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Doctor Address:</label>
          <input
            type="text"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            required
          />
        </div>
        {/* Password input field */}
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            required
          />
        </div>
        <button
          onClick={handleCheckRegistration}
          className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
        >
          Login
        </button>
      </div>
      </div>
      </div>
  );
};

export default DoctorLoginPage;
