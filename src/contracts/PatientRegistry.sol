pragma solidity ^0.8.19;

contract PatientRegistry {
    struct Patient {
        string name;
        string dateOfBirth;
        string homeAddress;
        string phoneNumber;
        address walletAddress;
        string gender;
        string password;
        string bloodGroup; // Added blood group field
    }

    mapping(address => bool) public isPatient;
    mapping(address => Patient) public patients;
    mapping(address => mapping(address => bool)) private canCreate;
    event PatientRegistered(address indexed patientAddress, string name, string bloodGroup); // Updated event with blood group

    function registerPatient(
        string memory _name,
        string memory _dateOfBirth,
        string memory _homeAddress,
        string memory _phoneNumber,
        address _walletAddress,
        string memory _gender,
        string memory _password,
        string memory _bloodGroup // Include blood group parameter
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
            gender: _gender,
            password: _password,
            bloodGroup: _bloodGroup // Store blood group in the struct
        });

        patients[_walletAddress] = newPatient;
        isPatient[_walletAddress] = true;
        emit PatientRegistered(_walletAddress, _name, _bloodGroup); // Emit blood group
    }

    function isRegisteredPatient(address _walletAddress) external view returns (bool) {
        return isPatient[_walletAddress];
    }

    // Other functions remain the same with changes for blood group
}
