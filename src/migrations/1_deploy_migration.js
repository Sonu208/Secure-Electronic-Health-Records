const DoctorRegistration = artifacts.require("DoctorRegistration");

module.exports = function(deployer) {
  deployer.deploy(DoctorRegistration);
};