import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom'
import Modal from 'react-modal';
import Products from './components/Products';
import Orders from './components/Orders';
import Nav from './components/Nav';
import Home from './components/Home';
import modalStyles from './utils/ModalStyles';

const herokuUrl = 'https://radiant-ocean-22273.herokuapp.com'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: [], //populated from db query
      cart: { //holds global cart state
        total: 0,
        customerID: null,
        items: []
      },
      newProduct: { //holds typed data from new product form
        productName: '',
        imgUrl: '',
        price: '',
        description: '',
        categoryId: 'Select...'
      },
      editedProduct: { //holds typed data from edit product form
        productName: '',
        price: '',
        description: '',
        categoryId: 'Select...'
      },
      categories: [], 
      cartOpen: false, //toggles modal on/off
      newProductOpen: false //toggles modal on/off
      
    }
    this.getProducts = this.getProducts.bind(this);
    this.handleCartAdd = this.handleCartAdd.bind(this);
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleNewProductChange = this.handleNewProductChange.bind(this);
    this.handleNewProductSubmit = this.handleNewProductSubmit.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.toggleCartOpen = this.toggleCartOpen.bind(this);
    this.toggleNewProductOpen = this.toggleNewProductOpen.bind(this);

   
  }

  componentWillMount(){
    //async fix for db query
    this.getProducts();
    this.getCategories();

  }  

  getCategories(){
    var url = `${herokuUrl}/categories`
    request.get(url)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        this.setState({
          categories: JSON.parse(res.text)
        });
      });
  }

  getProducts(){
    var url = `${herokuUrl}/products`
    request.get(url)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        var products = _.map(JSON.parse(res.text),(product) => {
          product.Quantity = 1; 
          product.InCart = false; //turns off in cart state when getting products back
          return product;
        });
        this.setState({
          products
        });
      });
  }

  toggleNewProductOpen(){
    this.setState({
      newProductOpen: !this.state.newProductOpen
    })
  }

  toggleCartOpen(){
    this.setState({
        cartOpen: !this.state.cartOpen
    })
}

  handleOrderSubmit(){
    
    var cartCopy = _.cloneDeep(this.state.cart);
    var url = `${herokuUrl}/orders`;
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
        this.getProducts(); //calling getProducts sets "inCart" state to false on submit

      })
  }

  handleCartAdd(product,adding){
    //toggles adding/removing product to cart based on state of "inCart"
    product.InCart = !product.InCart;
    var cartCopy = _.cloneDeep(this.state.cart);
    if(adding){
      cartCopy.items.push(product);
    } else {
      cartCopy.items = _.filter(cartCopy.items, (item) => {
        return item.ProductID !== product.ProductID;
      })
    }
    //random number is assigned to customer if not already assigned 
    cartCopy.customerID = (!cartCopy.customerID) ? _.random(1,10) : cartCopy.customerID;
    //calculates cart total based on num of items and quantity of each in cart array
    cartCopy.total = _.sumBy(cartCopy.items, (item) => { 
      return item.Quantity * item.Price; 
    })
    this.setState({
      cart: cartCopy
    })
  }

  handleQuantityChange(e,productIndex){
    var productsCopy = _.cloneDeep(this.state.products);
    //TODO: replace map loop with stop on match lookup to save on resources
    productsCopy = _.map(productsCopy,(product,index) => {
        if(index === productIndex){
            product.Quantity = parseInt(e.target.value,10);//converts dom string value
            return product;       
        }
        return product;
    })
    this.setState({
      products: productsCopy
    })
  }

  handleNewProductChange(e){
    const newProduct = _.cloneDeep(this.state.newProduct);
    newProduct[e.target.name] = e.target.value; //looks for newProduct state property based on html element name
    this.setState({
      newProduct
    })
  }

  handleNewProductSubmit(e){
    e.preventDefault();
    var newProductCopy = _.cloneDeep(this.state.newProduct);
    var url = `${herokuUrl}/products`;
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
    const editedProduct = _.cloneDeep(this.state.editedProduct);
    editedProduct[e.target.name] = e.target.value;
    this.setState({
      editedProduct
    })
  }

  handleEditSubmit(e,productId){
    e.preventDefault();
    var editedProductCopy = _.cloneDeep(this.state.editedProduct);
    editedProductCopy.productId = productId; //adding productId property as it's not stored in edit state
    var url = `${herokuUrl}/products`;
    request
      .put(url)
      .send(editedProductCopy)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        this.setState({
          editedProduct: {
            productName: '',
            price: '',
            description: '',
            categoryId: 'Select...'
          }
        })
        this.getProducts(); //forces new data to be read from db
      })
  }

  render () {
    //categories for select dropdowns
    const categories = _.map(this.state.categories,(category,index) => {
      return (
        <option key={index} value={category.CategoryID}>{_.capitalize(category.Category)}</option>
      )
    })

   return (
      //main component structure
      //modals are passed in but are only rendered based on state 
     <BrowserRouter>
      <div>
        <Nav cart={this.state.cart} toggleCartOpen={this.toggleCartOpen} />
        <Route exact path="/" component={Home}/>
        <Route path="/products" render={() => <Products //func is used to allow for props to be passed
        products={this.state.products} 
        addCart={this.handleCartAdd}
        onChangeQuantity={this.handleQuantityChange}
        onEditChange={this.handleEditChange}
        editedProduct={this.state.editedProduct}
        onEditSubmit={this.handleEditSubmit}
        categories={this.state.categories}
        />}/>
        <Route path="/orders" component={Orders}/>
        <Footer toggleNewProductOpen={this.toggleNewProductOpen}/>
        <Modal //shopping cart modal
          isOpen={this.state.cartOpen}
          contentLabel="Shopping Cart" //screen readers
          onRequestClose={this.toggleCartOpen}
          shouldCloseOnOverlayClick={true}
          closeTimeoutMS={100}
          style={modalStyles}
          >
          <ShoppingCart cart={this.state.cart} toggleCartOpen={this.toggleCartOpen} orderSubmit={this.handleOrderSubmit}/>
        </Modal>
        <Modal //add new product modal
        isOpen={this.state.newProductOpen}
        contentLabel="Add New Product Form" //screen readers
        onRequestClose={this.toggleNewProductOpen}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={100}
        style={modalStyles}
        >
          <button className="modalClose" onClick={this.toggleNewProductOpen}>Close</button>
          <form className="addProduct-form"onSubmit={this.handleNewProductSubmit} onChange={this.handleNewProductChange}>
            <p>Please enter product details:</p>
            <label htmlFor="productName" className="newProduct-label">Name:</label>
            <input type="text" name="productName" value={this.state.newProduct.productName} />
            <label htmlFor="imgUrl" className="newProduct-label">Image Name:</label>
            <input type="text" name="imgUrl" value={this.state.newProduct.imgUrl}/>
            <label htmlFor="price" className="newProduct-label">Price:</label>
            <input type="text" name="price" value={this.state.newProduct.price}/>
            <label htmlFor="categoryId" className="newProduct-label">Category:</label>
            <select name="categoryId" defaultValue={this.state.newProduct.categoryId} onChange={this.handleNewProductChange}>
              {categories}
            </select>
            <label htmlFor="description" className="newProduct-label">Description:</label>
            <textarea type="text" name="description"  value={this.state.newProduct.description}/>
            <button className="add-product-confirm">Add Product</button>
          </form>  
        </Modal>
      </div>
     </BrowserRouter>
   )
  }
}

export default App;

//func component to just return a table 
const ShoppingCart = (props) => {
  //TODO: add method to change the count of a product from cart

  //get a collection of table rows based on cart state
  const items = _.map(props.cart.items,(item,index) => {
    let total = item.Price * item.Quantity
      return (
              <tr key={index}>
                  <td>{item.Name}</td>
                  <td>{item.Quantity}</td>
                  <td>${total.toFixed(2)}</td>
              </tr>    
      )
    })

  return (
    <div>
      <button className="modalClose" onClick={() => {props.toggleCartOpen()}}>Close</button>
      <div className="table-results">
        {items.length <= 0 ? //only return a table if cart isn't empty
          <p>--- Cart is Empty ---</p>
          :  
          <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <td colSpan={3}>Order Total: <strong>${props.cart.total.toFixed(2)}</strong></td>
                </tr>
            </tfoot>    
            <tbody>
                {items}
            </tbody>
          </table>
        }
      </div>
      <button className="submit-order" onClick={() => {props.orderSubmit()}}>Submit Order</button>
    </div>
  )
}

const Footer = (props) => {
  return (
    <div>
      <footer>
        <span>&copy; Anderson Sipe {(new Date().getFullYear())}</span>
        <span className="footer-link" onClick={() => {props.toggleNewProductOpen()}}>Admin</span>
      </footer>
    </div>
  )
}
