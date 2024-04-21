// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RecordContract {
    struct Record {
        string diagnosis;
        string prescription;
        string docSignature;
    }
    
    mapping(address => Record[]) private records;
    mapping(address => mapping(address => bool)) private doctorPermissions;

    function createEHR(
        string memory _diagnosis,
        string memory _prescription,
        string memory _docSignature
    ) public {
        Record memory newRecord = Record(
            _diagnosis,
            _prescription,
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
