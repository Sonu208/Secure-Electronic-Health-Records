import React, { useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import "../CSS/DoctorRegistration.css";

const DoctorRegistrationForm = () => {
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [workExperience, setWorkExperience] = useState("");

  const hospitals = [
    "Hinduja",
    "Fortis",
    "Sushrusha",
    "Noble",
    "Apolo",
    "Global",
    "Jaslok",
    "Nanavati",
    "Raheja",
    "Kokilaben"
  ];

  const genders = ["Male", "Female", "Others"];

  const specializations = [
    "General Medical",
    "Cardiology",
    "Surgeon",
    "Gastroenterology",
    "Respiratory",
    "Oncology",
    "Neurology",
    "Rheumatology"
  ];

  const departments = [
    "General Medical",
    "Cardiology",
    "Surgeon",
    "Gastroenterology",
    "Respiratory",
    "Oncology",
    "Neurology",
    "Rheumatology"
  ];

  const designations = ["HOD", "Senior Doctor", "Consultant", "Physician", "Specialist"];

  const handleRegister = async () => {

    if (
      !doctorAddress ||
      !doctorName ||
      !hospitalName ||
      !dateOfBirth ||
      !gender ||
      !phoneNumber ||
      !specialization ||
      !department ||
      !designation ||
      !workExperience
    ) {
      alert(
        "You have missing input fields. Please fill in all the required fields."
      );
      return;
    }

    if (phoneNumber.length !== 10) {
      alert(
        "You have entered a wrong phone number. Please enter a 10-digit phone number."
      );
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      const contract = new web3.eth.Contract(
        DoctorRegistration.abi,
        DoctorRegistration.networks[networkId].address
      );

      // Check if dateOfBirth is in the format dd/mm/yyyy
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(dateOfBirth)) {
        alert("Please enter Date of Birth in the format dd/mm/yyyy");
        return;
      }

      const isRegDoc = await contract.methods
        .isRegisteredDoctor(doctorAddress)
        .call();

      if (isRegDoc) {
        alert("Doctor already exists");
        return;
      }

      await contract.methods
        .registerDoctor(
          doctorAddress,
          doctorName,
          hospitalName,
          dateOfBirth,
          gender,
          phoneNumber,
          specialization,
          department,
          designation,
          workExperience
        )
        .send({ from: doctorAddress });

      alert("Doctor registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the doctor.");
    }
  };

  return (
    <div className="createehr min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl text-white mb-6 font-bold text-center">
          Doctor Registration
        </h2>
        <form className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="doctorAddress">
              Doctor Address:
            </label>
            <input
              id="doctorAddress"
              name="doctorAddress"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              placeholder="Doctor Address"
              value={doctorAddress}
              onChange={(e) => setDoctorAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="doctorName">
              Doctor Full Name:
            </label>
            <input
              id="doctorName"
              name="doctorName"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              placeholder="Doctor Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="hospitalName">
              Hospital Name:
            </label>
            <select
              id="hospitalName"
              name="hospitalName"
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            >
              <option value="">Select Hospital</option>
              {hospitals.map((hospital, index) => (
                <option key={index} value={hospital}>{hospital}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="dateOfBirth">
              Date of Birth:
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="gender">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              {genders.map((gender, index) => (
                <option key={index} value={gender}>{gender}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="phoneNumber">
              Phone Number:
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="specialization"
            >
              Specialization:
            </label>
            <select
              id="specialization"
              name="specialization"
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="department">
              Department:
            </label>
            <select
              id="department"
              name="department"
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="designation">
              Designation:
            </label>
            <select
              id="designation"
              name="designation"
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            >
              <option value="">Select Designation</option>
              {designations.map((desig, index) => (
                <option key={index} value={desig}>{desig}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="workExperience"
            >
              Work Experience:
            </label>
            <input
              id="workExperience"
              name="workExperience"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              placeholder="Work Experience"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
            />
          </div>
        </form>
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleRegister}
            className="py-3 px-4 bg-teal-500 text-white rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Register Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistrationForm;