import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Register.css";

const RegistrationForm = ({ contract, accounts }) => {
  const [registrationResult, setRegistrationResult] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  const handleRegister = async (isDoctor) => {
    try {
      const registerFunction = isDoctor
        ? contract.methods.registerDoctor
        : contract.methods.registerPatient;
      await registerFunction().send({ from: selectedAccount });
      setRegistrationResult(
        `Successfully registered as a ${isDoctor ? "doctor" : "patient"}`
      );
    } catch (error) {
      console.error(error);
      setRegistrationResult("Registration failed");
    }
  };

  return (
    <div className="register">
      <h2 className="h2-reg">Registration</h2>
      <div className="regchild">
        <label className="label-reg">Select Account: </label>
        <select
          className="select-reg"
          onChange={(e) => setSelectedAccount(e.target.value)}
          value={selectedAccount}
        >
          {accounts.map((account) => (
            <option key={account} value={account}>
              {account}
            </option>
          ))}
        </select>
      </div>
      <div className="button-container-reg">
        <button className="but-reg" onClick={() => handleRegister(true)}>
          Register as Doctor
        </button>
        <button className="but-reg" onClick={() => handleRegister(false)}>
          Register as Patient
        </button>
      </div>
      <p>{registrationResult}</p>
    </div>
  );
};

export default RegistrationForm;
