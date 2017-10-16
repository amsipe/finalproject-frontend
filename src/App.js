import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: [],
      orders: [],
      cart: []
      
    }
    this.getProducts = this.getProducts.bind(this);
   
  }
  componentWillMount(){
    this.getProducts();
    this.getOrders();
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
        this.setState({
          products: JSON.parse(res.text)
        });
      });
  }

  getOrders(){
    var url = 'http://localhost:5000/orders';
    request.get(url)
    .set('accept','json')
    .end((err,res) => {
      if(err){
        throw Error(err);
      }
      this.setState({
        orders: JSON.parse(res.text)
      });
    });
  }

  handleOrderSubmit(){
    //TODO: replace send object with cart state
    var url = 'http://localhost:5000/orders';
    request
      .post(url)
      .send({
        total: 13.99,
        customer: 6,
        items: [
          [1,1,3.99],
          [2,1,5.99],
          [4,1,7.85]
          ]})
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }

        console.log(res.body);
        this.getOrders();
      })
  }

  handleOrderDelete(){
      
      var stateCopy = _.map(this.state.orders,_.cloneDeep);
      console.log(stateCopy);
      var url = 'http://localhost:5000/orders/' + stateCopy[0].OrderID;
      request
        .del(url)
        .set('accept','json')
        .end((err,res) => {
          if(err){
            throw Error(err);
          }
  
          console.log(res.body);
          this.getOrders();
        })
  }
  render() {

    //TODO: replace orders with a seperate page and component

    // var products = _.map(this.state.products,(product,index) => {
    //   return <li key={index} >
    //           <img src={"/img/" + product.ImgURL} alt={product.Name}/>
    //           <div>{product.Name}</div>
    //           <div>$ {product.Price}</div>
    //           <button>Add to Cart</button>
    //          </li>
    // })

    var orders = _.map(this.state.orders,(order,index) => {
      return <li key={index} >{order.OrderID}</li>
    })

    var cartItems = this.state.cart.length;
    return (
      <div>
        <p>{cartItems}</p>
        <input type="text" name="newOrder"/>
        <button onClick={() => {this.handleOrderSubmit()}}>Submit</button>
        <input type="text" name="deleteOrder"/>
        <button onClick={() => {this.handleOrderDelete()}}>Delete</button>
        <ul>{this.state.products.map((product,index) => {
          return (
          <Product 
            key={index} 
            source={product.ImgURL}
            name={product.Name}
            price={product.Price}
            description={product.Description}
            productID={product.ProductID}
             />
          )
        })}</ul>
        <ul>{orders}</ul>
      </div>
    );
  }
}

class Product extends Component {
  constructor(props){
    super(props);
    this.state = {
      cart: []
    }
  }
  //TODO: move state push to global state
  handleAddCart(){
    console.log(this.props);

    var stateCopy = _.map(this.state.cart,_.cloneDeep);
    console.log(stateCopy);
    var newItem = [this.props.productID,1,this.props.price]
    stateCopy.push(newItem);
    console.log(stateCopy);
    this.setState({
      cart: [...stateCopy]
    })
    console.log(this.state)
  }

  render(){

    return (
      <li>
      <img src={"/img/" + this.props.source} alt={this.props.name}/>
      <div>{this.props.name}</div>
      <div>$ {this.props.price}</div>
      <button onClick={() => {this.handleAddCart()}}>Add to Cart</button>
     </li>
    );
  }
}

export default App;
