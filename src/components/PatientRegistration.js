import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PatientRegistry from "../build/contracts/PatientRegistry.json";
import { useNavigate } from "react-router-dom";
import "../CSS/PatientRegistration.css";

const PatientRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistry.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistry.abi,
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
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          if (isRegistered) {
            alert("User is already registered.");
            return;
          }
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistry.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistry.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }

      if (
        !name ||
        !dateOfBirth ||
        !dateOfBirth ||
        !gender ||
        !phoneNumber ||
        !homeAddress ||
        !walletAddress
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

      const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      if (!datePattern.test(dateOfBirth)) {
        alert("Please enter Date of Birth in the format dd/mm/yyyy");
        return;
      }

      setIsLoading(true);
      const isRegPatient = await contract.methods
        .isRegisteredPatient(walletAddress)
        .call({ from: walletAddress });

      if (isRegPatient) {
        setIsRegistered(true);
        alert("User is already registered.");
        setIsLoading(false);
        return;
      }

      await contract.methods.registerPatient;

      await contract.methods
        .registerPatient(
          name,
          dateOfBirth,
          homeAddress,
          phoneNumber,
          walletAddress,
          gender
        )
        .send({ from: walletAddress });
      setName("");
      setHomeAddress("");
      setDateOfBirth("");
      setPhoneNumber("");
      setWalletAddress("");
      setGender("");

      alert("Patient registered successfully!");
      navigate("/patient_login");
    } catch (error) {
      console.error("Error registering patient:", error);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl text-white mb-6 font-bold text-center">
          Register Patient
        </h2>
        <form className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="name">
              Patient Full Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Patient's Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
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
            <label className="block font-bold text-white" htmlFor="homeAddress">
              Home Address:
            </label>
            <input
              type="text"
              id="homeAddress"
              name="homeAddress"
              placeholder="Permanent Address"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
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
              htmlFor="walletAddress"
            >
              Patient's Wallet Public Address:
            </label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              placeholder="Public Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
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
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="button"
              onClick={handleRegister}
              disabled={!contract || isLoading}
              className="px-5 py-2.5 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed w-full md:w-auto"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
