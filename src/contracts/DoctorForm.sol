// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DoctorForm {
    struct Record {
        string recordId;
        string patientName;
        address patientAddress;
        string gender;
        string diagnosis;
        string prescription;
    }
    mapping(address => Record[]) private records;

    function createEHR(
        string memory _recordId,
        string memory _patientName,
        address _patientAddress,
        string memory _gender,
        string memory _diagnosis,
        string memory _prescription
    ) public {
        Record memory newRecord = Record(
            _recordId,
            _patientName,
            _patientAddress,
            _gender,
            _diagnosis,
            _prescription
        );
        records[msg.sender].push(newRecord);
    }

    function getRecords() public view returns (Record[] memory) {
        return records[msg.sender];
    }
}
