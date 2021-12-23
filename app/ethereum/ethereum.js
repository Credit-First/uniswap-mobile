/**
 * dependencies:
 * "web3": "^1.6.1"
 * "ethereumjs-tx": "^2.1.2",
 * "ethereumjs-util": "^7.1.3",
 */
import Web3 from 'web3';
import { toBuffer } from 'ethereumjs-util';
import { Transaction as EthereumTx } from 'ethereumjs-tx';
const web3 = new Web3();
/**
 * Web3 Custom Module
 * @param {String} url 
 * @param {String} chainName
 * @param {Array} tokenABI
 * @param {String} tokenAddress
 * @param {Number} decimals
 */
const web3CustomModule = ({ url, chainName, tokenABI, tokenAddress, decimals }) => {
  web3.setProvider(new web3.providers.HttpProvider(url));
  if (!chainName) {
    chainName = 'mainnet';
  }
  if (!decimals) {
    decimals = 18;
  }
  return {
    /**
     * Get Keypair from privateKey
     * @param {String} privateKey
     */
    createKeyPair: async privateKey => web3.eth.accounts.privateKeyToAccount(privateKey),
    /**
     * Get current gas price
     */
    getCurrentGasPrice: async () => web3.eth.getGasPrice(),
    /**
     * Transfer ETH from account to toAddress
     * @param {Keypair} account
     * @param {String} toAddress
     * @param {Number} amount
     * @param {Number} gasLimit
     * @param {Number} gasPrice
     */
    transferETH: async (account, toAddress, amount, gasLimit = 21000, gasPrice = 20000000000) => {
      if (toAddress === undefined || toAddress.length !== 42 || web3.utils.isAddress(toAddress) === false) {
        console.error('The Ethereum address you entered is not valid!');
        return new Error('wrong address');
      }
      if (amount <= 0) {
        console.error('The amount is not valid!');
        return new Error('Wrong amount');
      }
      const privateKey = toBuffer(account.privateKey);
      const count = await web3.eth.getTransactionCount(account.address);
      const rawTransaction = {
        from: account.address,
        to: toAddress,
        value: web3.utils.toHex(amount * 1000000000000000000),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        nonce: "0x" + count.toString(16)
      };
      const tx = new EthereumTx(rawTransaction, { 'chain': chainName });
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    },
    /**
     * Transfer ERC20 from account to toAddress
     * @param {Keypair} account
     * @param {String} toAddress
     * @param {Number} amount
     * @param {Number} gasLimit
     * @param {Number} gasPrice
     */
    transterERC20: async (account, toAddress, amount, gasLimit = 300000, gasPrice = 20000000000) => {
      const contract = new web3.eth.Contract(tokenABI, tokenAddress, {
        from: account.address
      });
      const count = await web3.eth.getTransactionCount(account.address);
      const rawTransaction = {
        "from": account.address,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": tokenAddress,
        "value": '0x0',
        "data": contract.methods.transfer(toAddress, web3.utils.toBN(amount * Math.pow(10, decimals))).encodeABI(),
      };
      const privateKey = toBuffer(account.privateKey);
      const tx = new EthereumTx(rawTransaction, { chain: chainName });
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    },
    /**
     * Get Balance of ETH of account
     * @param {String} address
     */
    getBalanceOfAccount: async address => {
      return web3.eth.getBalance(address)
    },
    /**
     * Get Balance ot Token of account
     * @param {String} address
     */
    getBalanceOfTokenOfAccount: async (address) => {
      const contract = new web3.eth.Contract(tokenABI, tokenAddress);
      return contract.methods.balanceOf(address).call()
    }
  };
};

export default web3CustomModule;
