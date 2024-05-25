const DiagnosticRegistry = artifacts.require("DiagnosticRegistration");

module.exports = function(deployer) {
  deployer.deploy(DiagnosticRegistry);
};