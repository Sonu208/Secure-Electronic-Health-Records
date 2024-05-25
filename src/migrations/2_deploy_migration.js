const PatientRegistry = artifacts.require("PatientRegistration");
module.exports = function(deployer) {
  deployer.deploy(PatientRegistry);
};