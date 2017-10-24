import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import './main.css';

class Nav extends Component {
    constructor(){
        super();
        this.state = {
            mobileNav: false //state here is only used to control mobile nav menu visibility
        }
        this.toggleNavMenu = this.toggleNavMenu.bind(this);
    }
toggleNavMenu(){
    console.log('hotdog');
    this.setState({
        mobileNav: !this.state.mobileNav
    })
}

    render() {
        return (
            <header>
                <ul className="main-nav">
                    <li><NavLink exact to="/">HOME</NavLink></li>
                    <li><NavLink to="/products">PRODUCTS</NavLink></li>
                    <li><NavLink to="/orders">ORDERS</NavLink></li>
                </ul>
                <div className="mobile-nav">
                    <i className="fa fa-bars" aria-hidden="true" onClick={this.toggleNavMenu}></i>
                <ul className={`mobile-links ${this.state.mobileNav ? "shiftUp" : "shiftDown"}`}>
                    <li><NavLink exact to="/" onClick={this.toggleNavMenu}>HOME</NavLink></li>
                    <li><NavLink to="/products" onClick={this.toggleNavMenu}>PRODUCTS</NavLink></li>
                    <li><NavLink to="/orders" onClick={this.toggleNavMenu}>ORDERS</NavLink></li>
                </ul>
                </div>
                <div className="cart">
                    <span className="checkout" onClick={this.props.toggleCartOpen}>Checkout</span>
                    <span>Cart Items: {this.props.cart.items.length}</span>
                    <span>Cart Total: ${this.props.cart.total.toFixed(2)}</span>
                    
                </div>
            </header>
        )
    }
}

export default Nav;