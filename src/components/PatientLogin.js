import React, { useState } from "react";
import Web3 from "web3";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorLoginPage.css";
import NavBar from "./NavBar";

const PatientLogin = () => {
  const navigate = useNavigate();
  const [hhNumberError, sethhNumberError] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [doctorDetails, setPatientDetails] = useState(null);

  const handlehhNumberChange = (e) => {
    const inputhhNumber = e.target.value;
    const phoneRegex = /^\d{6}$/;
    if (phoneRegex.test(inputhhNumber)) {
      sethhNumber(inputhhNumber);
      sethhNumberError("");
    } else {
      sethhNumber(inputhhNumber);
      sethhNumberError("Please enter a 6-digit HH Number.");
    }
  };

  const handleCheckRegistration = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[networkId];
      const contract = new web3.eth.Contract(
        PatientRegistration.abi,
        deployedNetwork && deployedNetwork.address
      );

      const isRegisteredResult = await contract.methods
        .isRegisteredPatient(hhNumber)
        .call();
      setIsRegistered(isRegisteredResult);

      if (isRegisteredResult) {
        const isValidPassword = await contract.methods
          .validatePassword(hhNumber, password)
          .call();

        if (isValidPassword) {
          const doctor = await contract.methods
            .getPatientDetails(hhNumber)
            .call();
          setPatientDetails(doctor);
          navigate("/patient/" + hhNumber);
        } else {
          alert("Incorrect password");
        }
      } else {
        alert("Patient not registered");
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("An error occurred while checking registration.");
    }
  };

  const cancelOperation = () => {
    navigate("/");
  };

  return (
    <div>
      <NavBar />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
        <div className="w-full max-w-4xl bg-gray-900 p-20 rounded-lg shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Patient Login</h2>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="hhNumber">
              HH Number
            </label>
            <input
              id="hhNumber"
              name="hhNumber"
              type="text"
              required
              className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${hhNumberError && "border-red-500"}`}
              placeholder="HH Number"
              value={hhNumber}
              onChange={handlehhNumberChange}
            />
            {hhNumberError && (
              <p className="text-red-500 text-sm mt-1">{hhNumberError}</p>
            )}
          </div>

          <div className="flex flex-col w-full mb-4">
            <label className="mb-2 font-bold">Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              required
            />
          </div>
          <div className="space-x-4 text-center mt-6">
          <button
            onClick={handleCheckRegistration}
            className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
          >
            Login
            </button>
            <button
              onClick={cancelOperation}
              className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
              >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
