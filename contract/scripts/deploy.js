/* eslint-disable */

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  let NAME = 'Tok';
  let SYMBOL = 'TOK';
  let SUPPLY = ethers.utils.parseEther('10000000000000');

  //^^^^^^^^^^^^^^^^^^^^^^^^^^ DEPLOYMENT TOKEN ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  /**
   * Params
   * NAME
   * SYMBOL
   * SUPPLY
   */

  // We get the contract to deploy
  const Token = await ethers.getContractFactory('ERC20Token');
  token = await Token.deploy(NAME, SYMBOL, SUPPLY);

  await token.deployed();

  console.log('Token deployed to:', token.address);

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DEPLOYMENT FIXED BOND CONTRACT ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  /**
   * Params
   * Address - Token
   */

  // We get the contract to deploy
  const FixedBond = await ethers.getContractFactory('FixedBond');

  fixedBond = await FixedBond.deploy(token.address);

  await fixedBond.deployed();

  console.log('Fixed Bond Contract deployed to:', fixedBond.address);

  // vvvvvvvvvvvvvvvvvvvvvvvvv VERIFICATION vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

  // Deploy the contract first then pick up the addresses, replace them below and then run the script again
  // Conmment the part above which is for deploy while verifying

  // await hre.run('verify:verify', {
  //   address: token.address,
  //   constructorArguments: [NAME, SYMBOL, SUPPLY],
  // });
  // await hre.run('verify:verify', {
  //   address: fixedBond.address,
  //   constructorArguments: [token.address],
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
