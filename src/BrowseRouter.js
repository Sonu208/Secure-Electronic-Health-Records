import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Web3 from "web3";
import PatientRegistry from "./components/PatientRegistration";
import LoginPage from "./components/LoginPage";
import PatientDashBoard from "./components/PatientDashBoard";
import DoctorDashBoard from "./components/DoctorDashBoard";
// import DiagnosticDashBoard from "./components/DiagnosticDashBoard";
import CreateEhr from "./components/CreateEhr";
import LandingPage from "./components/LandingPage";
import ContractInteraction from "./components/ContractInteraction";
import RecordPermission from "./components/RecordPermission";
import DoctorPermission from "./components/DoctorPermission";
import DoctorLogin from "./components/DoctorLogin";
import DoctorConsultancy from "./components/DoctorForm";
import DiagnosticLogin from "./components/DiagnosticLogin";
// import DiagnosticUpload from "./components/DiagnosticForm";
import PatientLogin from "./components/PatientLogin";
import DoctorRegistry from "./components/DoctorRegistration";
import DiagnosticRegistration from "./components/DiagnosticRegistration";
import PatientWritePermission from "./components/PatientWritePermission";
// import PatientUploadEhr from "./components/PatientUploadEhr";
import DoctorPermissionPage from "./components/DoctorPermissionPage";
import ContractInteractionDoctor from "./components/ContractInteractionDoctor";
import Footer from "./components/Footer";
import LandingPage_1 from "./components/LandingPage_1";
import ViewPatientRecords from "./components/ViewPatientRecords";
import ViewPatientList from "./components/ViewPatientList";
import ViewProfile from "./components/ViewProfile";
import ViewDoctorProfile from "./components/ViewDoctorProfile";
// import ViewDiagnosticProfile from "./components/ViewDiagnosticProfile";
import DoctorViewPatient from "./components/DoctorViewRecords";
// import PatientGrantPermission from "./components/PatientGrantPermission";
// import AboutUs from "./components/AboutPage"; 



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
      {/* <Route path="/AboutPage" element={<AboutUs></AboutUs>}></Route> */}
      <Route path="/" element={<LandingPage_1></LandingPage_1>}></Route>
        <Route path="/register" element={<LandingPage></LandingPage>}></Route>
        <Route
          path="/patient/:phoneNumber/writepermission"
          element={<PatientWritePermission></PatientWritePermission>}
        ></Route>
        {/* <Route
          path="/patient/:phoneNumber/uploadehr"
          element={<PatientUploadEhr></PatientUploadEhr>}
        ></Route> */}
        <Route
          path="/patient_registration"
          element={<PatientRegistry></PatientRegistry>}
        ></Route>
        <Route
          path="/doctor_registration"
          element={<DoctorRegistry></DoctorRegistry>}
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
          element={<DoctorLogin></DoctorLogin>}
        ></Route>
        <Route
          path="/doctor/:phoneNumber/doctorform"
          element={<DoctorConsultancy></DoctorConsultancy>}
        ></Route>
        <Route
          path="/doctor/:phoneNumber/doctorviewpatient"
          element={<DoctorViewPatient></DoctorViewPatient>}
        ></Route>
        {/* <Route
          path="/diagnostic/:phoneNumber/diagnosticform"
          element={<DiagnosticUpload></DiagnosticUpload>}
        ></Route> */}
        <Route
          path="/diagnostic_login"
          element={<DiagnosticLogin></DiagnosticLogin>}
        ></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/patient/:phoneNumber" element={<PatientDashBoard />}></Route>
        <Route path="/doctor/:phoneNumber" element={<DoctorDashBoard />}></Route>
        {/* <Route path="/diagnostic/:phoneNumber" element={<DiagnosticDashBoard />}></Route> */}
        <Route
          path="/doctor/:phoneNumber/createehr"
          element={<CreateEhr web3={web3} />}
        ></Route>
        <Route
          path="/patient/:phoneNumber/viewrecord"
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
        {/* <Route
          path="/diagnostic/:phoneNumber/viewdiagnosticprofile"
          element={<ViewDiagnosticProfile />}
        ></Route> */}
        <Route
          path="/patient/:phoneNumber/viewrecords"
          element={<ViewPatientRecords />}
        ></Route>
        {/* <Route
          path="/patient/:phoneNumber/grantpermission"
          element={<PatientGrantPermission />}
        ></Route> */}
        <Route
          path="/doctor/:phoneNumber/viewrec"
          element={<DoctorPermission />}
        ></Route>
        <Route
          path="/doctor/:phoneNumber/patientlist"
          element={<ViewPatientList />}
        ></Route>
        <Route
          path="/doctor/:phoneNumber/viewrec/:patientaddress"
          element={<ContractInteractionDoctor />}
        ></Route>
        <Route
          path="/doctor/:phoneNumber/doctorpermissionpage"
          element={<DoctorPermissionPage />}
        ></Route>
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
};

export default BrowseRouter;
