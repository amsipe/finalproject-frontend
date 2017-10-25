import React, { Component } from 'react';
import _ from 'lodash';
import './main.css';
import ProductItem from './ProductItem';


class Products extends Component {

  render() {

    const categories = _.map(this.props.categories,(category,index) => {
      return (
        <option key={index} value={category.CategoryID}>{_.capitalize(category.Category)}</option>
      )
    })
    console.log(categories);
    //TODO: fix not having placeholder in select dropdown
    return (
      <div className="products-container">
        <ul className="product-list">{this.props.products.map((product,index) => {
          return (
            <ProductItem 
              key={product.ProductID} 
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
  
  export default Products;