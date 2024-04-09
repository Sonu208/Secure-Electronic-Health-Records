import React, { useState, useEffect } from "react";
import record from "../build/contracts/record.json"; // Adjust the path as needed
import Web3 from "web3"; // Import Web3 here
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../big_css/CreateEHR.css";
import axios from 'axios'; // Import axios here
import NavBar_Logout from "./NavBar_Logout";

const CreateEhr = () => {
  const navigate = useNavigate();
  const { address } = useParams(); // Retrieve account address from URL
  const [web3Instance, setWeb3Instance] = useState(null);
  const [recId, setRecId] = useState("EHR" + uuidv4());
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    patientAddress: "",
    age: "",
    gender: "",
    diagnosis: "",
    prescription: "",
    doctorPrivateKey: "",
  });
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState(null);
  const [retrievedFileURL, setRetrievedFileURL] = useState(null);
  const fileInputRef = React.useRef(null);
  const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZTk1ZDZkOC1mZDE0LTQyNjgtOGMxOS01M2M3NDg5NmQ3ZTgiLCJlbWFpbCI6ImFkaXR5YXNhY2hpbnJhbmRpdmVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjBiNWNmN2Q2ZDYzMGFmNjg2NmZjIiwic2NvcGVkS2V5U2VjcmV0IjoiZThkNGExOTA4MWZiYzY0MWU4N2E2YWVkZWQ4N2IxNGZkNWI1MWM0NTQyOGE3MGU1YWJjYzE1MDViOTc5MGJlNyIsImlhdCI6MTcxMDk5OTQ4Mn0.7Pb9LHGmBnr50hzaDVZupTGAjs3oSgrzsMIEky9tvS4"

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

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
      if (!file) {
        alert("file not uploaded");
        return;
      }

      // Pinata file upload
      const newFormData = new FormData();
      newFormData.append('file', file);
      newFormData.append('pinataMetadata', JSON.stringify({
        name: 'File name',
      }));
      newFormData.append('pinataOptions', JSON.stringify({
        cidVersion: 0,
      }));

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", newFormData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${newFormData._boundary}`,
          'Authorization': `Bearer ${JWT}` // Use your Pinata JWT token here
        }
      });

      setCid(res.data.IpfsHash);
      console.log(res.data.IpfsHash);
      alert("file uploaded successfully with " + res.data.IpfsHash);
      console.log(cid);
      console.log(formData.doctorPrivateKey);


      // Remaining code for EHR creation
      const temp_docSignature = web3Instance.eth.accounts.sign(
        res.data.IpfsHash,
        formData.doctorPrivateKey
      );

      const docSignature = temp_docSignature.signature;

      const contract = new web3Instance.eth.Contract(
        record.abi,
        deployedNetwork.address
      );
      await contract.methods
        .createEHR(
          recId,
          formData.patientName,
          formData.doctorName,
          address, // Use account address from URL
          formData.patientAddress,
          parseInt(formData.age),
          formData.gender,
          formData.diagnosis,
          formData.prescription,
          res.data.IpfsHash,
          docSignature
        )
        .send({ from: formData.patientAddress });

      console.log("EHR created successfully.");
      // Reset the form fields
      setFormData({
        recordId: "",
        patientName: "",
        doctorName: "",
        patientAddress: "",
        age: "",
        gender: "",
        diagnosis: "",
        prescription: "",
        doctorPrivateKey: "",
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // This will reset the file input
      }
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
          Create Electronic Health Record
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

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="patientName">
              Patient Name:
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="doctorName">
              Doctor Name:
            </label>
            <input
              type="text"
              id="doctorName"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label
              className="block font-bold text-white"
              htmlFor="patientAddress"
            >
              Patient Address:
            </label>
            <input
              type="text"
              id="patientAddress"
              name="patientAddress"
              value={formData.patientAddress}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="age">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="gender">
              Gender:
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4">
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
            ></textarea>
          </div>

          <div className="mb-4">
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
            ></textarea>
          </div>

          <div className="mb-4 col-span-full">
            <h2 className="text-white">Upload Final Report</h2>
            <input
              type="file"
              onChange={onFileChange}
              ref={fileInputRef}
              className="mt-2 p-2 text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

          <div className="mb-4 col-span-full">
            <label
              className="block font-bold text-white"
              htmlFor="doctorPrivateKey"
            >
              Doctor Private Key:
            </label>
            <input
              type="text"
              id="doctorPrivateKey"
              name="doctorPrivateKey"
              value={formData.doctorPrivateKey}
              onChange={handleInputChange}
              required
              className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
            />
          </div>

            <div className="col-span-full">
            <center>
            <button
              type="submit"
              className="px-5 py-2.5 bg-custom-teal text-white font-bold text-lg rounded-lg cursor-pointer mt-3 mr-5 transition-transform transition-background-color duration-300 ease-in hover:bg-gray-400 transform hover:scale-105"
            >
              Create Record
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
