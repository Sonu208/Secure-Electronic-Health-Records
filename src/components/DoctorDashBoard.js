import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const DoctorDashBoardPage = () => {
  const { address } = useParams();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/doctor/${address}/doctorpermissionpage`);
  };

  const viewPatientRecords = () => {
    navigate(`/doctor/${address}/viewrec`);
  };

  const viewAppointment = () => {
    navigate(`/doctor/${address}/viewapp`);
  };

  return (
    <div>
    <NavBar_Logout></NavBar_Logout>
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Doctor Dashboard</h2>
      <p className="text-xl sm:text-2xl mb-4">
        Hello, doctor at address:{" "}
        <span className="font-bold text-yellow-500">{address}</span>
      </p>
      <div className="space-y-4 space-x-4">
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-teal-500 hover:bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
        >
          Consultancy
        </button>
        <button
          onClick={viewPatientRecords}
          className="px-6 py-3 bg-teal-500 hover-bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
        >
          View Patient Records
        </button>
      </div>
      </div>
      </div>
  );
};

export default DoctorDashBoardPage;
