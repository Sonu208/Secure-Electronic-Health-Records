// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract record {
    struct Record {
        string recordId;
        string patientName;
        string doctorName;
        address doctorAddress;
        address patientAddress;
        uint256 age;
        string gender;
        string diagnosis;
        string prescription;
        string cid;
        string docSignature;
    }
    mapping(address => Record[]) private records;
    mapping(address => mapping(address => bool)) private doctorPermissions;

    function createEHR(
        string memory _recordId,
        string memory _patientName,
        string memory _doctorName,
        address _doctorAddress,
        address _patientAddress,
        uint256 _age,
        string memory _gender,
        string memory _diagnosis,
        string memory _prescription,
        string memory _cid,
        string memory _docSignature
    ) public {
        Record memory newRecord = Record(
            _recordId,
            _patientName,
            _doctorName,
            _doctorAddress,
            _patientAddress,
            _age,
            _gender,
            _diagnosis,
            _prescription,
            _cid,
            _docSignature
        );
        records[msg.sender].push(newRecord);
    }

    function getRecords() public view returns (Record[] memory) {
        return records[msg.sender];
    }

    function grantPermission(address doctorAddress) public {
        doctorPermissions[msg.sender][doctorAddress] = true;
    }

    function revokePermission(address doctorAddress) public {
        doctorPermissions[msg.sender][doctorAddress] = false;
    }

    function canViewRecord(
        address patientAddress,
        address doctorAddress
    ) public view returns (bool) {
        return doctorPermissions[patientAddress][doctorAddress];
    }

    function viewRecord(
        address patientAddress
    ) public view returns (Record[] memory) {
        require(
            patientAddress == msg.sender ||
                canViewRecord(patientAddress, msg.sender),
            "Not authorized to view records"
        );
        return records[patientAddress];
    }
}
