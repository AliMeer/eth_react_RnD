import { Redirect } from 'react-router-dom'
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Welcome from './AllRoutes';
import Login from './Login';


class AppWrapper extends Component{
  render(){
      const isAuthenticated = true;

  if(!isAuthenticated)
    return (
   
        <Login />
   
    );

   return(
     <div>
       App wrapper
       <Welcome />
     </div>
   );
  }
}

export default AppWrapper;