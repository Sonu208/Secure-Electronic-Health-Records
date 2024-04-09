import React, { useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorRegistration.css";
import NavBar from "./NavBar";

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
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [specializationError, setSpecializationError] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [password, setPassword] = useState(""); // Define password state variable

  const navigate = useNavigate();

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
      !workExperience ||
      !password
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

     // Password validation: minimum length
    if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
      }
      
    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      const contract = new web3.eth.Contract(
        DoctorRegistration.abi,
        DoctorRegistration.networks[networkId].address
      );

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
          workExperience,
          password // Include password in the function call
        )
        .send({ from: doctorAddress });

      alert("Doctor registered successfully!");
      navigate("/");
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while registering the doctor.");
      }
    };

    const handlePhoneNumberChange = (e) => {
      const inputPhoneNumber = e.target.value;
      const phoneRegex = /^\d{10}$/;
      if (phoneRegex.test(inputPhoneNumber)) {
        setPhoneNumber(inputPhoneNumber);
        setPhoneNumberError("");
      } else {
        setPhoneNumber(inputPhoneNumber);
        setPhoneNumberError("Please enter a 10-digit phone number.");
      }
    };
  
    // Function to handle changes in Specialization dropdown
    const handleSpecializationChange = (e) => {
      const value = e.target.value;
      setSpecialization(value);
      if (value === "Other") {
        setSpecializationError("");
      }
    };
  
    // Function to handle changes in Department dropdown
    const handleDepartmentChange = (e) => {
      const value = e.target.value;
      setDepartment(value);
      if (value === "Other") {
        setDepartmentError("");
      }
    };
  
    // Function to handle changes in Designation dropdown
    const handleDesignationChange = (e) => {
      const value = e.target.value;
      setDesignation(value);
      if (value === "Other") {
        setDesignationError("");
      }
    };

  return (
    <div>
    <NavBar></NavBar>
    <div className="createehr min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl text-white mb-6 font-bold text-center">
          Doctor Registration
        </h2>
        <form className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="doctorAddress"
            >
              Doctor's Wallet Public Address:
            </label>
            <input
              id="doctorAddress"
              name="doctorAddress"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              placeholder="Public Address"
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
              placeholder="Doctor's Full Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="hospitalName"
            >
              Hospital Name:
            </label>
            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              placeholder="Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="dateOfBirth">
              Date of Birth:
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date" // Use type="date" for date picker
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="gender">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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
              className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${phoneNumberError && "border-red-500"}`}
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            {phoneNumberError && (
              <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>
            )}
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
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              value={specialization}
              onChange={handleSpecializationChange}
            >
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Oncology">Oncology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Radiology">Radiology</option>
              <option value="Other">Other</option>
            </select>
            {specialization === "Other" && (
              <input
                type="text"
                placeholder="Enter Other Specialization"
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
                value={specializationError}
                onChange={(e) => setSpecializationError(e.target.value)}
              />
            )}
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="department"
            >
              Department:
            </label>
            <select
              id="department"
              name="department"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              value={department}
              onChange={handleDepartmentChange}
            >
              <option value="">Select Department</option>
              <option value="Emergency Department (ER)">Emergency Department (ER)</option>
              <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
              <option value="Surgery Department">Surgery Department</option>
              <option value="Laboratory Services">Laboratory Services</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Radiology Department">Radiology Department</option>
              <option value="Obstetrics and Gynecology Department">Obstetrics and Gynecology Department</option>
              <option value="Pediatrics Department">Pediatrics Department</option>
              <option value="Orthopedics Department">Orthopedics Department</option>
              <option value="Cardiology Department">Cardiology Department</option>
              <option value="Other">Other</option>
            </select>
            {department === "Other" && (
              <input
                type="text"
                placeholder="Enter Other Department"
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
                value={departmentError}
                onChange={(e) => setDepartmentError(e.target.value)}
              />
            )}
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="designation"
            >
              Designation:
            </label>
            <select
              id="designation"
              name="designation"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              value={designation}
              onChange={handleDesignationChange}
            >
              <option value="">Select Designation</option>
              <option value="Doctor">Doctor</option>
              <option value="Surgeon">Surgeon</option>
              <option value="Nurse">Nurse</option>
              <option value="Other">Other</option>
            </select>
            {designation === "Other" && (
              <input
                type="text"
                placeholder="Enter Other Designation"
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
                value={designationError}
                onChange={(e) => setDesignationError(e.target.value)}
              />
            )}
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
              type="number"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              placeholder="Years"
              min="0"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
      </div>
  );
};

export default DoctorRegistrationForm;
