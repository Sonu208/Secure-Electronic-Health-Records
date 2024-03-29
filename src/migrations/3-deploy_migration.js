const SimpleStorage = artifacts.require("record");
module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};