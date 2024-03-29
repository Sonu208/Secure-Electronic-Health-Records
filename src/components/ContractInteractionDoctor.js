import React, { useEffect, useState } from "react";
import Web3 from "web3";
import record from "../build/contracts/record.json";
import { useParams } from "react-router-dom";
import "../CSS/ContractInteraction.css";
import axios from "axios";


function ContractInteractionDoctor() {
  const { patientaddress } = useParams();
  const [records, setRecords] = useState([]);
  const [urlMap, setUrlMap] = useState({});

  useEffect(() => {
    async function fetchRecords() {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = record.networks[networkId];
          const contractAddress = deployedNetwork.address;
          const recordContract = new web3.eth.Contract(
            record.abi,
            contractAddress
          );

          const fetchedRecords = await recordContract.methods
            .getRecords()
            .call({ from: patientaddress });

          setRecords(fetchedRecords);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.error("Please install MetaMask extension.");
      }
    }

    fetchRecords();
  }, [patientaddress]);

  const retrieveFromPinata = async (recordCid) => {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${recordCid}`, {
        responseType: 'blob'
      });

      const fileBlob = response.data;
      const fileURL = URL.createObjectURL(fileBlob);

      setUrlMap((prevMap) => ({ ...prevMap, [recordCid]: fileURL }));
    } catch (error) {
      console.error("Failed to retrieve file from Pinata:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 text-white p-10 font-mono">
      <h1 className="text-4xl font-bold text-center mb-10">Record Viewer</h1>
      <ul>
        {records.map((record, index) => (
          <li
            key={index}
            className="flex justify-between items-start border-white border p-5 mb-5 flex-wrap"
          >
            <div className="flex-none w-1/2 pr-5">
              <strong className="text-xl text-yellow-500">Record Id:</strong>{" "}
              {record.recordId}
              <br />
              <strong className="text-yellow-500">Patient Name:</strong>{" "}
              {record.patientName}
              <br />
              <strong className="text-yellow-500">Doctor Name:</strong>{" "}
              {record.doctorName}
              <br />
              <strong className="text-yellow-500">Doctor Address:</strong>{" "}
              {record.doctorAddress}
              <br />
              <strong className="text-yellow-500">Patient Address:</strong>{" "}
              {record.patientAddress}
              <br />
              <strong className="text-yellow-500">Age:</strong> {record.age}
              <br />
              <strong className="text-yellow-500">Gender:</strong>{" "}
              {record.gender}
              <br />
              <strong className="text-yellow-500">Diagnosis:</strong>{" "}
              {record.diagnosis}
              <br />
              <strong className="text-yellow-500">Prescription:</strong>{" "}
              {record.prescription}
              <br />
            </div>

            <div className="flex-none w-1/2">
              <h2 className="text-2xl mb-3">Retrieve & View</h2>
              <button
                onClick={() => retrieveFromPinata(record.cid)}
                className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300 transform hover:scale-105"
              >
                Retrieve from Pinata
              </button>

              {urlMap[record.cid] && (
                <div className="border-white border mt-5 overflow-hidden">
                  <embed
                    src={urlMap[record.cid]}
                    type="application/pdf"
                    className="w-full h-96"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContractInteractionDoctor;
