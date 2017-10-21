import React, { Component } from 'react';
// import request from 'superagent';
// import _ from 'lodash';
import './main.css';

import Quantity from './Quantity';

class Products extends Component {
    // constructor(props){
    //   super(props);
    // }
    // componentWillMount(){
    //   this.getProducts();
    // }
    // getProducts(){
    //   var url = 'http://localhost:5000/products'
    //   request.get(url)
    //     .set('accept','json')
    //     .end((err,res) => {
    //       if(err){
    //         throw Error(err);
    //       }
          
    //       this.setState({
    //         products: JSON.parse(res.text)
    //       });
    //     });
    // }
  
    // getOrders(){
    //   var url = 'http://localhost:5000/orders';
    //   request.get(url)
    //   .set('accept','json')
    //   .end((err,res) => {
    //     if(err){
    //       throw Error(err);
    //     }
    //     this.setState({
    //       orders: JSON.parse(res.text)
    //     });
    //   });
    // }
  
    // handleOrderSubmit(){
    //   //TODO: replace send object with cart state
    //   var cartCopy = _.cloneDeep(this.state.cart);
    //   var url = 'http://localhost:5000/orders';
    //   request
    //     .post(url)
    //     .send({
    //       total: cartCopy.total,
    //       customer: cartCopy.customerID,
    //       items: cartCopy.items
    //      })
    //     .set('accept','json')
    //     .end((err,res) => {
    //       if(err){
    //         throw Error(err);
    //       }
    //       //this.getOrders();
    //       this.setState({
    //         cart: {
    //           total: 0,
    //           customerID: null,
    //           items: []
    //         }
    //       })
    //     })
    // }
  
    // handleOrderDelete(){
        
    //     var stateCopy = _.map(this.state.orders,_.cloneDeep);
    //     var url = 'http://localhost:5000/orders/' + stateCopy[0].OrderID;
    //     request
    //       .del(url)
    //       .set('accept','json')
    //       .end((err,res) => {
    //         if(err){
    //           throw Error(err);
    //         }
    //         this.getOrders();
    //       })
    // }
  
    // handleCartAdd(product,count = 1){
    //   console.log(product);
    //   var cartCopy = _.cloneDeep(this.state.cart);
    //   var newItem = [product.ProductID,count,product.Price];
    //   console.log(newItem);
    //   cartCopy.items.push(newItem);
    //   //TODO: replace random number for customerID with better process
    //   //random number is assigned to customer if not assigned 
    //   cartCopy.customerID = (!cartCopy.customerID) ? _.random(1,10) : cartCopy.customerID;
    //   cartCopy.total = _.sumBy(cartCopy.items, (item) => {
    //     return item[2];
    //   })
    //   this.setState({
    //     cart: cartCopy
    //   })
  
    // }
    render() {
  
      //TODO: replace orders with a seperate page and component
  
      // var orders = _.map(this.state.orders,(order,index) => {
      //   return <li key={index} >{order.OrderID}</li>
      // })
  
      console.log(this.props);
      // var cartItems = this.props.cart.items.length;
      return (
        <div>
          <button onClick={() => {this.props.orderSubmit()}}>Submit Order</button>
          <ul className="product-list">{this.props.products.map((product,index) => {
            return (
            <Product 
              key={index} 
              product={product}
              onCartAdd={this.props.addCart}
              onChangeQuantity={this.props.onChangeQuantity}
               />
            )
          })}</ul>
          
        </div>
      );
    }
  }
  
  class Product extends Component {
    // constructor(props){
    //   super(props);
    // }
  
    render(){
  
      return (
        <li className="product-item">
        <img src={"/img/" + this.props.product.ImgURL} alt={this.props.product.Name}/>
        <div className="product-name">{this.props.product.Name}</div>
        <div className="product-price">$ {this.props.product.Price}</div>
        <Quantity select={1} count={10} onChangeQuantity={this.props.onChangeQuantity}/>
        <button className="add-button" onClick={() => {this.props.onCartAdd(this.props.product)}}>Add to Cart</button>
       </li>
      );
    }
  }
  
  export default Products;