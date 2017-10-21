import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';
// import './App.css';
import {BrowserRouter, Route} from 'react-router-dom'

import Products from './pages/Products';
import Orders from './pages/Orders';
import Nav from './pages/Nav';
import Home from './pages/Home';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: [],
      orders: [],
      cart: {
        total: 0,
        customerID: null,
        items: []
      }
      
    }
    this.getProducts = this.getProducts.bind(this);
    this.handleCartAdd = this.handleCartAdd.bind(this);
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);

   
  }

  componentWillMount(){
    this.getProducts();
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
        var products = _.map(JSON.parse(res.text),(product) => {
          product.Quantity = 1;
          return product;
        });
        console.log(products);
        this.setState({
          products
        });
      });
  }

  handleOrderSubmit(){
    //TODO: replace send object with cart state
    var cartCopy = _.cloneDeep(this.state.cart);
    var url = 'http://localhost:5000/orders';
    request
      .post(url)
      .send({
        total: cartCopy.total,
        customer: cartCopy.customerID,
        items: cartCopy.items
       })
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        
        this.setState({
          cart: {
            total: 0,
            customerID: null,
            items: []
          }
        })
        this.getProducts();

      })
  }

  handleCartAdd(product,count = 2){
    var cartCopy = _.cloneDeep(this.state.cart);
    cartCopy.items.push(product);
    //TODO: replace random number for customerID with better process
    //random number is assigned to customer if not assigned 
    cartCopy.customerID = (!cartCopy.customerID) ? _.random(1,10) : cartCopy.customerID;
    cartCopy.total = _.sumBy(cartCopy.items, (item) => {
      return item.Quantity * item.Price;
    })
    this.setState({
      cart: cartCopy
    })

  }

  handleQuantityChange(e,productIndex){
    e.preventDefault();
    console.log(e.target.value,productIndex);
    var productsCopy = _.cloneDeep(this.state.products);
    productsCopy = _.map(productsCopy,(product,index) => {
        if(index === productIndex){
            product.Quantity = parseInt(e.target.value,10);
            return product;       
        }
        return product;
    })
    this.setState({
      products: productsCopy
    })
  }

  render () {
    
   return (
     <BrowserRouter>
      <div>
        <Nav cart={this.state.cart}/>
        <Route exact path="/" component={Home}/>
        <Route path="/products" render={() => <Products 
        products={this.state.products} 
        cart={this.state.cart}
        addCart={this.handleCartAdd}
        orderSubmit={this.handleOrderSubmit}
        onChangeQuantity={this.handleQuantityChange}
        />}/>
        <Route path="/orders" component={Orders}/>
      </div>
     </BrowserRouter>
   )
  }
}

export default App;
