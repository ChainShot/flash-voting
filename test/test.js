const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let governance, votingToken;
  let addr0;
  before(async () => {
    [addr0] = await ethers.provider.listAccounts();
    const nonce = await ethers.provider.getTransactionCount(addr0);
    const votingAddress = ethers.utils.getContractAddress({
      from: addr0,
      nonce: nonce + 1,
    });

    const Governance = await ethers.getContractFactory("Governance");
    governance = await Governance.deploy(votingAddress);
    await governance.deployed();

    const VotingToken = await ethers.getContractFactory("VotingToken");
    votingToken = await VotingToken.deploy(governance.address);
    await votingToken.deployed();
  });

  describe("executing a proposal", () => {
    before(async () => {
      const calldata = votingToken.interface.encodeFunctionData("mint", [addr0, ethers.utils.parseEther("10000")])
      await governance.createProposal(calldata, votingToken.address, 0);
      await governance.vote(0, true);
      await hre.network.provider.request({
        method: "evm_increaseTime",
        params: [10 * 60 + 1]
      });
      await governance.execute(0);
    });

    it("should have minted more tokens", async () => {
      const balance = await votingToken.balanceOf(addr0);
      assert.equal(balance.toString(), ethers.utils.parseEther("20000").toString());
    });
  });
});
