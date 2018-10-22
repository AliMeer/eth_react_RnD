import React, { Component } from "react";
import blockChainConnector from "../utils/BlockChainConnector";
import { MARKET_INFO, MAINNET_CONTRACT_ADDRESS } from "../utils/constants";

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWalletAvailable: false,
      isWalletUnlocked: false,
      walletAccount: '',
      EtherBalance: 0,
      OMXBalance: 0,
      EtherGBP: 0,
      OMXGBP: 0,
      TxnList: null
    };
  }

formattedDate(epoch){
    var myDate = new Date(epoch*1000);
    return myDate.toDateString();
}
renderTransactions(Txn, index) {
    
        return (
        
        <li key={index} className="dataHead">
        <span className="dt">{this.formattedDate(Txn.timeStamp)}</span>
        <span className="wa">{Txn.from}</span>
        <span className="reasonD">Transfer</span>
        <span className="counterVD">{parseFloat(((Txn.value)/10**8)).toFixed(3)}</span>                    
        <span className="amountD">{parseFloat(((Txn.value)/10**8)*this.state.OMXGBP).toFixed(3)}</span>
    </li>
    )
      
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
  .then((r) => {
        this.setState({walletAccount: r});
        if(this.state.walletAccount!==""){
            blockChainConnector.getBalance(this.state.walletAccount)
            .then((r) => (this.setState({EtherBalance: r})));
        }
        if(this.state.walletAccount!==""){
            blockChainConnector.getOMXBalance("0xb5dbc6d3cf380079df3b27135664b6bcf45d1869")
            .then((r) => (this.setState({OMXBalance: r})));
        }
        }
    );
    
//Fetch Market price of OMX in GBP per token
    fetch(MARKET_INFO.API_URL_RATE_ROOT + MARKET_INFO.TICKER_ID_OMX + MARKET_INFO.GBP_OPTION, {
        
        headers: {
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'}
        
      })
      .then(response => response.json())
      .then(data => this.setState({OMXGBP: data.data.quotes.GBP.price}));
 
  //Fetch Market price of Ether in GBP per Ether
  fetch(MARKET_INFO.API_URL_RATE_ROOT + MARKET_INFO.TICKER_ID_ETH + MARKET_INFO.GBP_OPTION, {
        
    headers: {
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Content-Type':'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000'}
    
  })
  .then(response => response.json())
  .then(data => this.setState({EtherGBP: data.data.quotes.GBP.price}));

  //Fetch Previous Transactions
  fetch(MARKET_INFO.API_URL_TXN + '&contractaddress=' + MAINNET_CONTRACT_ADDRESS + '&address=' + '0xb5dbc6d3cf380079df3b27135664b6bcf45d1869', {
        
    headers: {
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Content-Type':'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000'}
    
  })
  .then(response => response.json())
  .then(data => this.setState({TxnList: data.result }));

}



  render() {
   
    if (this.state.isWalletAvailable && this.state.isWalletUnlocked) {
      return (
        <body>

<div className="common wallet">    
    
    <section className="introduction">
        <div className="widthContain leftAlign">

        <h2>Manage your OMX wallet here</h2>
            <p>Everytime you share your DNA data with an organisation you receive compensation in OMX tokens. These tokens can be used to purchase DNA Kits and other products from our shop.</p>
        </div>    

    </section>    

    <section className="wallet-currency clearfix">
        <div className="widthContain">
            
            <div className="balance">
            <span>BALANCE</span>OMX <em>{parseFloat((this.state.OMXBalance)/10**8).toFixed(3)}</em>
            </div>
            
            <div className="counterValue">
                <span>COUNTERVALUE</span>GBP <em>{parseFloat(((this.state.OMXBalance)/10**8)*this.state.OMXGBP).toFixed(3)}</em>
            </div>
            <div className="balance">
            <span>BALANCE</span>Ether <em>{parseFloat((this.state.EtherBalance)/10**18).toFixed(3)}</em>
            </div>
            
            <div className="counterValue">
                <span>COUNTERVALUE</span>GBP <em>{parseFloat(((this.state.EtherBalance)/10**18)*this.state.EtherGBP).toFixed(3)}</em>
            </div>
            

            
        </div>
    </section>

    <section className="main-content clearfix">

        <div className="walletData received widthContain">
            
            <h3>COMPENSATION RECEIVED</h3>
            <ul>
            <li className="dataHead">
                    <span className="dt">DATE AND TIME</span>
                    <span className="wa">WALLET ADDRESS</span>
                    <span className="reasonD">REASON</span>
                    <span className="counterVD">TOKENS</span>                    
                    <span className="amountD">Amount(GBP)</span>
                </li>
            {
                this.state.TxnList? this.state.TxnList.map( (Txn, index) => this.renderTransactions(Txn, index) ) : ""
                  }
                  </ul>
            
            
        </div>

    </section>    



</div>    
    
</body>
      );
    }

    return (
        <div>
        <p>No Crypto Wallet Found</p>
        <p>Metamask is Not available</p>
        <p>Wallet address: {this.state.walletAccount}</p>
        <p>Wallet Ether balance: {this.state.EtherBalance}</p>
        
      </div>
    );
  }
}

export default Wallet;
