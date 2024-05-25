import React, { useState, useEffect } from "react";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PatientWritePermission.css";
import "../big_css/CreateEHR.css";
import NavBar_Logout from "./NavBar_Logout";


const ViewProfile = () => {
  const { hhNumber } = useParams(); // Retrieve the hhNumber from the URL parameter
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Check if Web3 is injected by MetaMask or any other provider
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Get the contract instance
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(contractInstance);
        if (!contract) return;

        try {
          // Call the getPatientDetails function of the smart contract
          const result = await contract.methods.getPatientDetails(hhNumber).call();
          setPatientDetails(result);
        } catch (error) {
          console.error('Error retrieving patient details:', error);
          setError('Error retrieving patient details');
        }
      } else {
        console.log('Please install MetaMask extension');
        setError('Please install MetaMask extension');
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!contract || !hhNumber) return;

      try {
        // Call the getPatientDetails function of the smart contract
        const result = await contract.methods.getPatientDetails(hhNumber).call();
        setPatientDetails(result);
      } catch (error) {
        console.error('Error retrieving patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [contract, hhNumber]);


  const cancelOperation = async () => {
    try {
    navigate("/patient/"+hhNumber);
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };
  
  return (
    <div>
    <NavBar_Logout></NavBar_Logout>
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white flex flex-col justify-center items-center">
        <div className="h-full max-w-8xl bg-gray-700 p-24 rounded-lg shadow-lg flex flex-col justify-center items-center">

        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Profile
        </h1>
        {patientDetails && (
            <div>
              <center>
          <p className="text-xl sm:text-2xl mb-3">
            Name : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.name}</span>
          </p>
          <p className="text-xl sm:text-2xl mb-3">
            DOB : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.dateOfBirth}</span>
          </p>
          <p className="text-xl sm:text-2xl mb-3">
            Gender : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.gender}</span>
          </p>    
          <p className="text-xl sm:text-2xl mb-6">
            Blood Group : {" "}
          <span className="font-bold text-yellow-500">{patientDetails.bloodGroup}</span>
          </p>
          <p className="text-xl sm:text-2xl mb-3">
            Address : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.homeAddress}</span>
          </p>
          <p className="text-xl sm:text-2xl mb-3">
            Email-Id : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.email}</span>
          </p>
          </center>
        </div>
        )}
          <div className="col-span-full">
            <button
              onClick={cancelOperation}
              className="px-5 py-2.5 bg-custom-teal text-white font-bold text-lg rounded-lg cursor-pointer mt-3 mr-5 transition-transform transition-background-color duration-300 ease-in hover:bg-gray-400 transform hover:scale-105"
            >
              Close
            </button>     
            </div>
        </div>
      </div>
      </div>
  );
};

export default ViewProfile;
