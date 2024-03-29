// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PatientRegistry {
    struct Patient {
        string name;
        string dateOfBirth;
        string homeAddress;
        string phoneNumber;
        address walletAddress;
        string gender;
    }

    mapping(address => bool) public isPatient;
    mapping(address => Patient) public patients;
    mapping(address => mapping(address => bool)) private canCreate;
    event PatientRegistered(address indexed patientAddress, string name);

    function registerPatient(
        string memory _name,
        string memory _dateOfBirth,
        string memory _homeAddress,
        string memory _phoneNumber,
        address _walletAddress,
        string memory _gender
    ) external {
        require(
            patients[_walletAddress].walletAddress != _walletAddress,
            "Patient already registered"
        );

        Patient memory newPatient = Patient({
            name: _name,
            dateOfBirth: _dateOfBirth,
            homeAddress: _homeAddress,
            phoneNumber: _phoneNumber,
            walletAddress: _walletAddress,
            gender: _gender
        });

        patients[_walletAddress] = newPatient;
        isPatient[_walletAddress] = true;
        emit PatientRegistered(_walletAddress, _name);
    }

    function isRegisteredPatient(
        address _walletAddress
    ) external view returns (bool) {
        return isPatient[_walletAddress];
    }

    function givepermissioncreate(address _walletAddress) public {
        canCreate[msg.sender][_walletAddress] = true;
    }

    function revokepermissioncreate(address _walletAddress) public {
        canCreate[msg.sender][_walletAddress] = false;
    }

    function haspermission(
        address patientaddress,
        address _walletAddress
    ) external view returns (bool) {
        return canCreate[patientaddress][_walletAddress];
    }
}
