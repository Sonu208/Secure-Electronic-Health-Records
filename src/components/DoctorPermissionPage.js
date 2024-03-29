import React, { useState } from "react";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import PatientRegistry from "../build/contracts/PatientRegistry.json";
import "../CSS/DoctorPermissionPage.css";

const DoctorPermissionPage = () => {
  const navigate = useNavigate();
  const address = useParams();
  const [patientAddress, setPatientAddress] = useState("");
  const [hasPermission, setHasPermission] = useState(false);

  const handleCheckPermission = async () => {
    try {
      const web3Instance = new Web3(window.ethereum);
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = PatientRegistry.networks[networkId];
      const contract = new web3Instance.eth.Contract(
        PatientRegistry.abi,
        deployedNetwork && deployedNetwork.address
      );
      const doctorAddress = address.address;
      const permission = await contract.methods
        .haspermission(patientAddress, doctorAddress)
        .call({ from: patientAddress });
      setHasPermission(permission);
      if (permission) {
        navigate("/doctor/" + doctorAddress + "/createehr");
      } else {
        alert("You don't have permission to create a health record.");
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      alert("An error occurred while checking permission.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <div className="w-full max-w-6xl bg-gray-900 p-20 rounded-lg shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Doctor Permission Page
        </h2>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Patient Address:</label>
          <input
            type="text"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
          />
        </div>
        <button
          onClick={handleCheckPermission}
          className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-200 ease-in hover:bg-gray-600 active:bg-gray-700"
        >
          Check Permission
        </button>
        {hasPermission ? (
          <p className="mt-4">
            You have permission to create a health record. Navigating...
          </p>
        ) : (
          <p className="mt-4">
            You don't have permission to create a health record.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorPermissionPage;
