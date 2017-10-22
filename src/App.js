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
      },
      newProduct: {
        productName: '',
        imgUrl: '',
        price: '',
        description: '',
        categoryId: 'Select...'
      },
      editProduct: {
        productName: '',
        price: '',
        description: '',
        categoryId: 'Select...'
      },
      categories: []
      
    }
    this.getProducts = this.getProducts.bind(this);
    this.handleCartAdd = this.handleCartAdd.bind(this);
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleNewProductChange = this.handleNewProductChange.bind(this);
    this.handleNewProductSubmit = this.handleNewProductSubmit.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);

   
  }

  componentWillMount(){
    this.getProducts();
    this.getCategories();
  }  

  getCategories(){
    var url = 'http://localhost:5000/categories'
    request.get(url)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        console.log(JSON.parse(res.text));

        this.setState({
          categories: JSON.parse(res.text)
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

  handleNewProductChange(e){
    e.preventDefault();
    console.log(e.target.value);
    const newProduct = _.cloneDeep(this.state.newProduct);
    console.log(newProduct);
    newProduct[e.target.name] = e.target.value;
    console.log(newProduct)
    this.setState({
      newProduct
    })
  }

  handleNewProductSubmit(e){
    e.preventDefault();
    // console.log(e);
    var newProductCopy = _.cloneDeep(this.state.newProduct);
    // console.log(newProductCopy);
    var url = 'http://localhost:5000/products';
    request
      .post(url)
      .send(newProductCopy)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        this.setState({
          newProduct: {
            productName: '',
            imgUrl: '',
            price: '',
            description: '',
            categoryId: 'Select...'
          }
        })

      })
  }

  handleEditChange(e){
    e.preventDefault();
    // console.log(e.target.name)
    const editProduct = _.cloneDeep(this.state.editProduct);
    // console.log(editProduct);
    editProduct[e.target.name] = e.target.value || e.target.placeholder;
    // console.log(editProduct);
    this.setState({
      editProduct
    })
  }

  handleEditSubmit(e,productId){
    e.preventDefault();
    console.log(e,this.state.editProduct,productId);
    var editProductCopy = _.cloneDeep(this.state.editProduct);
    editProductCopy.productId = productId; 
    console.log(editProductCopy);
    var url = 'http://localhost:5000/products';
    request
      .put(url)
      .send(editProductCopy)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        console.log('hotdog');
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
        onChangeNewProduct={this.handleNewProductChange}
        categories={this.state.categories}
        productForm={this.state.newProduct}
        onNewProductSubmit={this.handleNewProductSubmit}
        onEditChange={this.handleEditChange}
        editProduct={this.state.editProduct}
        onEditSubmit={this.handleEditSubmit}
        />}/>
        <Route path="/orders" component={Orders}/>
      </div>
     </BrowserRouter>
   )
  }
}

export default App;
