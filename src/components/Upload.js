import React, { Component } from "react";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";
import EthCrypto from "eth-crypto";
//const identity = EthCrypto.createIdentity();

//"pubKey":"025a57bb4779ea5836794f520c8ac34d123b66d0b46fe211c5ac7782fb02c122c1"
//"privKey":"KzpiuEpYQK5givBkBymNgbbZ2MomjLX1zkSatMyNY62E5A5ydbXm"

const publicKey = 
  "a9fea7aafd4c6d602d0a298393b14a02b662eee2488ee4a654427bf3080fd8d6d119bd041de316678cbebf493489fdf28945995e4bc1b580f3ccc414a74fd8fe";
const privateKey =
  "A8CB223038194E32F7697668D0C21A7B91B6691FA2BD90AB10E445326620688D";


class FileStreamer {
  constructor(file) {
      this.file = file;
      this.offset = 0;
      this.defaultChunkSize = 64 * 1024; // bytes
      this.rewind();
  }
  rewind() {
      this.offset = 0;
  }
  isEndOfFile() {
      return this.offset >= this.getFileSize();
  }
  readBlockAsText(length = this.defaultChunkSize) {
      const fileReader = new FileReader();
      const blob = this.file.slice(this.offset, this.offset + length);
      return new Promise((resolve, reject) => {
          fileReader.onloadend = (event) => {
              const target = (event.target);
              if (target.error == null) {
                  const result = target.result;
                  this.offset += result.length;
                  this.testEndOfFile();
                  resolve(result);
              }
              else {
                  reject(target.error);
              }
          };
          fileReader.readAsText(blob);
      });
  }
  testEndOfFile() {
      if (this.isEndOfFile()) {
          console.log('Done reading file');
      }
  }
  getFileSize() {
      return this.file.size;
  }
}


class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      encrypted: "",
      dencrypted: "",
      inputFile: "",
      encryptedFile: "",
      decryptedFile: ""
    };
  }
  componentWillUpdate() {
    //this.setState({cypherText: identity});
  }
  handleInputChange(e) {
    this.setState({ inputText: e.target.value });
  }

thandleFileChange(e) {

  var file = e.target.files[0];
    
  const fileStreamer = new FileStreamer(file);
  console.log(fileStreamer);
while (!fileStreamer.isEndOfFile()) {
console.log('inside streamer while');
//const data = await 
fileStreamer.readBlockAsText()
.then((data) => 
console.log(data)
)
}
}

  handleFileChange(e) {
    this.setState({ inputFile: e.target.value });
    console.log(e.target.files[0]);
    var Inputreader = new FileReader();
    Inputreader.readAsText(e.target.files[0]);
    Inputreader.onload = () => {
      
      EthCrypto.encryptWithPublicKey(
        publicKey,
        JSON.stringify(Inputreader.result)
      ).then(encrypted => {
        // we convert the object into a smaller string-representation
        const encryptedString = EthCrypto.cipher.stringify(encrypted);
        console.log(`Encrypted Text is: ${encryptedString}`);
        this.setState({ encryptedFile: encryptedString });
      });
    };
  }

  handleFileEncryptClick() {
    

    //const encrypted =
    
  }
  handleEncryptClick() {
    //const encrypted =
    EthCrypto.encryptWithPublicKey(
      publicKey,
      JSON.stringify(this.state.inputText)
    ).then(encrypted => {
      // we convert the object into a smaller string-representation
      const encryptedString = EthCrypto.cipher.stringify(encrypted);
      console.log(`Encrypted Text is: ${encryptedString}`);
      this.setState({ encrypted: encryptedString });
    });
  }

  handleFileDecryptClick() {

    // we parse the string into the object again
    const encryptedObject = EthCrypto.cipher.parse(this.state.encryptedFile);

    EthCrypto.decryptWithPrivateKey(privateKey, encryptedObject).then(
      decryptedPayload => {
        const decryptedFile = JSON.parse(decryptedPayload);
        this.setState({ decryptedFile });
      }
    );
    /*/ check signature
const senderAddress = EthCrypto.recover(
    decryptedPayload.signature,
    EthCrypto.hash.keccak256(payload.message)
); */
  }
  handleDecryptClick() {
    // we parse the string into the object again
    const encryptedObject = EthCrypto.cipher.parse(this.state.inputText);

    EthCrypto.decryptWithPrivateKey(privateKey, encryptedObject).then(
      decryptedPayload => {
        const decrypted = JSON.parse(decryptedPayload);
        this.setState({ decrypted });
      }
    );
    /*/ check signature
const senderAddress = EthCrypto.recover(
    decryptedPayload.signature,
    EthCrypto.hash.keccak256(payload.message)
); */
  }

  render() {
    return (
      <div>
        <h2>Encrypt/Decrypt Test Page</h2>
        <h3>Input string test</h3>
        <input
          type="text"
          style={{ width: "200px" }}
          onChange={this.handleInputChange.bind(this)}
        />
        <br />
        <input
          type="button"
          value="Encrypt"
          onClick={this.handleEncryptClick.bind(this)}
        />
        <br />
        <h3>Encrypted Data</h3>
        {this.state.encrypted}
        <br />
        <input
          type="button"
          value="Decrypt"
          onClick={this.handleDecryptClick.bind(this)}
        />
        <br />
        <h3>Decrypted Data</h3>
        {this.state.decrypted}
        <br />
        <h3>Compare Size of Encrypted and Decrypted Data</h3>
        <br />
        length of InputText is {this.state.inputText.length}
        <br />
        length of encrypted text is {this.state.encrypted.length}
        <h3>Data File Test</h3>
        <input
          type="file"
          style={{ width: "200px" }}
          onChange={this.handleFileChange.bind(this)}
        />
        <br />
        <input
          type="button"
          value="Encrypt"
          onClick={this.handleFileEncryptClick.bind(this)}
        />
        <br />
        <h3>Encrypted Data</h3>
        {this.state.encryptedFile}
        <br />
        <input
          type="button"
          value="Decrypt"
          onClick={this.handleFileDecryptClick.bind(this)}
        />
        <br />
        <h3>Decrypted Data</h3>
        {this.state.decryptedFile}
        <br />
        <h3>Compare Size of Encrypted and Decrypted Data File</h3>
        <br />
        length of Input File is {this.state.decryptedFile.length}
        <br />
        length of encrypted File is {this.state.encryptedFile.length}
      </div>
    );
  }
}

export default Upload;
