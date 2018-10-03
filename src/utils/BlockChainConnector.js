import { CONTRACT_ADDRESS } from "./constants";
import Web3 from "web3";

var web3;
const Eth = require("ethjs-query");
const EthContract = require("ethjs-contract");
const PocAbi = require("./pocAbi.json");


class BlockChainConnector {
   
  constructor() {
    web3 = window.web3;
  }

  provider() {
    // return web3.currentProvider;
    return window.web3;
  }

  isAvailable() {
    
    return new Promise((resolve, reject) => {
      if (typeof web3 !== "undefined" && web3.currentProvider.isMetaMask) {
        web3 = new Web3(web3.currentProvider);

        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
  isUnlocked() {
   
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accounts) => {
        if (err !== null) {
          reject(err);
        } else if (accounts.length === 0) {
          resolve(false);
        } else {
 
          resolve(true);
          
        }
      });
    });
  }

  defaultAccount() {
   
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accounts) => {
        if (err !== null) {
          reject(err);
        } else if (accounts.length === 0) {
          resolve('');
        } else {
           
          resolve(accounts[0]);
        }
      });
    });
  }

  getBalance(acc) {
      
    return new Promise((resolve, reject) => {
        
      web3.eth.getBalance(acc, (err, balance) => {
        if (err !== null) {
          reject(err);
        } else {
          const _balance = web3.utils.fromWei(balance, 'ether');
          resolve(_balance);
        }
      });
    });
  }

  signData(data, address) {
    return new Promise((resolve, reject) => {
      const method = "personal_sign";
      const params = [
        web3.utils.toHex(data),
        web3.utils.toChecksumAddress(address)
      ];
      web3.currentProvider.sendAsync(
        {
          method,
          params,
          address
        },
        (err, result) => {
          if (err !== null) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  transact(transaction, callback) {
    // return web3.eth.sendTransaction(transaction);
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction(transaction, (err, response) => {
        console.log("The Metamask Transaction", transaction);
        if (err !== null) {
          reject(err);
        } else {
          if (callback) {
            callback(err, response);
          }
          resolve(null);
        }
      });
    });
  }

  checkMainNetwork() {
    return new Promise((resolve, reject) => {
      web3.version.getNetwork((err, netId) => {
        if (err !== null) {
          reject(err);
        } else if (netId === "1") {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  registerPublicKey(key) {
    const eth = new Eth(this.provider);
    const contract = new EthContract(eth);
    const pocContract = contract(PocAbi).at(CONTRACT_ADDRESS);
    return pocContract.register(key, {
      from: this.defaultAccount,
      value: "0x00"
    });
  }

  registerUpload(uploadType, version, userKey, checksum) {
    const eth = new Eth(this.provider);
    const contract = new EthContract(eth);
    const pocContract = contract(PocAbi).at(CONTRACT_ADDRESS);
    return pocContract.uploadData(uploadType, version, userKey, checksum, {
      from: this.defaultAccount,
      value: "0x00"
    });
  }

  async waitForTransaction(txHash) {
    const getTransactionReceipt = () => {
      return new Promise((res, rej) => {
        web3.eth.getTransactionReceipt(txHash, (err, result) => {
          if (err !== null) {
            rej(err);
          }
          res(result);
        });
      });
    };

    let txReceipt;
    while (!txReceipt) {
      txReceipt = await getTransactionReceipt();
      console.log("The Transaction Receipt", txReceipt);
    }
    console.log("The Transaction Receipt", txReceipt);
    return txReceipt;
  }

  toChecksumAddress(address) {
    return web3.toChecksumAddress(address);
  }

  disconnect() {}
}

const blockChainConnector = new BlockChainConnector();
export default blockChainConnector;
