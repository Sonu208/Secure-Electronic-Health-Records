import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json"; // Update import path
import { useNavigate } from "react-router-dom";
import "../CSS/DiagnosticLogin.css"; // Update CSS import path
import NavBar from "./NavBar";

const DiagnosticLogin = () => {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [diagnosticAddress, setDiagnosticAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DiagnosticRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DiagnosticRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // Validate diagnostic center's password
      const isValidPassword = await contract.methods
        .validateDiagnosticPassword(diagnosticAddress, password)
        .call();

      if (!isValidPassword) {
        alert("Incorrect password");
        return;
      }

      // Check if diagnostic center is registered
      const isRegistered = await contract.methods
        .isRegisteredDiagnostic(diagnosticAddress)
        .call();

      if (!isRegistered) {
        alert("Diagnostic center not registered");
        return;
      }

      // If password is valid and diagnostic center is registered, proceed with login
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("Error checking registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
        <div className="w-full max-w-4xl bg-gray-900 p-20 rounded-lg shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Diagnostic Center Login</h2>
          <div className="flex flex-col w-full mb-4">
            <label className="mb-2 font-bold">Diagnostic Center Address:</label>
            <input
              type="text"
              value={diagnosticAddress}
              onChange={(e) => setDiagnosticAddress(e.target.value)}
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
            onClick={handleLogin}
            disabled={!contract || isLoading}
            className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticLogin;