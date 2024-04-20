// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DiagnosticRegistration {
    struct DiagnosticCenter {
        address diagnosticAddress;
        string diagnosticCenterName;
        string phoneNumber;
        string personalAddress; // Renamed variable from 'address' to 'personalAddress'
        string password;
    }

    mapping(address => DiagnosticCenter) private diagnosticCenters;
    mapping(address => bool) private isDiagnosticCenterRegistered;

    event DiagnosticCenterRegistered(address indexed diagnosticAddress, string diagnosticCenterName);

    function registerDiagnostic(
        address _diagnosticAddress,
        string memory _diagnosticCenterName,
        string memory _phoneNumber,
        string memory _personalAddress, // Renamed variable from 'address' to 'personalAddress'
        string memory _password
    ) external {
        require(!isDiagnosticCenterRegistered[_diagnosticAddress], "Diagnostic center already registered");

        DiagnosticCenter memory newDiagnosticCenter = DiagnosticCenter({
            diagnosticAddress: _diagnosticAddress,
            diagnosticCenterName: _diagnosticCenterName,
            phoneNumber: _phoneNumber,
            personalAddress: _personalAddress, // Renamed variable from 'address' to 'personalAddress'
            password: _password
        });

        diagnosticCenters[_diagnosticAddress] = newDiagnosticCenter;
        isDiagnosticCenterRegistered[_diagnosticAddress] = true;

        emit DiagnosticCenterRegistered(_diagnosticAddress, _diagnosticCenterName);
    }

    function validateDiagnosticPassword(address _diagnosticAddress, string memory _password) external view returns (bool) {
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(diagnosticCenters[_diagnosticAddress].password));
    }

    function getDiagnosticCenterDetails(address _diagnosticAddress) external view returns (DiagnosticCenter memory) {
        return diagnosticCenters[_diagnosticAddress];
    }

    function isRegisteredDiagnostic(address _diagnosticAddress) external view returns (bool) {
        return isDiagnosticCenterRegistered[_diagnosticAddress];
    }
}
