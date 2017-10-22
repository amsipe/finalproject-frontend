import React, { Component } from 'react';
import Modal from 'react-modal';
// import request from 'superagent';
import _ from 'lodash';
import './main.css';

import Quantity from './Quantity';

class Products extends Component {
  constructor(props){
    super(props);
    this.state = {
      modalOpen: false
      
    }
    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal(){
    console.log('hotdog')
    this.setState({
      modalOpen: this.state.modalOpen ? false : true
    })
  }


  render() {

    //TODO: move form element to own component
    const categories = _.map(this.props.categories,(category,index) => {
      return (
        <option key={index} value={category.CategoryID}>{_.capitalize(category.Category)}</option>
      )
    })
    //TODO: fix not having placeholder in select dropdown
    return (
      <div>
        <button onClick={() => {this.props.orderSubmit()}}>Submit Order</button>
        <button onClick={() => {this.toggleModal()}}>Add New Product</button>
        <Modal 
        isOpen={this.state.modalOpen}
        contentLabel="Add New Product Form"
        onRequestClose={()=> {this.toggleModal()}}
        shouldCloseOnOverlayClick={false}
        style={addProductStyles}
        >
          <button onClick={()=>{this.toggleModal()}}>Close</button>
          <form className="addProduct-form"onSubmit={this.props.onNewProductSubmit} onChange={this.props.onChangeNewProduct}>
            <p>Please enter product details:</p>
            <label htmlFor="productName" className="newProduct-label">Name:</label>
            <input type="text" name="productName" value={this.props.productForm.productName} />
            <label htmlFor="imgUrl" className="newProduct-label">Image Name:</label>
            <input type="text" name="imgUrl" value={this.props.productForm.imgUrl}/>
            <label htmlFor="price" className="newProduct-label">Price:</label>
            <input type="text" name="price" value={this.props.productForm.price}/>
            <label htmlFor="categoryId" className="newProduct-label">Category:</label>
            <select name="categoryId" defaultValue={this.props.productForm.categoryId} onChange={this.props.onChangeNewProduct}>
            {this.props.productForm.categoryId}
              {categories}
            
            </select>  
            <label htmlFor="description" className="newProduct-label">Description:</label>
            <textarea type="text" name="description"  value={this.props.productForm.description}/>
            
            <button className="addProduct-button">Add Product</button>
          </form>  
        </Modal>  
        <ul className="product-list">{this.props.products.map((product,index) => {
          return (
          <Product 
            key={index} 
            product={product}
            onCartAdd={this.props.addCart}
            onChangeQuantity={this.props.onChangeQuantity}
            index={index}
            categories={categories}
            onEditChange={this.props.onEditChange}
            editProduct={this.props.editProduct}
            onEditSubmit={this.props.onEditSubmit}
              />
          )
        })}</ul>
        
      </div>
    );
  }
}
  
  class Product extends Component {
    constructor(props){
      super(props);
      this.state = {
        editModal: false,
        cartAdded: false,
        addToCart: true
      }

      this.toggleEditModal = this.toggleEditModal.bind(this);
      this.toggleCartMethod = this.toggleCartMethod.bind(this);
    }

    toggleEditModal(){
      this.setState({
        editModal: this.state.editModal ? false : true
      })
    }

    toggleCartMethod(){
      this.setState({
        addToCart: this.state.addToCart ? false : true
      })
    }
    
    render(){
      const cartMethod = this.state.addToCart;

      return (
        <li className="product-item">
        <img src={"/img/" + this.props.product.ImgURL} alt={this.props.product.Name}/>
        <div className="product-name">{this.props.product.Name}</div>
        <div className="product-price">$ {this.props.product.Price}</div>
        <Quantity select={this.props.product.Quantity} count={10} onChangeQuantity={this.props.onChangeQuantity} index={this.props.index}/>
        <button onClick={this.toggleEditModal}>Edit Details</button>
        <button 
        className={cartMethod ? "add-cart-button" : "remove-cart-button"}
         onClick={() => {this.props.onCartAdd(this.props.product,this.state.addToCart); this.toggleCartMethod();}}>
         {(cartMethod) ? "Add to Cart" : "Remove"}
         </button>
        <Modal 
        isOpen={this.state.editModal}
        contentLabel="Add New Product Form"
        onRequestClose={this.toggleEditModal}
        shouldCloseOnOverlayClick={false}
        style={addProductStyles}>
          <EditForm 
          product={this.props.product} 
          categories={this.props.categories} 
          onEditChange={this.props.onEditChange} 
          editProduct={this.props.editProduct}
          onEditSubmit={this.props.onEditSubmit}
          onClose={this.toggleEditModal}
          /> 
        </Modal>
       </li>
      );
    }
  }

  const EditForm = (props) => {
    console.log(props)
      //TODO: find a way to make the values already populate in form fields.
      return (
        <div>
          <button onClick={props.onClose}>Close</button>
          <img src={"/img/" + props.product.ImgURL} alt={props.product.Name}/>
          <form 
          /* onSubmit={this.props.onNewProductSubmit}  */
          
          /* onFocus={(e)=>{props.onEditChange(e)}} */
          onSubmit={(e) => {props.onEditSubmit(e,props.product.ProductID); props.onClose();}}
          >
            <p>Update details:</p>
            <label htmlFor="productName">Name</label>
            <input type="text" name="productName" placeholder={props.product.Name} value={props.editProduct.productName} onChange={(e) => {props.onEditChange(e)}}/>
            <label htmlFor="price">Price</label>
            <input type="text" name="price" placeholder={props.product.Price}value={props.editProduct.price} onChange={(e) => {props.onEditChange(e)}}/>
            <label htmlFor="categoryId">Category</label>
            <select name="categoryId" placeholder={props.product.CategoryID} value={props.editProduct.categoryId} onChange={(e) => {props.onEditChange(e)}}>
              {props.categories}
            </select>  
            <label htmlFor="description">Description</label>
            <textarea type="text" name="description" placeholder={props.product.Description} value={props.editProduct.description} onChange={(e) => {props.onEditChange(e)}}/>
            <button>Save Changes</button>
          </form>   
        </div>
      )
  };
  
  const addProductStyles = {
    content : {
      top                   : '10%',
      left                  : '10%',
      right                 : '10%',
      bottom                : '10%',
      // width                 : '400px',
      // height                : '400px',
      margin                : '0 auto',
      padding               : '0'

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
  export default Products;