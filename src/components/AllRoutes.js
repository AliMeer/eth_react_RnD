import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from "./Home";
import About from "./About";
import Upload from "./Upload";
import Error from "./Error";
import Login from "./Login";
import Wallet from "../wallet/wallet"
import Navigation from "./Navigation";

class AllRoutes extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/about" component={About} />
            <Route path="/upload" component={Upload} />
            <Route path="/Login" component={Login} />
            <Route path="/wallet" component={Wallet} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
};

export default AllRoutes; 