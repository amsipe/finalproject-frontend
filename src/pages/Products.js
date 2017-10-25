import React, { Component } from 'react';
import Modal from 'react-modal';
// import request from 'superagent';
import _ from 'lodash';
import './main.css';
import ProductItem from './ProductItem'


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
      <div className="products-container">
        <button className="add-product-button"onClick={() => {this.toggleModal()}}>Add New Product</button>
        <Modal 
        isOpen={this.state.modalOpen}
        contentLabel="Add New Product Form"
        onRequestClose={()=> {this.toggleModal()}}
        shouldCloseOnOverlayClick={false}
        style={modalStyles}
        >
          <button className="modalClose"onClick={()=>{this.toggleModal()}}>Close</button>
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
            
            <button className="add-product-confirm">Add Product</button>
          </form>  
        </Modal>  
        <ul className="product-list">{this.props.products.map((product,index) => {
          return (
          <ProductItem 
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
  
  // class Product extends Component {
  //   constructor(props){
  //     super(props);
  //     this.state = {
  //       editModal: false,
  //       addToCart: true,
  //       detailModal: false
  //     }

  //     this.toggleEditForm = this.toggleEditForm.bind(this);
  //     this.toggleCartMethod = this.toggleCartMethod.bind(this);
  //     this.toggleDetailModal = this.toggleDetailModal.bind(this);
  //   }

  //   toggleEditForm(){
  //     this.setState({
  //       editModal: this.state.editModal ? false : true
  //     })
  //   }

  //   toggleCartMethod(){
  //     this.setState({
  //       addToCart: this.state.addToCart ? false : true
  //     })
  //   }

  //   toggleDetailModal(){
  //     this.setState({
  //       detailModal: this.state.detailModal ? false : true
  //     })
  //   }
  //   componentDidUpdate(){
  //     console.log('hotdog')
  //   }
  //   render(){
  //     const cartMethod = this.state.addToCart;

  //     return (
  //       <li className="product-item">
  //         <div>
  //           <img className="product-image" src={"/img/" + this.props.product.ImgURL} alt={this.props.product.Name} onClick={this.toggleDetailModal}/>
  //           <div className="product-name">{this.props.product.Name}</div>
  //           <div className="product-price">$ {this.props.product.Price}</div>
  //         </div>
  //         <div className="add-cart-options">
  //           <Quantity select={this.props.product.Quantity} count={10} onChangeQuantity={this.props.onChangeQuantity} index={this.props.index}/>
  //           <button 
  //           className={cartMethod ? "add-cart-button border-grow" : "remove-cart-button border-grow"}
  //           onClick={() => {this.props.onCartAdd(this.props.product,this.state.addToCart); this.toggleCartMethod();}}>
  //           {(cartMethod) ? "ADD TO CART" : "Remove"}
  //           </button>
  //         </div>
          
  //         <Modal           
  //         isOpen={this.state.detailModal}
  //         contentLabel="Product Details"
  //         onRequestClose={this.toggleDetailModal}
  //         shouldCloseOnOverlayClick={true}
  //         style={modalStyles}>
  //           <EditForm 
  //           product={this.props.product} 
  //           categories={this.props.categories} 
  //           onEditChange={this.props.onEditChange} 
  //           editProduct={this.props.editProduct}
  //           onEditSubmit={this.props.onEditSubmit}
  //           onClose={this.toggleDetailModal}
  //           toggleEditForm={this.toggleEditForm}
  //           showEdit={this.state.editModal}
  //           /> 
  //         </Modal>
  //       </li>
  //     );
  //   }
  // }

  // const EditForm = (props) => {

  //     //TODO: find a way to make the values already populate in form fields.
  //     return (
  //       <div>
  //         <button className="modalClose" onClick={props.onClose}>Close</button>
  //         <div className="product-details-wrapper">
  //           <img src={"/img/" + props.product.ImgURL} alt={props.product.Name}/>   
  //           <div className="product-details-container">
  //             <div className="product-name">{props.product.Name}</div>
  //             <div className="product-price">$ {props.product.Price}</div>
  //             <div className="product-description"><p>{props.product.Description}</p></div>
  //           </div>
            
  //         </div>
  //         <button onClick={props.toggleEditForm}>Edit Details</button>

  //         {props.showEdit ? 
  //           <form onSubmit={(e) => {props.onEditSubmit(e,props.product.ProductID); props.toggleEditForm();}}>
  //             <p>Update details:</p>
  //             <label htmlFor="productName">Name</label>
  //             <input type="text" name="productName" value={props.editProduct.productName} onChange={(e) => {props.onEditChange(e)}}/>
  //             <label htmlFor="price">Price</label>
  //             <input type="text" name="price" value={props.editProduct.price} onChange={(e) => {props.onEditChange(e)}}/>
  //             <label htmlFor="categoryId">Category</label>
  //             <select name="categoryId" value={props.editProduct.categoryId} onChange={(e) => {props.onEditChange(e)}}>
  //               {props.categories}
  //             </select>  
  //             <label htmlFor="description">Description</label>
  //             <textarea type="text" name="description" placeholder={props.product.Description} value={props.editProduct.description} onChange={(e) => {props.onEditChange(e)}}/>
  //             <button>Save Changes</button>
  //           </form>   
  //         :
  //         null  
  //         }
  //       </div>
  //     )
  // };
 
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
  export default Products;