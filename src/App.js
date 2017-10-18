import React, { Component } from 'react';
// import request from 'superagent';
// import _ from 'lodash';
// import './App.css';
import {BrowserRouter, Route} from 'react-router-dom'

import Products from './pages/Products';
import Orders from './pages/Orders';
import Nav from './pages/Nav';
import Home from './pages/Home';

class App extends Component {
  render () {
   return (
     <BrowserRouter>
      <div>
        <Nav/>
        <Route exact path="/" component={Home}/>
        <Route path="/products" component={Products}/>
        <Route path="/orders" component={Orders}/>
      </div>
     </BrowserRouter>
   )
  }
}

export default App;
