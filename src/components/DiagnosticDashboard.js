import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import Web3 from "web3";
import record2ABI from "../build/contracts/record2.json";
import patientRegistryABI from "../build/contracts/PatientRegistry.json";

const DiagnosticDashboard = () => {
  const { address } = useParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [recordContractInstance, setRecordContractInstance] = useState(null);
  const [patientRegistryContractInstance, setPatientRegistryContractInstance] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const networkId = await web3Instance.eth.net.getId();
          const deployedRecordNetwork = record2ABI.networks[networkId];
          const deployedPatientRegistryNetwork = patientRegistryABI.networks[networkId];
          
          const recordContract = new web3Instance.eth.Contract(
            record2ABI.abi,
            deployedRecordNetwork && deployedRecordNetwork.address
          );

          const patientRegistryContract = new web3Instance.eth.Contract(
            patientRegistryABI.abi,
            deployedPatientRegistryNetwork && deployedPatientRegistryNetwork.address
          );

          setRecordContractInstance(recordContract);
          setPatientRegistryContractInstance(patientRegistryContract);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (!recordContractInstance || !patientRegistryContractInstance) return;
    
        const patientAddresses = await recordContractInstance.methods.getRecords().call();
        console.log("Patient Addresses:", patientAddresses);
    
        const patientNames = await Promise.all(patientAddresses.map(async (patientAddress) => {
          const patientDetails = await patientRegistryContractInstance.methods.patients(patientAddress).call();
          const name = patientDetails[0]; // Access the name from the returned array
          console.log("Patient Name:", name);
          return { address: patientAddress, name }; // Update the structure of the object
        }));
        
        setPatients(patientNames);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
  
    fetchPatients();
  }, [recordContractInstance, patientRegistryContractInstance]);

  const handleClick = () => {
  navigate("/diagnostic/" + address + "/createehr2");
  };


  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Diagnostic Dashboard</h2>
        <p className="text-xl sm:text-2xl mb-4">
          Hello, diagnostic doctor :{" "}
          <span className="font-bold text-yellow-500">{address}</span>
        </p>
        <div className="space-y-4 space-x-4">
          <button
            onClick={handleClick}
            className="px-6 py-3 bg-teal-500 hover:bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
          >
            Create Report
          </button>
        </div>
        {/* <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Patient List:</h3>
          /* <ul>
          {patients.map((patient) => (
  <li key={patient.address} className="text-lg">
    {patient.name}
  </li>
            ))}
          </ul> 
        </div> */}
      </div>
    </div>
  );
};

export default DiagnosticDashboard;