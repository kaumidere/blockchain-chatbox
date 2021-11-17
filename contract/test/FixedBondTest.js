/* eslint-disable */

const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

use(solidity);

const SecondsInMonth = 86400 * 30;

describe('Fixed Bond Contract', function () {
  it('Defining Generals', async function () {
    // General
    provider = ethers.provider;
    accounts = await hre.ethers.getSigners();

    await ethers.provider.send('evm_setNextBlockTimestamp', [Date.now()]);
    await ethers.provider.send('evm_mine');
  });

  it('Deploying Contracts', async function () {
    const Token = await ethers.getContractFactory('ERC20Token');
    token = await Token.deploy(
      'Tok',
      'TOK',
      ethers.utils.parseEther('100000000000000')
    );

    await token.deployed();

    const FixedBondContract = await ethers.getContractFactory('FixedBond');
    fixedBondContract = await FixedBondContract.deploy(token.address);
    await fixedBondContract.deployed();
  });

  it('Setup Bond', async function () {
    await fixedBondContract.setupBond(
      true,
      3,
      6,
      9,
      12,
      ethers.utils.parseEther('100')
    );

    const bondInfo = await fixedBondContract.bondInfo();
    expect(bondInfo.minimumDeposit).to.equal(ethers.utils.parseEther('100'));
  });

  it('Deposit Rewards', async function () {
    await token.approve(
      fixedBondContract.address,
      ethers.utils.parseEther('10000000')
    );

    await fixedBondContract.depositRewards(ethers.utils.parseEther('1000'));

    const rewardsBalance = await fixedBondContract.rewardsBalance();
    expect(rewardsBalance).to.equal(ethers.utils.parseEther('1000'));
  });

  it('Transfer Tokens to Account 2', async function () {
    await token.transfer(accounts[2].address, ethers.utils.parseEther('1000'));

    balance = await token.balanceOf(accounts[2].address);
    expect(balance).to.equal(ethers.utils.parseEther('1000'));
  });

  it('Deposit in bond', async function () {
    await token
      .connect(accounts[2])
      .approve(fixedBondContract.address, ethers.utils.parseEther('1000000'));

    await fixedBondContract
      .connect(accounts[2])
      .deposit(ethers.utils.parseEther('1000'), 3);

    const userInfo = await fixedBondContract.userInfo(accounts[2].address);
    expect(userInfo.amountDeposited).to.equal(ethers.utils.parseEther('1000'));
  });

  it('Calculate Rewards after 1 month', async function () {
    await ethers.provider.send('evm_increaseTime', [SecondsInMonth]);
    await ethers.provider.send('evm_mine');

    const rewards = await fixedBondContract.calculateRewards(
      accounts[2].address
    );

    expect(rewards).to.equal(ethers.utils.parseEther('20'));
  });

  it('Calculate Rewards after 2 months', async function () {
    await ethers.provider.send('evm_increaseTime', [SecondsInMonth]);
    await ethers.provider.send('evm_mine');

    const rewards = await fixedBondContract.calculateRewards(
      accounts[2].address
    );

    expect(rewards).to.equal(ethers.utils.parseEther('40'));
  });

  it('Calculate Rewards after 3 months', async function () {
    await ethers.provider.send('evm_increaseTime', [SecondsInMonth]);
    await ethers.provider.send('evm_mine');

    const rewards = await fixedBondContract.calculateRewards(
      accounts[2].address
    );

    expect(rewards).to.equal(ethers.utils.parseEther('60'));
  });

  it('Calculate Rewards after 4 months', async function () {
    await ethers.provider.send('evm_increaseTime', [SecondsInMonth]);
    await ethers.provider.send('evm_mine');

    const rewards = await fixedBondContract.calculateRewards(
      accounts[2].address
    );
    expect(rewards).to.equal(ethers.utils.parseEther('60'));
  });

  it('Withdraw', async function () {
    await fixedBondContract.connect(accounts[2]).withdraw();
    balance = await token.balanceOf(accounts[2].address);
    expect(balance).to.equal(ethers.utils.parseEther('1060'));
  });
});
