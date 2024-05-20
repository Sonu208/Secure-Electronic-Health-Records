import React, { useState, useEffect } from "react";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PatientWritePermission.css";
import "../big_css/CreateEHR.css";
import NavBar_Logout from "./NavBar_Logout";

const ViewDoctorProfile = () => {
  const { phoneNumber } = useParams();
  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contract = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const result = await contract.methods.getDoctorDetails(phoneNumber).call();
          setDoctorDetails(result);
        } else {
          setError("Please install MetaMask extension");
        }
      } catch (error) {
        console.error('Error retrieving doctor details:', error);
        setError('Error retrieving doctor details');
      }
    };

    fetchDoctorDetails();
  }, [phoneNumber]);

  const cancelOperation = async () => {
    try {
      navigate("/doctor/" + phoneNumber);
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
            Doctor's Profile
          </h1>
          {doctorDetails && (
            <div>
              <center>
                <p className="text-xl sm:text-2xl mb-2">
                  Name : <span className="font-bold text-yellow-500">{doctorDetails[1]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  DOB : <span className="font-bold text-yellow-500">{doctorDetails[3]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Gender : <span className="font-bold text-yellow-500">{doctorDetails[4]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Hospital Name : <span className="font-bold text-yellow-500">{doctorDetails[2]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Specialization : <span className="font-bold text-yellow-500">{doctorDetails[6]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Department : <span className="font-bold text-yellow-500">{doctorDetails[7]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Designation : <span className="font-bold text-yellow-500">{doctorDetails[8]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Work Experience : <span className="font-bold text-yellow-500">{doctorDetails[9]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Email-Id : <span className="font-bold text-yellow-500">{doctorDetails[5]}</span>
                </p>
                <p className="text-xl sm:text-2xl mb-2">
                  Phone Number : <span className="font-bold text-yellow-500">{phoneNumber}</span>
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

export default ViewDoctorProfile;
