import React, { useState, useEffect } from "react";
import record from "../build/contracts/record.json"; // Adjust the path as needed
import Web3 from "web3"; // Import Web3 here
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../big_css/CreateEHR.css";
import NavBar_Logout from "./NavBar_Logout";

const CreateEhr = () => {
  const navigate = useNavigate();
  const { address } = useParams(); // Retrieve account address from URL
  const [web3Instance, setWeb3Instance] = useState(null);
  const [recId, setRecId] = useState("EHR" + uuidv4());
  const [formData, setFormData] = useState({
    diagnosis: "",
    prescription: "",
  });
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request account access
        setWeb3Instance(web3Instance);
      } else {
        console.error("MetaMask not detected. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = record.networks[networkId];
      if (!deployedNetwork) {
        throw new Error("Contract not deployed to this network");
      }

      // Remaining code for EHR creation
      const contract = new web3Instance.eth.Contract(
        record.abi,
        deployedNetwork.address
      );
      await contract.methods
        .createEHR(
          formData.diagnosis,
          formData.prescription,
          recId
        )
        .send({ from: address }); // Use account address from URL

      console.log("EHR created successfully.");
      // Reset the form fields
      setFormData({
        diagnosis: "",
        prescription: "",
      });
      const newRecId = "EHR" + uuidv4();
      setRecId(newRecId);
      navigate("/doctor/"+address)
    } catch (error) {
      console.error("EHR creation failed:", error);
    }
  };

  const cancelOperation = async () => {
    try {
    navigate("/doctor/"+address);
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  return (
    <div>
    <NavBar_Logout></NavBar_Logout>
    <div className="createehr min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-800 font-mono">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl text-white mb-6 font-bold text-center">
          Consulting
        </h2>
        <form
          className="bg-gray-900 p-6 rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-white" htmlFor="recordId">
              Record Id :
            </label>
            <span className="mt-2 p-2 text-white font-bold">{recId}</span>
          </div>

          <div className="mb-4 col-span-full">
            <label className="block font-bold text-white" htmlFor="diagnosis">
              Diagnosis:
            </label>
            <textarea
              type="textarea"
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white h-24 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              required
            ></textarea>
          </div>

          <div className="mb-4 col-span-full">
            <label
              className="block font-bold text-white"
              htmlFor="prescription"
            >
              Prescription:
            </label>
            <textarea
              type="text"
              id="prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full h-24 text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              required
            ></textarea>
          </div>

          <div className="col-span-full">
            <center>
              <button
                type="submit"
                className="px-5 py-2.5 bg-custom-teal text-white font-bold text-lg rounded-lg cursor-pointer mt-3 mr-5 transition-transform transition-background-color duration-300 ease-in hover:bg-gray-400 transform hover:scale-105"
              >
                Submit
              </button>
            </center>
          </div>
        </form>
        <center>
          <button
            onClick={cancelOperation}
            className="px-5 py-2.5 bg-custom-teal text-white font-bold text-lg rounded-lg cursor-pointer mt-3 mr-5 transition-transform transition-background-color duration-300 ease-in hover:bg-gray-400 transform hover:scale-105"
          >
            Cancel
          </button>
        </center>
      </div>
    </div>
  </div>
  );
};

export default CreateEhr;
