import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorRegistration.css";
import NavBar from "./NavBar";

const DoctorRegistry = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalLocation, setHospitalLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [hhNumberError, sethhNumberError] = useState("");
  const [specializationError, setSpecializationError] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [password, setPassword] = useState(""); // Define password state variable
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [email, setEmail] = useState(""); 
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  const handleRegister = async () => {
    if (
      !doctorAddress ||
      !doctorName ||
      !hospitalName ||
      !hospitalLocation ||
      !dateOfBirth ||
      !gender ||
      !email ||
      !hhNumber ||
      !specialization ||
      !department ||
      !designation ||
      !workExperience ||
      !password ||
      !confirmPassword
    ) {
      alert(
        "You have missing input fields. Please fill in all the required fields."
      );
      return;
    }

    if (hhNumber.length !== 6) {
      alert(
        "You have entered a wrong HH Number. Please enter a 6-digit HH Number."
      );
      return;
    }

     // Password validation: minimum length
    if (password.length < 8) {
    setPassword("");
    setConfirmPassword("");
    setPasswordError("Password must be atleast 8 characters long.");
    return;
    }

    if (password !== confirmPassword) {
      setConfirmPassword("");
      setConfirmPasswordError("Passwords do not match.");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError(""); // Clear email error if valid
    }
      
    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      const contract = new web3.eth.Contract(
        DoctorRegistration.abi,
        DoctorRegistration.networks[networkId].address
      );

      const isRegDoc = await contract.methods
        .isRegisteredDoctor(hhNumber)
        .call();

      if (isRegDoc) {
        alert("Doctor already exists");
        return;
      }

      await contract.methods
        .registerDoctor(
          doctorName,
          hospitalName,
          dateOfBirth,
          gender,
          email,
          hhNumber,
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
  
    const handleEmailChange = (e) => {
      const inputEmail = e.target.value;
      setEmail(inputEmail);
    };

    const handlehhNumberChange = (e) => {
      const inputhhNumber = e.target.value;
      const phoneRegex = /^\d{6}$/;
      if (phoneRegex.test(inputhhNumber)) {
        sethhNumber(inputhhNumber);
        sethhNumberError("");
      } else {
        sethhNumber(inputhhNumber);
        sethhNumberError("Please enter a 6-digit HH Number.");
      }
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
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
  
  const cancelOperation = () => {
    navigate("/");
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
              Wallet Public Address
            </label>
            <input
              id="doctorAddress"
              name="doctorAddress"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              placeholder="Crypto Wallet's Public Address"
              value={doctorAddress}
              onChange={(e) => setDoctorAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="doctorName">
              Full Name
            </label>
            <input
              id="doctorName"
              name="doctorName"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              placeholder="Enter Full Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="hospitalName"
            >
              Hospital Name
            </label>
            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              placeholder="Enter Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
            </div>
          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="hospitalLocation"
            >
              Hospital Location
            </label>
            <input
              id="hospitalLocation"
              name="hospitalLocation"
              type="text"
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              placeholder="Enter Hospital Location"
              value={hospitalLocation}
              onChange={(e) => setHospitalLocation(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="dateOfBirth">
              Date of Birth
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
              Gender
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
            <label className="block font-bold text-white" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${
                emailError && "border-red-500"
              }`}
              placeholder="Enter your Email-id"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
            
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="hhNumber">
              HH Number
            </label>
            <input
              id="hhNumber"
              name="hhNumber"
              type="text"
              required
              className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${hhNumberError && "border-red-500"}`}
              placeholder="Enter your HH Number"
              value={hhNumber}
              onChange={handlehhNumberChange}
            />
            {hhNumberError && (
              <p className="text-red-500 text-sm mt-1">{hhNumberError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="specialization"
            >
              Specialization
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
              <option value="Oncology">Oncology</option>
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
              Department
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
              <option value="Casualty">Casualty</option>
              <option value="Surgery">Surgery</option>
              <option value="Laboratory Services">Consultancy</option>
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
              Designation
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
              Work Experience
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
              <label className="block font-bold text-white" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${
                  passwordError && "border-red-500"
                }`}
                placeholder="Enter your Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
          </div>
            
          <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${
                  confirmPasswordError && "border-red-500"
                }`}
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
              )}
          </div>

        </form>
        <div className="space-x-4 text-center mt-6">
          <button
            type="button"
            onClick={handleRegister}
            className="py-3 px-4 bg-teal-500 text-white rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Register 
            </button>
            <button
              onClick={cancelOperation}
              className="py-3 px-4 bg-teal-500 text-white rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
              Close
            </button>
        </div>
      </div>
      </div>
      </div>
  );
};

export default DoctorRegistry;
