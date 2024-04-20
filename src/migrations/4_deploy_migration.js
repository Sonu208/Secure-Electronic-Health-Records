const DiagnosticRegistration = artifacts.require("DiagnosticRegistration");

module.exports = function(deployer) {
  deployer.deploy(DiagnosticRegistration);
};