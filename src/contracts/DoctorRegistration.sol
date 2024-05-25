// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DoctorRegistration {
    struct Doctor {
        address walletAddress;
        string doctorName;
        string hospitalName;
        string dateOfBirth;
        string gender;
        string email;
        string hhNumber;
        string specialization;
        string department;
        string designation;
        string workExperience;
        string password;
    }

    struct PatientList{
        string patient_number;
        string patient_name;
    }

    mapping(string => address) private doctorAddresses;
    mapping(string => Doctor) private doctors;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;

    event DoctorRegistered(string hhNumber, string doctorName, address walletAddress);

    function registerDoctor(
        string memory _doctorName,
        string memory _hospitalName,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _email,
        string memory _hhNumber,
        string memory _specialization,
        string memory _department,
        string memory _designation,
        string memory _workExperience,
        string memory _password
    ) external {
        require(doctorAddresses[_hhNumber] == address(0), "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            walletAddress: msg.sender,
            doctorName: _doctorName,
            hospitalName: _hospitalName,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            email: _email,
            hhNumber: _hhNumber,
            specialization: _specialization,
            department: _department,
            designation: _designation,
            workExperience: _workExperience,
            password: _password
        });

        doctors[_hhNumber] = newDoctor;
        doctorAddresses[_hhNumber] = msg.sender;
        emit DoctorRegistered(_hhNumber, _doctorName, msg.sender);
    }

    function isRegisteredDoctor(string memory _hhNumber) external view returns (bool) {
        return doctorAddresses[_hhNumber] != address(0);
    }

    function getDoctorDetails(string memory _hhNumber) external view returns (
        address _walletAddress,
        string memory _doctorName,
        string memory _hospitalName,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _email,
        string memory _specialization,
        string memory _department,
        string memory _designation,
        string memory _workExperience
    ) {
        require(doctorAddresses[_hhNumber] != address(0), "Doctor not registered");
        Doctor memory doctor = doctors[_hhNumber];
        return (
            doctor.walletAddress,
            doctor.doctorName,
            doctor.hospitalName,
            doctor.dateOfBirth,
            doctor.gender,
            doctor.email,
            doctor.specialization,
            doctor.department,
            doctor.designation,
            doctor.workExperience
        );
    }

    function validatePassword(string memory _hhNumber, string memory _password) external view returns (bool) {
        require(doctorAddresses[_hhNumber] != address(0), "Doctor not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(doctors[_hhNumber].password));
    }

    function grantPermission(
        string memory _patientNumber,
        string memory _doctorNumber,
        string memory _patientName
    ) external {
            PatientList memory newRecord = PatientList(
                _patientNumber,
                _patientName
            );
            Dpermission[_doctorNumber].push(newRecord);
        doctorPermissions[_patientNumber][_doctorNumber] = true;
    }

    function isPermissionGranted(string memory _patientNumber,string memory _doctorNumber) external view returns (bool) {
        return doctorPermissions[_patientNumber][_doctorNumber];
    }

    function revokePermission(string memory _patientNumber, string memory _doctorNumber) public {
        doctorPermissions[_patientNumber][_doctorNumber] = false;

        // Remove the patient's record from the list
        for (uint i = 0; i < Dpermission[_doctorNumber].length; i++) {
            if (keccak256(abi.encodePacked(Dpermission[_doctorNumber][i].patient_number)) == keccak256(abi.encodePacked(_patientNumber))) {
                // Delete the patient's record by shifting elements
                for (uint j = i; j < Dpermission[_doctorNumber].length - 1; j++) {
                    Dpermission[_doctorNumber][j] = Dpermission[_doctorNumber][j + 1];
                }
                Dpermission[_doctorNumber].pop();
                break;
            }
        }
    }


    function getPatientList(string memory _doctorNumber) public view returns (PatientList[] memory) {
        return Dpermission[_doctorNumber];
    }

}
