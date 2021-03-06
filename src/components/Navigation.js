import React from "react";
import { NavLink } from 'react-router-dom'; 

const Navigation = () => {
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/upload">Upload</NavLink>
      <NavLink to="/wallet">Wallet</NavLink>
    </div>
  );
};

export default Navigation;