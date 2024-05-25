import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const DoctorViewPatient = () => {
  const { hhNumber } = useParams(); // Retrieve the hhNumber from the URL parameter
  const navigate = useNavigate();

  const doctorForm = () => {
    navigate("/doctor/"+hhNumber+"/doctorform");
  };

  const viewPatientRecords = () => {
    navigate("/patient/"+hhNumber+"/viewrecords");
  };

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(contractInstance);
        try {
          const result = await contractInstance.methods.getPatientDetails(hhNumber).call();
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
  }, [hhNumber]);

  const cancelOperation = () => {
    navigate(-1);
  };

  return (
    <div>
    <NavBar_Logout></NavBar_Logout>
    <div className="bg-b to-gray-500 p-4 sm:p-10 font-mono text-white h-30 flex flex-col justify-center items-center">
      <h2 className="text-2xl sm:text-4xl font-bold mb-6">Patient's Profile</h2>
      <br/>
        {patientDetails && (
          <center>
          <p className="text-xl sm:text-3xl mb-20">
          Name : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.name}</span>{"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          DOB : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.dateOfBirth}</span>{"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          Gender : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.gender}</span>
          <br />
          <br />
          BloodGroup : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.bloodGroup}</span>{"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          Address : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.homeAddress}</span>{"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
            <br></br><br></br>
          Email-Id : {" "}
            <span className="font-bold text-yellow-500">{patientDetails.email}</span>
        </p>
        </center>
      )}
      </div>
      <div>
      <center>
      <button
            onClick={viewPatientRecords}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
          >
            View Record
          </button>
          {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          <button
          onClick={doctorForm}
          className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
          >
          Prescription Consultancy
          </button>
          {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          <button
            onClick={cancelOperation}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
          >
            Close
          </button>
        </center>
      </div>
      </div>
  );
};

export default DoctorViewPatient;
