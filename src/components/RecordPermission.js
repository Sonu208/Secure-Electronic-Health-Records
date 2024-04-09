// RecordPermission.js

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import recordABI from "../build/contracts/record.json";
import "../CSS/RecordPermission.css";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistryABI from "../build/contracts/PatientRegistry.json";

function RecordPermission() {
  const navigate = useNavigate();
  const { address } = useParams();
  const [web3, setWeb3] = useState(null);
  const [recordContractInstance, setRecordContractInstance] = useState(null);
  const [patientRegistryContractInstance, setPatientRegistryContractInstance] = useState(null);
  const [patientAddress, setPatientAddress] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [patientName, setPatientName] = useState(""); // Add state for patient name

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedRecordNetwork = recordABI.networks[networkId];
          const deployedPatientRegistryNetwork = PatientRegistryABI.networks[networkId]; // Use patient registry ABI
          
          const recordContract = new web3Instance.eth.Contract(
            recordABI.abi,
            deployedRecordNetwork && deployedRecordNetwork.address
          );

          const patientRegistryContract = new web3Instance.eth.Contract(
            PatientRegistryABI.abi,
            deployedPatientRegistryNetwork && deployedPatientRegistryNetwork.address
          );

          setRecordContractInstance(recordContract);
          setPatientRegistryContractInstance(patientRegistryContract);

          // Listen for the event emitted when a new patient is registered
          patientRegistryContractInstance.events.PatientRegistered({ fromBlock: 'latest' })
            .on('data', async (event) => {
              // Retrieve the patient's name from the event data
              const { patientAddress: registeredAddress, name } = event.returnValues;

              // Update the state with the patient's name
              if (registeredAddress.toLowerCase() === patientAddress.toLowerCase()) {
                setPatientName(name);
              }
            })
            .on('error', (error) => {
              console.error("Error listening for PatientRegistered event:", error);
            });
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, [patientAddress, patientRegistryContractInstance]); // Add patientAddress and patientRegistryContractInstance to the dependency array

  const grantPermission = async () => {
    try {
      setIsLoading(true);
      await recordContractInstance.methods
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
      await recordContractInstance.methods
        .revokePermission(doctorAddress)
        .send({ from: patientAddress });
      setPermissionGranted(false);
    } catch (error) {
      console.error("Error revoking permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOperation = async () => {
    try {
      navigate("/patient/" + address);
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex items-center justify-center p-4 font-mono text-white">
        <div className="w-full max-w-6xl bg-gray-900 p-20 rounded-lg shadow-lg">
          <h1 className="text-3xl mb-6 font-bold text-center">Record Permission</h1>
          <div className="flex flex-col w-full mb-4">
            <label className="mb-2 font-bold">Patient Address:</label>
            <input
              type="text"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
            <button
              className="px-4 py-2 mt-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition duration-200"
            >
              Fetch Name
            </button>
            <p className="mt-2 text-gray-400">{patientName}</p>
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
              disabled={!recordContractInstance || isLoading}
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
            <button
              onClick={cancelOperation}
              className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordPermission;
