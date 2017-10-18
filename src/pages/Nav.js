import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import './main.css';

class Nav extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <header>
                <ul className="main-nav">
                    <li><NavLink exact to="/">HOME</NavLink></li>
                    <li><NavLink to="/products">PRODUCTS</NavLink></li>
                    <li><NavLink to="/orders">ORDERS</NavLink></li>
                </ul>
            </header>
        )
    }
}

export default Nav;