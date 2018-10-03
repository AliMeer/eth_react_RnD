import React from 'react';
import { encrypt, decrypt } from '../utils/CryptoConnector';

const About = () => {

var hw = encrypt("hello world")
// outputs hello world
console.log("encrypted Text: " + hw)
console.log("DeCrypted Text: " + decrypt(hw));

  return (
    <div>
      <p>About</p>
    </div>
  );
};

export default About;