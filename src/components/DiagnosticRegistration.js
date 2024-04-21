import React, { useState } from "react";
import Web3 from "web3";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json"; // Update import path
import { useNavigate } from "react-router-dom";
import "../CSS/DiagnosticRegistration.css"; // Update CSS import path
import NavBar from "./NavBar";

const DiagnosticRegistrationForm = () => {
  const [diagnosticAddress, setDiagnosticAddress] = useState(""); // Update state variable name
  const [diagnosticCenterName, setDiagnosticCenterName] = useState(""); // Update state variable name
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState(""); // Define password state variable

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!diagnosticAddress || !diagnosticCenterName || !phoneNumber || !address || !password) { // Update field names
      alert("You have missing input fields. Please fill in all the required fields.");
      return;
    }

    if (phoneNumber.length !== 10) {
      alert("You have entered a wrong phone number. Please enter a 10-digit phone number.");
      return;
    }

    // Password validation: minimum length
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      const contract = new web3.eth.Contract(
        DiagnosticRegistration.abi,
        DiagnosticRegistration.networks[networkId].address
      );

      const isRegDiagnostic = await contract.methods
        .isRegisteredDiagnostic(diagnosticAddress)
        .call();

      if (isRegDiagnostic) {
        alert("Diagnostic center already exists");
        return;
      }

      await contract.methods
        .registerDiagnostic(
          diagnosticAddress,
          diagnosticCenterName,
          phoneNumber,
          address,
          password
        )
        .send({ from: diagnosticAddress });

      alert("Diagnostic center registered successfully!");
      navigate("/diagnostic_login");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the diagnostic center.");
    }
  };

  const handlePhoneNumberChange = (e) => {
    const inputPhoneNumber = e.target.value;
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(inputPhoneNumber)) {
      setPhoneNumber(inputPhoneNumber);
    } else {
      setPhoneNumber(inputPhoneNumber);
      alert("Please enter a 10-digit phone number.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="createehr min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
        <div className="w-full max-w-2xl">
          <h2 className="text-3xl text-white mb-6 font-bold text-center">
            Diagnostic Registration
          </h2>
          <form className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="diagnosticAddress"
              >
                Diagnostic Center's Wallet Public Address:
              </label>
              <input
                id="diagnosticAddress"
                name="diagnosticAddress"
                type="text"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
                placeholder="Public Address"
                value={diagnosticAddress}
                onChange={(e) => setDiagnosticAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="diagnosticCenterName"
              >
                Diagnostic Center Name:
              </label>
              <input
                id="diagnosticCenterName"
                name="diagnosticCenterName"
                type="text"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
                placeholder="Diagnostic Center Name"
                value={diagnosticCenterName}
                onChange={(e) => setDiagnosticCenterName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="phoneNumber"
              >
                Phone Number:
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="address"
              >
                Address:
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={handleRegister}
              className="py-3 px-4 bg-teal-500 text-white rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Register Diagnostic Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticRegistrationForm;