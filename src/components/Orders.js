import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';

import Quantity from './Quantity';
const herokuUrl = 'https://radiant-ocean-22273.herokuapp.com'
class Orders extends Component {
    constructor(props){
        super(props);
        this.state = { //orders page controls it's own state since it doesn't need to interact with global state
            orders: [],
            search: null,
            results: {
                orderId: null,
                items: []
            }
        }
        this.handleItemRemove = this.handleItemRemove.bind(this);
        this.handleOrderUpdate = this.handleOrderUpdate.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleOrderDelete = this.handleOrderDelete.bind(this);
        this.getOrders = this.getOrders.bind(this);
    }

    getOrders(){
        //push all existing orders into orders-state array
        var url = `${herokuUrl}/orders`;
        request.get(url)
        .set('accept','json')
        .end((err,res) => {
          if(err){
            throw Error(err);
          }
          this.setState({
            orders: JSON.parse(res.text)
          });
        });
      }

    handleOrderDelete(id){
        //use the orderId that was searched to make a delete request
        var orderId = this.state.results.orderId;
        var url = `${herokuUrl}/orders/${orderId}`;
        request
            .del(url)
            .set('accept','json')
            .end((err,res) => {
            if(err){
                throw Error(err);
            }
            this.setState({ //clear out the results in state to update dom
                results: {
                    orderId: null,
                    items: []
                }
            })
            })
    }

    handleSearchChange(e){
        this.setState({
            search: parseInt(e.target.value,10)
        })
    }

    handleOrderSearch(e){
        //pass orderId into params for the get request
        e.preventDefault();
        var orderId = this.state.search;
        var url = `${herokuUrl}/orders/${orderId}`;
        request.get(url)
        .set('accept','json')
        .end((err,res) => {
          if(err){
            throw Error(err);
          }
          this.setState({
            results: {
                orderId,
                items: JSON.parse(res.text)
            }
          });
        });
    }

    handleItemRemove(key){
        //takes the index of the array shown in html and filters out matched index in state
        var stateCopy = _.cloneDeep(this.state.results.items);
        stateCopy = stateCopy.filter((item,index) => index !== key)
        this.setState({
            results: {
               orderId: this.state.results.orderId, 
               items: stateCopy
            }
        })
    }

    handleOrderUpdate(){

        //package up updated order from state
        //backend will handle updating correct Ids
        var itemsCopy = _.cloneDeep(this.state.results.items);
        var orderId = this.state.results.orderId;
        var newTotal = _.sumBy(itemsCopy,(item) => {
            return item.Quantity * item.Price;
        })
        var url = `${herokuUrl}/orders`;
        request.put(url)
            .set('accept','json')
            .send({
                orderId,
                newTotal,
                items: itemsCopy
            })
            .end((err,res) => {
                if(err){
                    throw Error(err);
                  }
                  this.setState({ //clear out search results if success
                    results: {
                        orderId: null,
                        items: []
                    }
                })
            })
    }

    handleQuantityChange(e,orderIndex){
        //finds matched item in orders results array and updates quantity
        e.preventDefault();
        var itemsCopy = _.cloneDeep(this.state.results.items);
        itemsCopy = _.map(itemsCopy,(item,index) => {
            if(index === orderIndex){
                item.Quantity = parseInt(e.target.value,10);
                return item;
            }
            return item;
        })
        this.setState({
            results: {
                orderId: this.state.results.orderId,
                items: itemsCopy
            }
        })
    }

    render() {
        const orders = _.map(this.state.orders,(order,index) => { //all orders from database
            return (
                <tr key={order.OrderID}>
                    <td>{order.OrderID}</td>
                    <td style={{textAlign: 'right',paddingRight: '5px'}}>${order.OrderTotal.toFixed(2)}</td>
                    <td>{order.CustomerID}</td>
                    <td>{order.Completed > 0 ? "Completed" : "Pending" }</td>
                </tr>
            )
        })
        const grossSales = _.sumBy(this.state.orders,'OrderTotal'); 
        const orderTotal = _.sumBy(this.state.results.items,(item) => {
            return item.Quantity * item.Price;
        })
        const results = _.map(this.state.results.items,(result,index) => { //creates the results table rows
            let total = result.Price * result.Quantity
            return (
                    <tr key={index}>
                        <td>{result.OrderID}</td>
                        <td>{result.Name}</td>
                        <td><Quantity select={result.Quantity} count={10} index={index} onChangeQuantity={this.handleQuantityChange}/></td>
                        <td>${total.toFixed(2)}</td>
                        <td><a className="results-remove" onClick={()=>{this.handleItemRemove(index)}}>Remove</a></td>
                    </tr>    
            )
        })

        return (
            //initial items rendered are just a search box and two buttons
            //conditional render for two potential html tables
            <div className="ordersPage-container">
                <div className="search-container">    
                    <form className="order-search">
                        <input type="text" name="searchOrder" placeholder="Search OrderID"onChange={this.handleSearchChange.bind(this)}/>
                        <button onClick={this.handleOrderSearch.bind(this)}>Search</button>
                        
                    </form>
                    <button className="get-orders-btn"onClick={this.getOrders}>Get All Orders</button>
                </div>
                {(this.state.results.items.length <= 0) ? null : //conditional render if results > 0
                <div className="table-results">
                    <table>
                        <thead>
                            <tr>
                                <th>OrderID</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <td colSpan={5}>Order Total: <strong>${orderTotal.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>    
                        <tbody>
                            {results}
                        </tbody>
                    </table>
                    <div className="table-results-modify">     
                        <button onClick={this.handleOrderUpdate}>Update Order</button>
                        <button onClick={this.handleOrderDelete}>Cancel Order</button>   
                    </div>
                </div>   
                }
                {orders.length <= 0 ? //checks if any orders are in the state.orders array
                    null
                    :
                    <div className="table-results">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Order Total</th>
                                    <th>Customer ID</th>
                                    <th>Order Status</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <td colSpan={4}>Total Sales: <strong>${grossSales.toFixed(2)}</strong></td>
                                </tr>
                            </tfoot>    
                            <tbody>
                                {orders}
                            </tbody>
                        </table>
                    </div>                
                } 
            </div>
        )
    }
}

export default Orders;

