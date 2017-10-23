import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

import './main.css';

class Nav extends Component {
    // constructor(){
    //     super();
    // }


    render() {
        return (
            <header>
                <ul className="main-nav">
                    <li><NavLink exact to="/">HOME</NavLink></li>
                    <li><NavLink to="/products">PRODUCTS</NavLink></li>
                    <li><NavLink to="/orders">ORDERS</NavLink></li>
                </ul>
                <div className="cart">
                    <span className="checkout" onClick={this.props.toggleCartOpen}>Checkout</span>
                    <span>Cart Items: {this.props.cart.items.length}</span>
                    <span>Cart Total: {this.props.cart.total}</span>
                    
                </div>
            </header>
        )
    }
}

export default Nav;