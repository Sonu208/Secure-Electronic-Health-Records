import React, { useEffect, useState } from "react";
import Web3 from "web3";
import UploadEhr from "../build/contracts/UploadEhr.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/ContractInteraction.css";
import axios from "axios";
import NavBar_Logout from "./NavBar_Logout";

function ViewPatientRecords() {
  const navigate = useNavigate();
  const { phoneNumber } = useParams();
  const [web3, setWeb3] = useState(null);
  const [records, setRecords] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];
          const patientContract = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork && deployedNetwork.address,
          );

          const result = await patientContract.methods.getPatientDetails(phoneNumber).call();
          setPatientDetails(result);
        } else {
          console.log('Please install MetaMask extension');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    init();
  }, [phoneNumber]);

  useEffect(() => {
    async function fetchRecords() {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = UploadEhr.networks[networkId];
          const contractAddress = deployedNetwork.address;

          const uploadEhrContract = new web3.eth.Contract(
            UploadEhr.abi,
            contractAddress
          );

          const fetchedRecords = await uploadEhrContract.methods
            .getRecords()
            .call({ from: patientDetails.walletAddress });

          setRecords(fetchedRecords);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.error("Please install MetaMask extension.");
      }
    }

    if (patientDetails) {
      fetchRecords();
    }
  }, [patientDetails]);

  const cancelOperation = () => {
    navigate("/patient/" + phoneNumber);
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white p-10 font-mono">
        <h1 className="text-4xl font-bold text-center mb-10">Record Viewer</h1>
        <ul>
          {records.map((record, index) => (
            <li
              key={index}
              className="flex justify-between items-start border-white border p-5 mb-5 flex-wrap"
            >
              <div className="flex-none w-1/2 pr-5">
                <strong className="text-yellow-500">Record :</strong>{" "}
                {index + 1}
                <br />
                <strong className="text-yellow-500">Uploaded : </strong>{" "}
                {record.timeStamp}
                <br />
              </div>
              <div className="flex-none w-1/2">
                <a
                  href={`http://localhost:8080/ipfs/${record.medicalRecordHash}`}
                  target="_blank"
                >
                  <button className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300 transform hover:scale-105">
                    View
                  </button>
                </a>
              </div>
            </li>
          ))}
        </ul>
        <center>
          <button
            onClick={cancelOperation}
            className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
          >
            Back to Doctor Dashboard
          </button>
        </center>
      </div>
    </div>
  );
}

export default ViewPatientRecords;
