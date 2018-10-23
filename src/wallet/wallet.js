import React, { Component } from "react";
import blockChainConnector from "../utils/BlockChainConnector";
import { MAINNET_INFO,RINKEBY_INFO } from "../utils/constants";

const ETHERNET = RINKEBY_INFO;
class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWalletAvailable: false,
      isWalletUnlocked: false,
      walletAccount: "",
      EtherBalance: 0,
      OMXBalance: 0,
      EtherGBP: 0,
      OMXGBP: 0,
      TxnList: null
    };
  }

  formattedDate(epoch) {
    var myDate = new Date(epoch * 1000);
    return myDate.toDateString();
  }
  renderTransactions(Txn, index) {
      var displayAddress = '';
      var reason = '';
      if(Txn.from == this.state.walletAccount) {
        displayAddress="TO: " + Txn.to;
        reason = "Debit";
      }
      else {
        displayAddress="FROM: " + Txn.from;
        reason = "Credit";
      }
    return (
      <li key={index}>
        <span className="dt">{this.formattedDate(Txn.timeStamp)}</span>
        <span className="wa">{displayAddress}</span>
        <span className="reasonD">{reason}</span>
        <span className="counterVD">
          {parseFloat(Txn.value/10**8).toFixed(3)}
        </span>
        <span className="amountD">
          {parseFloat((Txn.value/10**8 ) * this.state.OMXGBP).toFixed(3)}
        </span>
      </li>
    );
  }
  componentDidMount() {
    blockChainConnector
      .isAvailable()
      .catch(e => this.setState({ isWalletAvailable: false }))
      .then(r => this.setState({ isWalletAvailable: r }));

    blockChainConnector
      .isUnlocked()
      .catch(e => this.setState({ isWalletUnlocked: false }))
      .then(r => this.setState({ isWalletUnlocked: r }));

    blockChainConnector
      .defaultAccount()
      .catch(e => this.setState({ walletAccount: "" }))
      .then(r => {
        this.setState({ walletAccount: r });
        if (this.state.walletAccount !== "") {
          blockChainConnector
            .getBalance(this.state.walletAccount)
            .then(r => this.setState({ EtherBalance: r }));
        }
        if (this.state.walletAccount !== '') {
          blockChainConnector
            .getOMXBalance(ETHERNET.CONTRACT_ADDRESS, this.state.walletAccount)
            .then(r => this.setState({ OMXBalance: r }));
        
        //As there is a wallet address available,
        //Get the latest OMX transactions for this address
        console.log("API URL IS: " + ETHERNET.API_URL_TXN +
        "&contractaddress=" +
        ETHERNET.CONTRACT_ADDRESS +
        "&address=" +
        this.state.walletAccount);
    fetch(
        ETHERNET.API_URL_TXN +
        "&contractaddress=" +
        ETHERNET.CONTRACT_ADDRESS +
        "&address=" +
        this.state.walletAccount,
      {
        headers: {
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000"
        }
      }
    )
      .catch(e => console.log(e))
      .then(response => response.json())
      .then(data => this.setState({ TxnList: data.result }));
        
        }
      });

    //Fetch Market price of OMX in GBP per token
    fetch(
        ETHERNET.API_URL_RATE_ROOT +
        ETHERNET.TICKER_ID_OMX +
        ETHERNET.GBP_OPTION,
      {
        headers: {
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    )
      .then(response => response.json())
      .then(data => this.setState({ OMXGBP: data.data.quotes.GBP.price }));

    //Fetch Market price of Ether in GBP per Ether
    fetch(
        ETHERNET.API_URL_RATE_ROOT +
        ETHERNET.TICKER_ID_ETH +
        ETHERNET.GBP_OPTION,
      {
        headers: {
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000"
        }
      }
    )
      .then(response => response.json())
      .then(data => this.setState({ EtherGBP: data.data.quotes.GBP.price }));
      
    //Fetch Previous Transactions
    if(this.state.walletAccount!=''){
    console.log("API URL IS: " + ETHERNET.API_URL_TXN +
        "&contractaddress=" +
        ETHERNET.CONTRACT_ADDRESS +
        "&address=" +
        this.state.walletAccount);
    fetch(
        ETHERNET.API_URL_TXN +
        "&contractaddress=" +
        ETHERNET.CONTRACT_ADDRESS +
        "&address=" +
        this.state.walletAccount,
      {
        headers: {
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000"
        }
      }
    )
      .catch(e => console.log(e))
      .then(response => response.json())
      .then(data => this.setState({ TxnList: data.result }));}
  }

  render() {
    if (this.state.isWalletAvailable && this.state.isWalletUnlocked) {
      return (
        <div className="common wallet">
          <section className="introduction">
            <div className="widthContain leftAlign">
              <h2>Manage your OMX wallet here</h2>
              <p>
                Everytime you share your DNA data with an organisation you
                receive compensation in OMX tokens. These tokens can be used to
                purchase DNA Kits and other products from our shop.
              </p>
            </div>
          </section>

          <section className="wallet-currency clearfix">
            <div className="widthContain">
              <div className="balance">
                <span>BALANCE</span>
                OMX{" "}
                <em>
                  {parseFloat(this.state.OMXBalance/10**8 ).toFixed(3)}
                </em>
              </div>

              <div className="counterValue">
                <span>COUNTERVALUE</span>
                GBP{" "}
                <em>
                  {parseFloat(
                    (this.state.OMXBalance/10**8 ) * this.state.OMXGBP
                  ).toFixed(3)}
                </em>
              </div>
              <div className="balance">
                <span>BALANCE</span>
                Ether{" "}
                <em>
                  {parseFloat(this.state.EtherBalance / 10 ** 18).toFixed(3)}
                </em>
              </div>

              <div className="counterValue">
                <span>COUNTERVALUE</span>
                GBP{" "}
                <em>
                  {parseFloat(
                    (this.state.EtherBalance / 10 ** 18) * this.state.EtherGBP
                  ).toFixed(3)}
                </em>
              </div>
            </div>
          </section>

          <section className="main-content clearfix">
            <div className="walletData received widthContain">
              <h3>TRANSACTION HISTORY</h3>
              <ul>
                <li className="dataHead">
                  <span className="dt">DATE AND TIME</span>
                  <span className="wa">WALLET ADDRESS</span>
                  <span className="reasonD">REASON</span>
                  <span className="counterVD">TOKENS</span>
                  <span className="amountD">Amount(GBP)</span>
                </li>
                {console.log("TxnList is: "+ this.state.TxnList)}
                {
                    this.state.TxnList
                  ? 
                  this.state.TxnList.map((Txn, index) =>
                      this.renderTransactions(Txn, index)
                    )
                  : 
                  ""}
              </ul>
            </div>
          </section>
        </div>
      );
    }

    if (!this.state.isWalletAvailable || !this.state.isWalletUnlocked) {
      return (
        <div className="common wallet">
          <section className="introduction">
            <div className="widthContain leftAlign">
              <h2>Manage your OMX wallet here</h2>
              <p>
                Everytime you share your DNA data with an organisation you
                receive compensation in OMX tokens. These tokens can be used to
                purchase DNA Kits and other products from our shop.
              </p>
            </div>
          </section>

          <section className="wallet-currency clearfix">
            <div className="widthContain">
              <div className="balance">
                <span>BALANCE</span>
                OMX <em>N/A</em>
              </div>

              <div className="counterValue">
                <span>COUNTERVALUE</span>
                GBP <em>N/A</em>
              </div>
              <div className="balance">
                <span>BALANCE</span>
                Ether <em>N/A</em>
              </div>

              <div className="counterValue">
                <span>COUNTERVALUE</span>
                GBP <em>N/A</em>
              </div>
            </div>
          </section>

          <section className="main-content clearfix">
            <div className="walletData received widthContain">
              <h3>TRANSACTION HISTORY</h3>
              <ul>
                <li className="dataHead">
                  <span className="dt">DATE AND TIME</span>
                  <span className="wa">WALLET ADDRESS</span>
                  <span className="reasonD">REASON</span>
                  <span className="counterVD">TOKENS</span>
                  <span className="amountD">Amount(GBP)</span>
                </li>
              </ul>
              <h3>No Metamask extionsion detected.</h3>
              <h3>
                Metamask is required and you need to be logged in for wallet
                functionality.
              </h3>
            </div>
          </section>
        </div>
      );
    }
  }
}

export default Wallet;
