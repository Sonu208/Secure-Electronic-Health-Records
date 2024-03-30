pragma solidity ^0.8.19;

contract DoctorRegistration {
    struct Doctor {
        address doctorAddress;
        string doctorName;
        string hospitalName;
        string dateOfBirth;
        string gender;
        string phoneNumber;
        string specialization;
        string department;
        string designation;
        string workExperience;
        string password;
    }

    mapping(address => Doctor) private doctors;
    mapping(address => bool) private isDoctorRegistered;

    event DoctorRegistered(address indexed doctorAddress, string doctorName);

    function registerDoctor(
        address _doctorAddress,
        string memory _doctorName,
        string memory _hospitalName,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _phoneNumber,
        string memory _specialization,
        string memory _department,
        string memory _designation,
        string memory _workExperience,
        string memory _password
    ) external {
        require(!isDoctorRegistered[_doctorAddress], "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            doctorAddress: _doctorAddress,
            doctorName: _doctorName,
            hospitalName: _hospitalName,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            phoneNumber: _phoneNumber,
            specialization: _specialization,
            department: _department,
            designation: _designation,
            workExperience: _workExperience,
            password: _password
        });

        doctors[_doctorAddress] = newDoctor;
        isDoctorRegistered[_doctorAddress] = true;

        emit DoctorRegistered(_doctorAddress, _doctorName);
    }

    function validateDoctorPassword(address _doctorAddress, string memory _password) external view returns (bool) {
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(doctors[_doctorAddress].password));
    }

    function getDoctorDetails(address _doctorAddress) external view returns (Doctor memory) {
        return doctors[_doctorAddress];
    }

    function isRegisteredDoctor(address _doctorAddress) external view returns (bool) {
        return isDoctorRegistered[_doctorAddress];
    }
}
