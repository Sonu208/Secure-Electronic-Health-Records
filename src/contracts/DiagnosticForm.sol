// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DiagnosticForm {
    struct Record {
        string recordId;
        string doctorName;
        string patientName;
        uint256 age;
        string gender;
        string bloodGroup;
        address doctorAddress;
        address patientAddress;
        string cid;
    }
    mapping(address => Record[]) private records;

    function createEHR(
        string memory _recordId,
        string memory _doctorName,
        string memory _patientName,
        uint256 _age,
        string memory _gender,
        string memory _bloodGroup,
        address _doctorAddress,
        address _patientAddress,
        string memory _cid
    ) public {
        Record memory newRecord = Record(
            _recordId,
            _doctorName,
            _patientName,
            _age,
            _gender,
            _bloodGroup,
            _doctorAddress,
            _patientAddress,
            _cid
        );
        records[msg.sender].push(newRecord);
    }

    function getRecords() public view returns (Record[] memory) {
        return records[msg.sender];
    }
}
