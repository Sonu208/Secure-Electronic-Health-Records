import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/PatientDashBoard.css";

const PatientDashBoard = () => {
  const { address } = useParams(); // Retrieve the address from the URL parameter
  const navigate = useNavigate();
  const viewRecord = () => {
    navigate("/patient/" + address + "/viewrecord");
  };

  const permissionsTab = () => {
    navigate("/patient/" + address + "/permissionstab");
  };
  const writepermission = () => {
    navigate("/patient/" + address + "/writepermission");
  };

  const insuranceclaim = () => {
    navigate("/patient/" + address + "/raiseclaim");
  };

  const viewInsuranceClaim = () => {
    navigate("/patient/" + address + "/viewclaim");
  };

  const bookAppointment = () => {
    navigate("/patient/" + address + "/bookappointment");
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Patient Dashboard</h2>
      <p className="text-xl sm:text-2xl mb-24">
        Hello, Patient at address:{" "}
        <span className="font-bold text-yellow-500">{address}</span>
      </p>

      <div className="flex flex-wrap justify-center gap-5 w-full px-4 sm:px-0">
        <button
          onClick={viewRecord}
          className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
        >
          View Record
        </button>
        <button
          onClick={permissionsTab}
          className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
        >
          View Permission
        </button>
        <button
          onClick={writepermission}
          className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
        >
          Write Permission
        </button>
      </div>
    </div>
  );
};

export default PatientDashBoard;
