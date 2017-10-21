import React, { Component } from 'react';
// import request from 'superagent';
import _ from 'lodash';
import './main.css';

import Quantity from './Quantity';

class Products extends Component {

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
          
          <form onSubmit={this.props.onNewProductSubmit} onChange={this.props.onChangeNewProduct}>
            <p>Please enter product details:</p>
            <label htmlFor="productName">Name</label>
            <input type="text" name="productName" value={this.props.productForm.productName} />
            <label htmlFor="imgUrl">Image Name</label>
            <input type="text" name="imgUrl" value={this.props.productForm.imgUrl}/>
            <label htmlFor="price">Price</label>
            <input type="text" name="price" value={this.props.productForm.price}/>
            <label htmlFor="categoryId">Category</label>
            <select name="categoryId" defaultValue={this.props.productForm.categoryId} onChange={this.props.onChangeNewProduct}>
            {this.props.productForm.categoryId}
             {categories}
            
            </select>  
            <label htmlFor="description">Description</label>
            <textarea type="text" name="description"  value={this.props.productForm.description}/>
            
            <button>Add Product</button>
          </form>  
          <ul className="product-list">{this.props.products.map((product,index) => {
            return (
            <Product 
              key={index} 
              product={product}
              onCartAdd={this.props.addCart}
              onChangeQuantity={this.props.onChangeQuantity}
              index={index}
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
        <Quantity select={this.props.product.Quantity} count={10} onChangeQuantity={this.props.onChangeQuantity} index={this.props.index}/>
        <button className="add-button" onClick={() => {this.props.onCartAdd(this.props.product)}}>Add to Cart</button>
       </li>
      );
    }
  }
  
  export default Products;