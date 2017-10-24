import React, { Component } from 'react';
import Modal from 'react-modal';
// import request from 'superagent';
import _ from 'lodash';
import './main.css';

import Quantity from './Quantity';

class ProductItem extends Component {
    constructor(props){
      super(props);
      this.state = {
        detailModal: false, //handles showing the details modal
        editModal: false, //handles showing the edit form in details modal
        addToCart: true //handles showing which css class to show
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


    componentDidUpdate(){
      console.log('hotdog')
    }
    render(){
      const cartMethod = this.state.addToCart;

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
            className={cartMethod ? "add-cart-button border-grow" : "remove-cart-button border-grow"}
            onClick={() => {this.props.onCartAdd(this.props.product,this.state.addToCart); this.toggleCartMethod();}}>
            {(cartMethod) ? "ADD TO CART" : "Remove"}
            </button>
          </div>
          
          <Modal           
          isOpen={this.state.detailModal}
          contentLabel="Product Details"
          onRequestClose={this.toggleDetailModal}
          shouldCloseOnOverlayClick={true}
          style={modalStyles}>
            <EditForm 
            product={this.props.product} 
            categories={this.props.categories} 
            onEditChange={this.props.onEditChange} 
            editProduct={this.props.editProduct}
            onEditSubmit={this.props.onEditSubmit}
            onClose={this.toggleDetailModal}
            toggleEditForm={this.toggleEditForm}
            closeEditForm={this.handleEditFormClose}
            showEdit={this.state.editModal}
            /> 
          </Modal>
        </li>
      );
    }
  }

  const EditForm = (props) => {
      //TODO: rename edit form since it's now a child of details view. look at function names too.
      //TODO: find a way to make the values already populate in form fields.
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
                <input type="text" name="productName" value={props.editProduct.productName} onChange={(e) => {props.onEditChange(e)}}/>
                <label htmlFor="price">Price</label>
                <input type="text" name="price" value={props.editProduct.price} onChange={(e) => {props.onEditChange(e)}}/>
              </div>
              <div className="edit-container-right">
                <label htmlFor="description">Description</label>
                <textarea type="text" name="description" rows="6" value={props.editProduct.description} onChange={(e) => {props.onEditChange(e)}}/>
              </div>
              <div className="edit-container-left">
                <label htmlFor="categoryId">Category</label>
                <select name="categoryId" value={props.editProduct.categoryId} onChange={(e) => {props.onEditChange(e)}}>
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

//TODO: move to external file
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

  export default ProductItem;