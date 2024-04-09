import React, { useState, useEffect } from "react";
import Web3 from "web3";
import record from "../build/contracts/record.json"; // Replace with the correct path to your ABI JSON
import { useParams, useNavigate } from "react-router-dom";
import "../big_css/DoctorPermission.css";
import NavBar_Logout from "./NavBar_Logout";


function DoctorPermission() {
  const { address } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientAddress, setPatientAddress] = useState("");
  const [doctorAddress, setDoctorAddress] = useState(address);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = record.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            record.abi,
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

  const checkPermission = async () => {
    try {
      setIsLoading(true);
      const isAuthorized = await contract.methods
        .canViewRecord(patientAddress, doctorAddress)
        .call({ from: doctorAddress });
      setIsAuthorized(isAuthorized);

      if (isAuthorized) {
        navigate("/doctor/" + doctorAddress + "/viewrec/" + patientAddress);
      } else {
        alert("Not Authorized");
        return;
      }
    } catch (error) {
      console.error("Error checking permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOperation = async () => {
    try {
    navigate("/doctor/"+doctorAddress);
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  console.log(doctorAddress);
  return (
    <div>
    <NavBar_Logout></NavBar_Logout>
    <div className="backgroundImage bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <div className="w-full max-w-4xl bg-gray-900 p-20 rounded-lg shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Doctor Permission
        </h2>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Patient Address:</label>
          <input
            type="text"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            required
          />
        </div>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Doctor Address:</label>
          <input
            type="text"
            value={address}
            readOnly
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md"
          />
        </div>
        <button
          onClick={checkPermission}
          disabled={!contract || isLoading}
          className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
        >
          Check Permission
          </button>
          &emsp;
          <button
          onClick={cancelOperation}
          className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
        >
          Cancel
        </button>
      </div>
      </div>
      </div>
  );
}

export default DoctorPermission;
