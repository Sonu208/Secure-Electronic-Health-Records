import PatientRegistry from "../build/contracts/PatientRegistry.json";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorLoginPage.css"; // Import the same CSS file used for DoctorLoginPage

const PatientLogin = () => {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
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
          const deployedNetwork = PatientRegistry.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistry.abi,
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
      const result = await contract.methods
        .isRegisteredPatient(walletAddress)
        .call();
      if (!result) {
        alert("Patient not registered");
        return;
      }
      console.log(walletAddress);
      setIsLoggedIn(result);
      navigate("/patient/" + walletAddress);
    } catch (error) {
      console.error("Error checking registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <div className="w-full max-w-4xl bg-gray-900 p-20 rounded-lg shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Patient Login</h2>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Wallet Address:</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
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
  );
};

export default PatientLogin;
