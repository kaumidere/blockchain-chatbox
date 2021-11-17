// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// @title A contract to simulate Real World Bonds / Fixed Deposits
// @author Marvel
// @notice You can use this contract for only the most basic simulation
// @dev All function calls are currently implemented without side effects
// @custom:experimental This is an experimental contract.
contract FixedBond is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    address public token;

    // Event triggered when owner adds rewards to the contract
    event RewardsAdded(uint256 _value);

    // Event triggered when user withdraws the deposited tokens
    event TokensWithdrawn(address indexed _from);

    // Event triggered when user deposits tokens
    event TokensDeposited(address indexed _from, uint256 _value);

    // ERC20 token address should be passed to the constructor while deployment
    constructor(address _token) {
        token = _token;
    }

    // Bond information struct
    // isActive -> whether the bond is active oor not a boolean tru or false
    // interestOneMonth -> total interest users get if they deposit for 1 month
    // interestThreeMonth -> total interest users get if they deposit for 3 months
    // interestSixMonth -> total interest users get if they deposit for 6 months
    // interestTwelveMonth -> total interest users get if they deposit for 12 months
    // minimumDeposit -> Minimum tokens user needs to deposit in the bond to earn interest
    struct BondInfo {
        bool isActive;
        uint256 interestOneMonth;
        uint256 interestThreeMonth;
        uint256 interestSixMonth;
        uint256 interestTwelveMonth;
        uint256 minimumDeposit;
    }

    // User information struct
    // amountDeposited -> amount deposited by the user
    // depositedOn -> timestamp when the user deposited the amount
    // lockPeriod -> time for the user wants to lock the amount in the bond (1, 3, 6, 12)
    struct UserInfo {
        uint256 amountDeposited;
        uint256 depositedOn;
        uint256 lockPeriod;
    }

    // Rewards balance of the contract
    uint256 public rewardsBalance = 0;

    // bondInfo -> Information about the bond
    BondInfo public bondInfo;

    // user address => tierId => tokensBought
    mapping(address => UserInfo) public userInfo;

    // Setting up the Bond for the first time on the contract
    // Parameters are the struct parameters for BondInfo
    // Can only be called by owner
    function setupBond(
        bool _isActive,
        uint256 _interestOneMonth,
        uint256 _interestThreeMonth,
        uint256 _interestSixMonth,
        uint256 _interestTwelveMonth,
        uint256 _minimumDeposit
    ) external onlyOwner {
        bondInfo.isActive = _isActive;
        bondInfo.interestOneMonth = _interestOneMonth;
        bondInfo.interestThreeMonth = _interestThreeMonth;
        bondInfo.interestSixMonth = _interestSixMonth;
        bondInfo.interestTwelveMonth = _interestTwelveMonth;
        bondInfo.minimumDeposit = _minimumDeposit;
    }

    // Updating the Bond
    // Can only activate or deactivate the bond and change minimum deposit
    // Can only be called by owner
    function updateBond(bool _isActive, uint256 _minimumDeposit)
        external
        onlyOwner
    {
        bondInfo.isActive = _isActive;
        bondInfo.minimumDeposit = _minimumDeposit;
    }

    // Deposit tokens in the rewards pool
    // Can only be called by owner
    function depositRewards(uint256 _amount) public onlyOwner {
        require(_amount > 0, "Amount has to be greater than zero");
        rewardsBalance = rewardsBalance.add(_amount);
        IERC20(token).transferFrom(msg.sender, address(this), _amount);
        emit RewardsAdded(_amount);
    }

    // Deposit tokens in the bond
    // Input params -> Amount and the time in months for which the user wants to lock the tokens in the bond
    function deposit(uint256 _amount, uint256 _timeInMonths) public {
        require(bondInfo.isActive, "Bond is inactive");
        require(_timeInMonths >= 1, "Minimum time one month");
        require(_timeInMonths < 13, "Maximum time twelve months");
        require(_amount > 0, "Amount has to be greater than zero");
        require(
            userInfo[msg.sender].amountDeposited == 0,
            "Deposit already active"
        );
        userInfo[msg.sender].amountDeposited = _amount;
        userInfo[msg.sender].depositedOn = block.timestamp;
        userInfo[msg.sender].lockPeriod = _timeInMonths;
        IERC20(token).transferFrom(msg.sender, address(this), _amount);
        emit TokensDeposited(msg.sender, _amount);
    }

    // Calculate the rewards user has accumulated until now
    function calculateRewards(address _address) public view returns (uint256) {
        if (userInfo[_address].amountDeposited == 0) return 0;
        uint256 daysPassed = (block.timestamp -
            userInfo[_address].depositedOn) / 1 days;
        if (daysPassed == 0) return 0;
        uint256 lockPeriod = userInfo[_address].lockPeriod;
        if (daysPassed > lockPeriod * 30) {
            daysPassed = lockPeriod * 30;
        }
        uint256 rewards = userInfo[_address]
            .amountDeposited
            .mul(daysPassed)
            .div(30);
        if (lockPeriod == 1) {
            rewards = rewards.mul(bondInfo.interestOneMonth).div(100);
        } else if (lockPeriod == 3) {
            rewards = rewards.mul(bondInfo.interestThreeMonth).div(3).div(100);
        } else if (lockPeriod == 6) {
            rewards = rewards.mul(bondInfo.interestSixMonth).div(6).div(100);
        } else if (lockPeriod == 12) {
            rewards = rewards.mul(bondInfo.interestTwelveMonth).div(12).div(
                100
            );
        }
        return rewards;
    }

    // Withdraw tokens without caring about interest
    function emergencyWithdraw() public {
        require(userInfo[msg.sender].amountDeposited > 0, "No active deposit");
        IERC20(token).transfer(
            msg.sender,
            userInfo[msg.sender].amountDeposited
        );
        delete userInfo[msg.sender];
        emit TokensWithdrawn(msg.sender);
    }

    // Withdraw tokens after maturity, and also get the interest earned
    function withdraw() public {
        require(userInfo[msg.sender].amountDeposited > 0, "No active deposit");
        uint256 daysPassed = (block.timestamp -
            userInfo[msg.sender].depositedOn) / 1 days;
        require(
            daysPassed > userInfo[msg.sender].lockPeriod * 30,
            "Cant withdraw before maturity"
        );
        uint256 rewards = calculateRewards(msg.sender);
        require(rewardsBalance >= rewards, "Not enough rewards in contract");
        uint256 totalAmount = userInfo[msg.sender].amountDeposited.add(rewards);
        IERC20(token).transfer(msg.sender, totalAmount);
        rewardsBalance = rewardsBalance.sub(rewards);
        delete userInfo[msg.sender];
        emit TokensWithdrawn(msg.sender);
    }
}
