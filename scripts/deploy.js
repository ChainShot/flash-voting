async function main() {
  const [addr0] = await ethers.provider.listAccounts();
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
