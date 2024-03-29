import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PatientRegistry from "../build/contracts/PatientRegistry.json";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json"; // Replace with the actual ABI and address
import { useParams } from "react-router";
import "../CSS/PatientWritePermission.css";

const PatientWritePermission = () => {
  const patientaccount_param = useParams();
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [contractInstance2, setContractInstance2] = useState(null);
  const [account, setAccount] = useState(null);
  const [patientaccount, setpatientaccount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [permissionStatus, setPermissionStatus] = useState(false);
  useEffect(() => {
    async function initializeWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          await window.ethereum.enable();
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const networkId = await web3Instance.eth.net.getId();

          const deployedNetwork = PatientRegistry.networks[networkId];
          const deployedNetwork2 = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistry.abi,
            deployedNetwork && deployedNetwork.address
          );

          const contractInstance2 = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork2 && deployedNetwork2.address
          );
          setContractInstance(contractInstance);
          setContractInstance2(contractInstance2);
          setpatientaccount(patientaccount_param.address);
        } catch (error) {
          console.error("Error initializing web3:", error);
        }
      } else {
        console.error(
          "Web3 not found. Please install MetaMask or use an Ethereum-compatible browser."
        );
      }
    }

    initializeWeb3();
  }, []);
  console.log(walletAddress);
  const givePermission = async () => {
    try {
      const registered = await contractInstance2.methods
        .isRegisteredDoctor(walletAddress)
        .call();
      console.log(registered);

      if (registered) {
        await contractInstance.methods
          .givepermissioncreate(walletAddress)
          .send({ from: patientaccount });
        console.log("Permission granted.");
        alert("Permission granted successfully");
      } else {
        alert("Doctor does not exist");
      }
    } catch (error) {
      console.error("Error granting permission:", error);
      alert("Error granting permission:");
    }
  };

  const revokePermission = async () => {
    try {
      await contractInstance.methods
        .revokepermissioncreate(walletAddress)
        .send({ from: patientaccount });
      console.log("Permission revoked.");
    } catch (error) {
      console.error("Error revoking permission:", error);
      alert("Error revoking permission:");
    }
  };

  const checkPermission = async () => {
    try {
      const hasPermission = await contractInstance.methods
        .haspermission(patientaccount, walletAddress)
        .call({ from: patientaccount });
      setPermissionStatus(hasPermission);
      console.log(hasPermission);
    } catch (error) {
      console.error("Error checking permission:", error);
      alert("Error checking permission:");
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-6xl bg-gray-900 p-24 rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Write Permission Management
        </h1>

        <div className="flex flex-col w-full sm:w-1/2 mb-4">
          <label className="mb-2 font-bold">
            Doctors Wallet Address:
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="p-2 mt-1 w-full rounded-lg bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200 placeholder-white"
            />
          </label>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={givePermission}
            className="px-8 py-4 rounded-lg bg-green-500 hover:bg-gray-600 transition-colors duration-300"
          >
            Give Permission
          </button>
          <button
            onClick={revokePermission}
            className="px-8 py-4 rounded-lg bg-red-500 hover:bg-gray-600 transition-colors duration-300"
          >
            Revoke Permission
          </button>
          <button
            onClick={checkPermission}
            className="px-8 py-4 rounded-lg bg-blue-500 hover:bg-gray-600 transition-colors duration-300"
          >
            Check Permission
          </button>
        </div>

        <div className="text-xl">
          <p>
            Permission Status:{" "}
            <span className="font-bold">
              {permissionStatus ? "Granted" : "Revoked"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientWritePermission;
