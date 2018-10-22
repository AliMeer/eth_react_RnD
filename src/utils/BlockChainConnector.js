import { CONTRACT_ADDRESS } from "./constants";
import Web3 from "web3";
import { MAINNET_CONTRACT_ADDRESS } from './constants'

var contractAddress = MAINNET_CONTRACT_ADDRESS
var web3;
const Eth = require("ethjs-query");
const EthContract = require("ethjs-contract");
const PocAbi = require("./pocAbi.json");


class BlockChainConnector {
   
  constructor() {
    web3 = window.web3;
  }

  //Return the current web3 object from the browser
  provider() {
    return window.web3;
  }

  //Check if a ether wallet extension is installed on the browser
  //Also check if the wallter extension is Metamask
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

  //Check if the wallet extension is logged in 
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

  //Get the public addressof the user's wallet

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

  //Get the number of ether in the user's wallet
  getBalance(acc) {
      
    return new Promise((resolve, reject) => {
        
      web3.eth.getBalance(acc, (err, balance) => {
        if (err !== null) {
          reject(err);
        } else {
          //const _balance = web3.utils.fromWei(balance, 'ether');
          resolve(balance);
        }
      });
    });
  }

getOMXBalance(walletAddress) {
  console.log("Inside getOMXBalance");
  let minABI = [
      // balanceOf
      {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
      },
      // decimals
      {
        "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "type":"function"
      }
    ];
    return new Promise((resolve, reject) => {
        
      //  OMX Token contract
    let contract = web3.eth.contract(minABI).at(contractAddress);
    // calling OMX contract method to get balance
    contract.balanceOf(walletAddress, (error, balance) => {

      
        if (error !== null) {
          console.log("Inside getOMXBalance Error");
          reject(error);
        } else {
          //const _balance = web3.utils.fromWei(balance, 'ether');
          console.log("Inside Resolve " + balance);
          resolve(balance);
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
