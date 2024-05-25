import React, { useState, useEffect } from "react";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PatientWritePermission.css";
import "../big_css/CreateEHR.css";
import NavBar_Logout from "./NavBar_Logout";

const ViewDiagnosticProfile = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [diagnosticDetails, setDiagnosticDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosticDetails = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DiagnosticRegistration.networks[networkId];
          const contract = new web3Instance.eth.Contract(
            DiagnosticRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const result = await contract.methods.getDiagnosticDetails(hhNumber).call();
          setDiagnosticDetails(result);
        } else {
          setError("Please install MetaMask extension");
        }
      } catch (error) {
        console.error('Error retrieving diagnostic details:', error);
        setError('Error retrieving diagnostic details');
      }
    };

    fetchDiagnosticDetails();
  }, [hhNumber]);

  const cancelOperation = async () => {
    try {
      navigate("/diagnostic/" + hhNumber);
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
            Diagnostic's Profile
          </h1>
          {diagnosticDetails && (
            <div>
              <center>
                <p className="text-xl sm:text-2xl mb-2">
                  Diagnostic Center Name : <span className="font-bold text-yellow-500">{diagnosticDetails[1]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Hospital Name : <span className="font-bold text-yellow-500">{diagnosticDetails[2]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Location : <span className="font-bold text-yellow-500">{diagnosticDetails[3]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Email-Id : <span className="font-bold text-yellow-500">{diagnosticDetails[4]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  HH Number : <span className="font-bold text-yellow-500">{hhNumber}</span>
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

export default ViewDiagnosticProfile;
