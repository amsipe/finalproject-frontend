import React, { Component } from 'react';
import logo from './logo.svg';
import request from 'superagent';
import _ from 'lodash';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: []
    }
    this.getProducts = this.getProducts.bind(this);
  }
  componentWillMount(){
    var url = 'http://localhost:5000/products'
    request.get(url)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        
        console.log(JSON.parse(res.text));
        this.setState({
          products: JSON.parse(res.text)
        });
      });
  }
  getProducts(){
    
    var url = 'http://localhost:5000/products'
    request.get(url)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        
        console.log(JSON.parse(res.text));
        this.setState = {
          products: JSON.parse(res.text)
        };
      });
      
  }
  render() {
    var products = _.map(this.state.products,(product,index) => {
      return <li key={index} >{product.Name}</li>
    })
    return (
      <div>
        <p>Testing</p>
        <ul>{products}</ul>
      </div>
    );
  }
}

export default App;
