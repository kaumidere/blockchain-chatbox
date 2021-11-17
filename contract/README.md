# FIXED BOND CONTRACT DEPLOYED

<a href="https://kovan.etherscan.io/address/0xF753E11Ef6b4DAdEFDD1fd442089Cd5e71dEC7Ca#code">https://kovan.etherscan.io/address/0xF753E11Ef6b4DAdEFDD1fd442089Cd5e71dEC7Ca#code</a>

# TOKEN CONTRACT DEPLOYED

<a href="https://kovan.etherscan.io/address/0x02A316bBf3A4E92e26E42b6C6fC8b7b33aA33965#code">https://kovan.etherscan.io/address/0x02A316bBf3A4E92e26E42b6C6fC8b7b33aA33965</a>

# INSTALL DEPENDENCIES

```shell
git clone https://github.com/grape404/RCB-BlockchainAus.git
```

Enter into the the main folder.

```shell
npm install
```

# RUN TEST LOCALLY

```shell
npx hardhat test
```

# CONFIGURE THE DEPLOYMENT

In this project, copy the .env.template file to a file named .env, and then edit it to fill in the details. Enter your Etherscan, Polygonscan API key, your Rinkeby and Matic node URL (eg from Alchemy or Infura), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

Adjust the contract deployment settings!
<b>scripts/deploy.js</b>

To get the Etherscan API key, go to
<a href="https://etherscan.io/myapikey"> https://etherscan.io/myapikey</a>

# DEPLOY ON TESTNET

```shell
npx hardhat run --network kovan scripts/deploy.js
```
