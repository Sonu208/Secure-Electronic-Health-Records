import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../CSS/ContractInteraction.css";
import NavBar_Logout from "./NavBar_Logout";

function ViewPatientList() {
  const navigate = useNavigate();
  const { phoneNumber } = useParams();
  const [web3, setWeb3] = useState(null);
  const [patientList, setPatientList] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const patientListContract = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const pList = await patientListContract.methods
            .getPatientList(phoneNumber)
            .call();
          setPatientList(pList);

          const result = await patientListContract.methods
            .getDoctorDetails(phoneNumber)
            .call();
          setDoctorDetails(result);
        } else {
          console.log("Please install MetaMask extension");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    init();
  }, [phoneNumber]);

  const removePatient = async (patientNumber) => {
    try {
      if (!web3) throw new Error("Web3 not initialized");
      await window.ethereum.enable();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DoctorRegistration.networks[networkId];
      if (!deployedNetwork) {
        throw new Error("Contract not deployed to this network");
      }

      const doctorContract = new web3.eth.Contract(
        DoctorRegistration.abi,
        deployedNetwork.address
      );

      await doctorContract.methods
        .revokePermission(patientNumber, phoneNumber)
        .send({ from: doctorDetails[0] });

      // Refresh patient list after removal
      const updatedPatientList = await doctorContract.methods
        .getPatientList(phoneNumber)
        .call();
      setPatientList(updatedPatientList);

      // Optional: Provide user feedback (e.g., success message)
      console.log("Patient removed successfully");
    } catch (error) {
      console.error("Error removing patient:", error);
      // Optional: Provide user feedback (e.g., error message)
    }
  };

  const cancelOperation = () => {
    navigate(-1);
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white p-10 font-mono">
        <h1 className="text-4xl font-bold text-center mb-10">
          Patient's List
        </h1>
        <ul>
          {patientList.map((patient, index) => (
            <li
              key={index}
              className="flex justify-between items-start border-white border p-5 mb-5 flex-wrap"
            >
              <div className="flex-none w-1/2 pr-5">
                <strong className="text-yellow-500">Patient :</strong>{" "}
                {index + 1}
                <br />
                <strong className="text-yellow-500">Name : </strong>{" "}
                {patient.patient_name}
                <br />
              </div>
              <div className="flex-none">
                <Link
                  to={`/doctor/${patient.patient_number}/doctorviewpatient`}
                >
                  <button className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300 transform hover:scale-105">
                    View
                  </button>
                </Link>{"\u00A0\u00A0\u00A0\u00A0"}
                <button
                  onClick={() => removePatient(patient.patient_number)}
                  className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300 transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <center>
          <button
            type="button"
            onClick={cancelOperation}
            className="px-20 py-5 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
          >
            Back
          </button>
        </center>
      </div>
    </div>
  );
}

export default ViewPatientList;
