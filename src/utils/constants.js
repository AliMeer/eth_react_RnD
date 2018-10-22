
export const CONTRACT_ADDRESS = '0x44e1184fc25c884e2003d05ed6d77b79bf0eb228';
export const RINKEBY_CONTRACT_ADDRESS = '0x44e1184fc25c884e2003d05ed6d77b79bf0eb228';
export const MAINNET_CONTRACT_ADDRESS = '0xB5DBC6D3cf380079dF3b27135664b6BCF45D1869';

export const MARKET_INFO = {
    API_URL_RATE_ROOT: "https://api.coinmarketcap.com/v2/ticker/",
    TICKER_ID_OMX: '2844/',
    TICKER_ID_ETH: '1027/',
    GBP_OPTION: '?convert=GBP',
    API_URL_TXN: 'http://api.etherscan.io/api?module=account&action=tokentx&startblock=0&endblock=999999999&sort=asc&apikey=U5PD1FI7RM88C6QPNTFGQ4SQWQ19VX9IGX'
}

export const DataBase = {
    LOGIN_ACCOUNT: 'dblogin',
    LOGIN_PASSWORD: 'dbpass'
}

export const UploadStatusEnum = {
    NOT_INITIATED: 1,
    IN_PROGRESS: 2,
    UPLOAD_COMPLETE: 3,
    UPLOAD_FAILED: 4
}


//Etherscan API List
//https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&tag=latest&apikey=U5PD1FI7RM88C6QPNTFGQ4SQWQ19VX9IGX
//http://api.etherscan.io/api?module=account&action=tokentx&address=0x4e83362442b8d1bec281594cea3050c8eb01311c&startblock=0&endblock=999999999&sort=asc&apikey=U5PD1FI7RM88C6QPNTFGQ4SQWQ19VX9IGX
//http://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0xb5dbc6d3cf380079df3b27135664b6bcf45d1869&address=0xb5dbc6d3cf380079df3b27135664b6bcf45d1869&startblock=0&endblock=999999999&sort=asc&apikey=U5PD1FI7RM88C6QPNTFGQ4SQWQ19VX9IGX
//Mainnet OMX Addressess with balance
//0x219f194Bb470BaC87b9B859869F42E96A96F6e99
//0xb5dbc6d3cf380079df3b27135664b6bcf45d1869