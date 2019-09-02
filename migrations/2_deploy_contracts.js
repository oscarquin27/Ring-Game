 var MyContract = artifacts.require("./RingGame.sol");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
};
