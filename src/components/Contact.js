import React, { Component } from "react";
import blockChainConnector from "../utils/BlockChainConnector";
import Web3 from 'web3';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWalletAvailable: false,
      isWalletUnlocked: false,
      walletAccount: '',
      balance: 0
    };
  }

componentDidMount() {

  blockChainConnector.isAvailable()
  .catch(e => (this.setState({isWalletAvailable: false})))
  .then((r) => (this.setState({isWalletAvailable: r})));
  

  blockChainConnector.isUnlocked()
  .catch(e => (this.setState({isWalletUnlocked: false})))
  .then(r => (this.setState({isWalletUnlocked: r})));
  
  blockChainConnector.defaultAccount()
  .catch(e => (this.setState({walletAccount: ''})))
  .then((r) => 
  
{
  this.setState({walletAccount: r});
  if(this.state.walletAccount!==""){
    blockChainConnector.getBalance(this.state.walletAccount)
    .then((r) => (this.setState({balance: r})));
  }
}
  );
  
}


  render() {
   
    if (this.state.isWalletAvailable && this.state.isWalletUnlocked) {
      return (
        <div>
          <p>Wallet</p>
          <p>Metamask is available</p>
          <p>Wallet address: {this.state.walletAccount}</p>
          <p>Wallet balance: {this.state.balance}</p>
          
        </div>
      );
    }

    return (
      <div>
        <p>Wallet</p>
        <p>
          You need metamask wallet installed and logged in to use this feature.
        </p>
      </div>
    );
  }
}

export default Contact;
