// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract UploadEhr {
    struct PatientRecord {
        string timeStamp;
        string medicalRecordHash;
    }

    mapping(address => PatientRecord[]) private records;

    function addRecord(string memory _timeStamp, string memory _medicalRecordHash) public {
        PatientRecord memory newRecord = PatientRecord(
            _timeStamp,
            _medicalRecordHash
        );
        records[msg.sender].push(newRecord);
    }

    function getRecords() public view returns (PatientRecord[] memory) {
        return records[msg.sender];
    }
}