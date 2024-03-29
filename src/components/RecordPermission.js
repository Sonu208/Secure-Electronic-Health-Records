import React, { useState, useEffect } from "react";
import Web3 from "web3";
import record from "../build/contracts/record.json"; // Replace with the correct path to your ABI JSON
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import "../CSS/RecordPermission.css";
import { useParams } from "react-router-dom";

function RecordPermission() {
  const { address } = useParams();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractInstance2, setContractInstance2] = useState(null);
  const [patientAddress, setPatientAddress] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = record.networks[networkId];
          const deployedNetwork2 = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            record.abi,
            deployedNetwork && deployedNetwork.address
          );

          const contractInstance2 = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork2 && deployedNetwork2.address
          );

          setContract(contractInstance);
          setContractInstance2(contractInstance2);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  const grantPermission = async () => {
    try {
      setIsLoading(true);
      await contract.methods
        .grantPermission(doctorAddress)
        .send({ from: patientAddress });
      setPermissionGranted(true);
    } catch (error) {
      console.error("Error granting permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const revokePermission = async () => {
    try {
      setIsLoading(true);
      await contract.methods
        .revokePermission(doctorAddress)
        .send({ from: patientAddress });
      setPermissionGranted(false);
    } catch (error) {
      console.error("Error revoking permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex items-center justify-center p-4 font-mono text-white">
      <div className="w-full max-w-6xl bg-gray-900 p-20 rounded-lg shadow-lg">
        <h1 className="text-3xl mb-6 font-bold text-center">
          Record Permission
        </h1>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Patient Address:</label>
          <input
            type="text"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
          />
        </div>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Doctor Address:</label>
          <input
            type="text"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={grantPermission}
            disabled={!contract || isLoading}
            className="px-5 py-2.5 bg-green-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
          >
            Grant Permission
          </button>
          <button
            onClick={revokePermission}
            className="px-5 py-2.5 bg-red-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
          >
            Revoke Permission
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecordPermission;
