const DoctorRegistry = artifacts.require("DoctorRegistration");

module.exports = function(deployer) {
  deployer.deploy(DoctorRegistry);
};