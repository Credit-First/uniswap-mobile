/**
 * dependencies:
 * "web3": "^1.6.1"
 * "ethereumjs-tx": "^2.1.2",
 * "ethereumjs-util": "^7.1.3",
 */
import Web3 from 'web3';
import { toBuffer } from 'ethereumjs-util';
import { Transaction as EthereumTx } from 'ethereumjs-tx';
import Common from 'ethereumjs-common';
import { ethers } from 'ethers';
const tokenABI = require('./abi.json');

const ethEndpoint = 'https://mainnet.infura.io/v3/2b2ef31c5ecc4c58ac7d2a995688806c';
const bscEndpoint = 'https://speedy-nodes-nyc.moralis.io/bc13383d2e304f8cc8589928/bsc/mainnet';
const polygonEndpoint = "https://speedy-nodes-nyc.moralis.io/bc13383d2e304f8cc8589928/polygon/mainnet"
const ethWeb3 = new Web3(new Web3.providers.HttpProvider(ethEndpoint));
const bscWeb3 = new Web3(new Web3.providers.HttpProvider(bscEndpoint));
const polygonWeb3 = new Web3(new Web3.providers.HttpProvider(polygonEndpoint));

const getWeb3 = (chainName) => {
  let ret;
  switch (chainName) {
    case "ETH":
      ret = ethWeb3;
      break;
    case "BNB":
      ret = bscWeb3;
      break;
    case "MATIC":
      ret = polygonWeb3;
      break;
    default:
      ret = ethWeb3;
  }

  return ret;
}

const getChainId = (chainName) => {
  let ret = 1;
  switch (chainName) {
    case "ETH":
      ret = 1;
      break;
    case "BNB":
      ret = 56;
      break;
    case "MATIC":
      ret = 137;
      break;
    default:
      ret = 1;
  }

  return ret;
}

const getNodeUrl = (chainName) => {
  let ret = ethEndpoint;
  switch (chainName) {
    case "ETH":
      ret = ethEndpoint;
      break;
    case "BNB":
      ret = bscEndpoint;
      break;
    case "MATIC":
      ret = polygonEndpoint;
      break;
    default:
      ret = ethEndpoint;
  }

  return ret;
}

/**
 * Web3 Custom Module
 */
export const web3TokenInfoModule = () => {
  return {
    /**
     * Get token name
     * @param {String} chainName
     */
    getName: async (chainName, tokenAddress) => {
      const web3 = getWeb3(chainName);
      const contract = new web3.eth.Contract(tokenABI, tokenAddress);
      const result = await contract.methods.name().call();
      return result;
    },
    /**
     * Get symbol name
     * @param {String} chainName
     */
    getSymbol: async (chainName, tokenAddress) => {
      const web3 = getWeb3(chainName);
      const contract = new web3.eth.Contract(tokenABI, tokenAddress);
      const result = await contract.methods.symbol().call();
      return result;
    },
    /**
     * Get decimal
     * @param {String} chainName
     */
    getDecimals: async (chainName, tokenAddress) => {
      const web3 = getWeb3(chainName);
      const contract = new web3.eth.Contract(tokenABI, tokenAddress);
      const result = await contract.methods.decimals().call();
      return result;
    },
  }
}

/**
 * Web3 Custom Module
 * @param {Array} tokenABI
 * @param {String} tokenAddress
 * @param {Number} decimals
 */
const web3CustomModule = ({ tokenABI, tokenAddress, decimals }) => {
  if (!decimals) {
    decimals = 18;
  }

  return {
    /**
     * Get Keypair from privateKey
     * @param {String} privateKey
     */
    createKeyPair: async (chainName, privateKey) => {
      return getWeb3(chainName).eth.accounts.privateKeyToAccount(privateKey)
    },
    /**
     * Get current gas price
     */
    getCurrentGasPrice: async (chainName) => getWeb3(chainName).eth.getGasPrice(),
    /**
     * Get current eth gas price
     */
     getCurrentETHGasLimit: async (chainName, account, amount, toAddress) => {
      const web3 = getWeb3(chainName);
      const tx = {
        from: account.address,
        to: toAddress,
        value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
      };

      return getWeb3(chainName).eth.estimateGas(tx);
    },
    /**
     * Get current token gas price
     */
    getCurrentTokenGasLimit: async (chainName, account, amount, toAddress) => {
      const web3 = getWeb3(chainName);
      const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress, {
        from: account.address
      });
      const realAmount = ethers.utils.parseUnits(amount, decimals);
      const transactionData = tokenContract.methods
        .transfer(toAddress, realAmount.toHexString())
        .encodeABI();

      const tx = {
        from: account.address,
        to: tokenAddress,
        data: transactionData,
      };

      return getWeb3(chainName).eth.estimateGas(tx);
    },
    /**
     * Transfer ETH from account to toAddress
     * @param {Keypair} account
     * @param {String} toAddress
     * @param {Number} amount
     * @param {Number} gasLimit
     * @param {Number} gasPrice
     */
    transferETH: async (chainName, account, toAddress, amount, gasLimit = 21000, gasPrice = 20000000000) => {
      if (toAddress === undefined || toAddress.length !== 42 || getWeb3(chainName).utils.isAddress(toAddress) === false) {
        console.error('The Ethereum address you entered is not valid!');
        return new Error('wrong address');
      }
      if (amount <= 0) {
        console.error('The amount is not valid!');
        return new Error('Wrong amount');
      }

      const chainId = getChainId(chainName);
      const providerURL = getNodeUrl(chainName);
      const FORK_NETWORK = Common.forCustomChain(
        'mainnet',
        {
          name: chainName,
          networkId: chainId,
          chainId: chainId,
          url: providerURL,
        },
        'istanbul',
      );

      const privateKey = toBuffer(account.privateKey);
      const count = await getWeb3(chainName).eth.getTransactionCount(account.address);
      const rawTransaction = {
        from: account.address,
        to: toAddress,
        value: getWeb3(chainName).utils.toHex(amount * 1000000000000000000),
        gasPrice: getWeb3(chainName).utils.toHex(gasPrice),
        gasLimit: getWeb3(chainName).utils.toHex(gasLimit),
        nonce: getWeb3(chainName).utils.toHex(count)
      };

      const tx = new EthereumTx(rawTransaction, { common: FORK_NETWORK });
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      return getWeb3(chainName).eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    },
    /**
     * Transfer ERC20 from account to toAddress
     * @param {Keypair} account
     * @param {String} toAddress
     * @param {Number} amount
     * @param {Number} gasLimit
     * @param {Number} gasPrice
     */
    transterERC20: async (chainName, account, toAddress, amount, gasLimit = 300000, gasPrice = 20000000000) => {
      const web3 = getWeb3(chainName);
      const contract = new web3.eth.Contract(tokenABI, tokenAddress, {
        from: account.address
      });

      
      const chainId = getChainId(chainName);
      const providerURL = getNodeUrl(chainName);
      const FORK_NETWORK = Common.forCustomChain(
        'mainnet',
        {
          name: chainName,
          networkId: chainId,
          chainId: chainId,
          url: providerURL,
        },
        'istanbul',
      );

      const privateKey = toBuffer(`0x${account.privateKey}`);
      const count = await web3.eth.getTransactionCount(account.address);

      const rawTransaction = {
        from: account.address,
        nonce: web3.utils.toHex(count),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        to: tokenAddress,
        value: '0x0',
        data: contract.methods.transfer(toAddress, web3.utils.toBN(amount * Math.pow(10, decimals))).encodeABI(),
      };

      const tx = new EthereumTx(rawTransaction, { common: FORK_NETWORK });

      tx.sign(privateKey);
      const serializedTx = tx.serialize();

      return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    },
    /**
     * Get Balance of ETH of account
     * @param {String} address
     */
    getBalanceOfAccount: async (chainName, address) => {
      return getWeb3(chainName).eth.getBalance(address);
    },
    /**
     * Get Balance ot Token of account
     * @param {String} address
     */
    getBalanceOfTokenOfAccount: async (chainName, address) => {
      const web3 = getWeb3(chainName);
      const contract = new web3.eth.Contract(tokenABI, tokenAddress);
      const amount = await contract.methods.balanceOf(address).call();
      const realAmount = ethers.utils.formatUnits(amount, decimals);
      return realAmount;
    }
  };
};

export default web3CustomModule;
