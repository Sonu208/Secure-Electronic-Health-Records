import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Web3 from "web3";
import PatientRegistration from "./components/PatientRegistration";
import LoginPage from "./components/LoginPage";
import PatientDashBoard from "./components/PatientDashBoard";
import DoctorDashBoard from "./components/DoctorDashBoard";
import DiagnosticDashBoard from "./components/DiagnosticDashboard";
import CreateEhr from "./components/CreateEhr";
import LandingPage from "./components/LandingPage";
import ContractInteraction from "./components/ContractInteraction";
import RecordPermission from "./components/RecordPermission";
import DoctorPermission from "./components/DoctorPermission";
import DoctorLoginPage from "./components/DoctorLogin";
import PatientLogin from "./components/PatientLogin";
import DiagnosticLogin from "./components/DiagnosticLogin";
import DoctorRegistrationForm from "./components/DoctorRegistration";
import DiagnosticRegistration from "./components/DiagnosticRegistration";
import PatientWritePermission from "./components/PatientWritePermission";
import DoctorPermissionPage from "./components/DoctorPermissionPage";
import ContractInteractionDoctor from "./components/ContractInteractionDoctor";
import Footer from "./components/Footer";
import LandingPage_1 from "./components/LandingPage_1";
import ViewProfile from "./components/ViewProfile";
import ViewDoctorProfile from "./components/ViewDoctorProfile";

const BrowseRouter = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loggedInPatient, setLoggedInPatient] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const fetchedAccounts = await web3Instance.eth.getAccounts();
          setAccounts(fetchedAccounts);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LandingPage_1></LandingPage_1>}></Route>
        <Route path="/register" element={<LandingPage></LandingPage>}></Route>
        <Route
          path="/patient/:address/writepermission"
          element={<PatientWritePermission></PatientWritePermission>}
        ></Route>
        <Route
          path="/patient_registration"
          element={<PatientRegistration></PatientRegistration>}
        ></Route>
        <Route
          path="/doctor_registration"
          element={<DoctorRegistrationForm></DoctorRegistrationForm>}
        ></Route>
         <Route
          path="/diagnostic_registration"
          element={<DiagnosticRegistration></DiagnosticRegistration>}
        ></Route>
        <Route
          path="/patient_login"
          element={<PatientLogin></PatientLogin>}
        ></Route>
        <Route
          path="/doctor_login"
          element={<DoctorLoginPage></DoctorLoginPage>}
        ></Route>
        <Route
          path="/diagnostic_login"
          element={<DiagnosticLogin></DiagnosticLogin>}
        ></Route>

        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/patient/:address" element={<PatientDashBoard />}></Route>
        <Route path="/doctor/:address" element={<DoctorDashBoard />}></Route>
        <Route path="/diagnostic/:address" element={<DiagnosticDashBoard />}></Route>

        <Route
          path="/doctor/:address/createehr"
          element={<CreateEhr web3={web3} />}
        ></Route>
        <Route
          path="/patient/:address/viewrecord"
          element={<ContractInteraction />}
        ></Route>
        <Route
          path="/patient/:phoneNumber/viewprofile"
          element={<ViewProfile />}
        ></Route>
        <Route
          path="/doctor/:phoneNumber/viewdoctorprofile"
          element={<ViewDoctorProfile />}
        ></Route>
        <Route
          path="/patient/:address/permissionstab"
          element={<RecordPermission />}
        ></Route>
        <Route
          path="/doctor/:address/viewrec"
          element={<DoctorPermission />}
        ></Route>

        <Route
          path="/doctor/:address/viewrec/:patientaddress"
          element={<ContractInteractionDoctor />}
        ></Route>
        <Route
          path="/doctor/:address/doctorpermissionpage"
          element={<DoctorPermissionPage />}
        ></Route>
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
};

export default BrowseRouter;
