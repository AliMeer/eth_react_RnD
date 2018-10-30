import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from "./components/Home";
import About from "./components/About";
import Upload from "./components/Upload";
import Error from "./components/Error";
import Navigation from "./components/Navigation";
import AppWrapper from './components/AppWrapper';
import AllRoutes from './components/AllRoutes';

class App extends Component {
  render() {
    return (
      <AppWrapper />
    );
  }
};

export default App; 