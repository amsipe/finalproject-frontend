import React, { Component } from 'react';
import Modal from 'react-modal';
import modalStyles from '../utils/ModalStyles'

import Quantity from './Quantity';

class ProductItem extends Component {
    constructor(props){
      super(props);
      this.state = { //state exists here to just toggle modals and button css
        detailModal: false, //handles showing the details modal
        editModal: false, //handles showing the edit form in details modal
        addToCart: true //handles showing which css class on the cart buttons
      }

      this.toggleEditForm = this.toggleEditForm.bind(this);
      this.toggleCartMethod = this.toggleCartMethod.bind(this);
      this.toggleDetailModal = this.toggleDetailModal.bind(this);
      this.handleEditFormClose = this.handleEditFormClose.bind(this);
    }

    toggleEditForm(){
      this.setState({
        editModal: !this.state.editModal
      })
    }

    handleEditFormClose(){
      this.setState({
        editModal: false
      })
    }

    toggleCartMethod(){
      this.setState({
        addToCart: !this.state.addToCart
      })
    }

    toggleDetailModal(){
      this.setState({
        detailModal: !this.state.detailModal
      })
    }

    render(){
      return (
        <li className="product-item">
          <div>
            <img className="product-image" src={"/img/" + this.props.product.ImgURL} alt={this.props.product.Name} onClick={this.toggleDetailModal}/>
            <div className="product-name">{this.props.product.Name}</div>
            <div className="product-price">$ {this.props.product.Price}</div>
          </div>
          <div className="add-cart-options">
            <Quantity select={this.props.product.Quantity} count={10} onChangeQuantity={this.props.onChangeQuantity} index={this.props.index}/>
            <button 
            className={!this.props.product.InCart ? "add-cart-button border-grow" : "remove-cart-button border-grow"}
            onClick={() => {
                  this.props.onCartAdd(this.props.product,!this.props.product.InCart);
                  this.toggleCartMethod();
                }
              }>
            {!this.props.product.InCart ? "ADD TO CART" : "REMOVE"}
            </button>
          </div>
          
          <Modal           
          isOpen={this.state.detailModal}
          contentLabel="Product Details" //screen readers
          onRequestClose={()=>{this.toggleDetailModal(); this.toggleEditForm();}}
          shouldCloseOnOverlayClick={true}
          closeTimeoutMS={100}
          style={modalStyles}>
            <ProductDetails 
            product={this.props.product} 
            categories={this.props.categories} 
            onClose={this.toggleDetailModal}

            //edit form props
            showEdit={this.state.editModal}
            editedProduct={this.props.editedProduct}
            onEditChange={this.props.onEditChange} 
            onEditSubmit={this.props.onEditSubmit}
            toggleEditForm={this.toggleEditForm}
            closeEditForm={this.handleEditFormClose}
            /> 
          </Modal>
        </li>
      );
    }
  }

  const ProductDetails = (props) => {

      //TODO: find a way to make the values already populate in edit form fields.
      return (
        <div>
          <button className="modalClose" onClick={()=>{props.onClose(); props.closeEditForm();}}>Close</button>
          <div className="product-details-wrapper">
            <img src={"/img/" + props.product.ImgURL} alt={props.product.Name}/>   
            <div className="product-details-container">
              <div className="product-name">{props.product.Name}</div>
              <div className="product-price">$ {props.product.Price}</div>
              <div className="product-description"><p>{props.product.Description}</p></div>
            </div>
            
          </div>
          <a className="edit-toggle"onClick={props.toggleEditForm}>Edit Details</a>

          {props.showEdit ? 
            <form className="edit-form"onSubmit={(e) => {props.onEditSubmit(e,props.product.ProductID); props.toggleEditForm();}}>
              <p>Update details:</p>
              <div className="edit-container-left">
                <label htmlFor="productName">Name</label>
                <input type="text" name="productName" value={props.editedProduct.productName} onChange={(e) => {props.onEditChange(e)}}/>
                <label htmlFor="price">Price</label>
                <input type="text" name="price" value={props.editedProduct.price} onChange={(e) => {props.onEditChange(e)}}/>
              </div>
              <div className="edit-container-right">
                <label htmlFor="description">Description</label>
                <textarea type="text" name="description" rows="6" value={props.editedProduct.description} onChange={(e) => {props.onEditChange(e)}}/>
              </div>
              <div className="edit-container-left">
                <label htmlFor="categoryId">Category</label>
                <select name="categoryId" value={props.editedProduct.categoryId} onChange={(e) => {props.onEditChange(e)}}>
                  {props.categories}
                </select>  
              </div>  
              <button>Save Changes</button>
            </form>   
          :
          null  
          }
        </div>
      )
  };


  export default ProductItem;