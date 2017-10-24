import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';
// import './App.css';
import {BrowserRouter, Route} from 'react-router-dom'
import Modal from 'react-modal';
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
      categories: [],
      cartOpen: false
      
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

   
  }

  componentWillMount(){
    this.getProducts();
    this.getCategories();

    console.log('wobble')
  }  

  // componentWillUpdate(){
  //   this.getProducts();
  // }

  getCategories(){
    var url = 'http://localhost:5000/categories'
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
    var url = 'http://localhost:5000/products'
    request.get(url)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        var products = _.map(JSON.parse(res.text),(product) => {
          product.Quantity = 1;
          product.InCart = false;
          return product;
        });
        this.setState({
          products
        });
        console.log(this.state.products);
      });
  }

  toggleCartOpen(){
    this.setState({
        cartOpen: !this.state.cartOpen
    })
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

  handleCartAdd(product,adding){
    product.InCart = !product.InCart;
    var cartCopy = _.cloneDeep(this.state.cart);
    if(adding){
      cartCopy.items.push(product);
    } else {
      cartCopy.items = _.filter(cartCopy.items, (item) => {
        return item.ProductID !== product.ProductID;
      })
    }
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
    const newProduct = _.cloneDeep(this.state.newProduct);
    newProduct[e.target.name] = e.target.value;
    this.setState({
      newProduct
    })
  }

  handleNewProductSubmit(e){
    e.preventDefault();
    var newProductCopy = _.cloneDeep(this.state.newProduct);
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
    const editProduct = _.cloneDeep(this.state.editProduct);
    editProduct[e.target.name] = e.target.value || e.target.placeholder;
    this.setState({
      editProduct
    })
  }

  handleEditSubmit(e,productId){
    e.preventDefault();
    var editProductCopy = _.cloneDeep(this.state.editProduct);
    editProductCopy.productId = productId; 
    var url = 'http://localhost:5000/products';
    request
      .put(url)
      .send(editProductCopy)
      .set('accept','json')
      .end((err,res) => {
        if(err){
          throw Error(err);
        }
        this.setState({
          editProduct: {
            productName: '',
            price: '',
            description: '',
            categoryId: 'Select...'
          }
        })
        this.getProducts();
      })
  }

  render () {
    
   return (
     <BrowserRouter>
      <div>
        <Nav cart={this.state.cart} toggleCartOpen={this.toggleCartOpen} />
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
        <Modal 
        isOpen={this.state.cartOpen}
        contentLabel="Shopping Cart"
        onRequestClose={this.toggleModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        >
        <ShoppingCart cart={this.state.cart} toggleCartOpen={this.toggleCartOpen} orderSubmit={this.handleOrderSubmit}/>

        </Modal>
      </div>
     </BrowserRouter>
   )
  }
}

export default App;

const ShoppingCart = (props) => {
  //TODO: add method to change the count of a product from cart
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
    console.log(items.length);
  return (
    <div>
      <button className="modalClose" onClick={() => {props.toggleCartOpen()}}>Close</button>
      <div className="table-results">
        {items.length <= 0 ? 
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

const modalStyles = {
  content : {
    top                   : '20%',
    left                  : '10%',
    right                 : '10%',
    bottom                : '10%',
    minWidth              : '10%',
    maxWidth              : '500px',
    margin                : '20px auto 20px auto',
    padding               : '10px',
    overflow              : 'none'

    // transition            : 'transform 1000ms',
    // transform             : 'translate(-50%, -50%)'
  },
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(0, 0, 0, 0.45)'
  },
};
