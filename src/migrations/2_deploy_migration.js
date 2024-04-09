const PatientRegistration = artifacts.require("PatientRegistry");
module.exports = function(deployer) {
  deployer.deploy(PatientRegistration);
};