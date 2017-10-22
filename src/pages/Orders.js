import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';
import './main.css';

class Orders extends Component {
    constructor(props){
        super(props);
        this.state = {
            orders: [],
            search: null,
            results: {
                orderId: null,
                items: []
            },
            editModal: false
        }
        this.handleItemRemove = this.handleItemRemove.bind(this);
        this.handleOrderUpdate = this.handleOrderUpdate.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleOrderDelete = this.handleOrderDelete.bind(this);
        this.getOrders = this.getOrders.bind(this);
    }
    // componentWillMount(){
    //     this.getOrders();
    //   }
    getOrders(){
        var url = 'http://localhost:5000/orders';
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
    
    //e.preventDefault();
    //TODO: remove stateCopy as probably wont be needed
    //var stateCopy = _.map(this.state.orders,_.cloneDeep);

    //TODO: remove state.search if no longer have free floating delete button
    var orderId = this.state.results.orderId;
    var url = 'http://localhost:5000/orders/' + orderId;
    request
        .del(url)
        .set('accept','json')
        .end((err,res) => {
        if(err){
            throw Error(err);
        }
        //TODO: remove this.getorders later
        //this.getOrders();
        this.setState({
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
        e.preventDefault();
        var orderId = this.state.search;
        var url = 'http://localhost:5000/orders/' + orderId;
        request.get(url)
        .set('accept','json')
        .end((err,res) => {
          if(err){
            throw Error(err);
          }
          this.setState({
            results: {
                orderId: orderId,
                items: JSON.parse(res.text)
            }
          });
          console.log(this.state);
        });
    }

    handleItemRemove(key){
        console.log(this.state);
        var stateCopy = _.cloneDeep(this.state.results.items);
        console.log(stateCopy[key]);
        stateCopy = stateCopy.filter((item,index) => index !== key)
        console.log(this.state);

        this.setState({
            results: {
               orderId: this.state.results.orderId, 
               items: stateCopy
            }
        })
        console.log(this.state);
    }

    handleOrderUpdate(){
        var itemsCopy = _.cloneDeep(this.state.results.items);
        var orderId = this.state.results.orderId;
        var newTotal = _.sumBy(itemsCopy,(item) => {
            return item.Quantity * item.Price;
        })
        console.log(newTotal);
        var url = 'http://localhost:5000/orders/'
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
                  console.log(res);
            })
    }

    handleQuantityChange(e,orderIndex){
        e.preventDefault();
        console.log(e.target.value,orderIndex);
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
        const orders = _.map(this.state.orders,(order,index) => {
            
            return <li key={index} >Order Number: {order.OrderID}, Order Total: ${order.OrderTotal}, Order Completed: {order.Completed}</li>
        })
        const orderTotal = _.sumBy(this.state.results.items,(item) => {
            return item.Quantity * item.Price;
        })
        const results = _.map(this.state.results.items,(result,index) => {
            let total = result.Price * result.Quantity
            return (
                    <tr key={index}>
                        <td>{result.OrderID}</td>
                        <td>{result.Name}</td>
                        <td><Quantity select={result.Quantity} count={10} index={index} onChangeQuantity={this.handleQuantityChange}/></td>
                        <td>${total.toFixed(2)}</td>
                        <td><button className="results-remove"onClick={()=>{this.handleItemRemove(index)}}>Remove</button></td>

                    </tr>    
            )
        })
        return (
            
            <div>
                    <button onClick={this.getOrders}>Get All Orders</button>
                <form className="order-search">
                    <input type="text" name="searchOrder" placeholder="Search OrderID"onChange={this.handleSearchChange.bind(this)}/>
                    <button onClick={this.handleOrderSearch.bind(this)}>Search</button>
                </form>
                {(this.state.results.items.length <= 0) ? null : 
                <div className="orderResults">
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
                    <div className="orderResults-modify">     
                        <button onClick={this.handleOrderUpdate}>Update Order</button>
                        <button onClick={this.handleOrderDelete}>Cancel Order</button>   
                    </div>
                </div>   
                } 
                <ul className="orders-list">{orders}</ul>
            </div>

        )
    }
}

export default Orders;

const Quantity = (props) => {
    const options = [];
    for(var i =1; i<=props.count;i++){
        
        options.push(<option key={i} value={i}>{i}</option>)
    }
    
    return (
        <select value={props.select} onChange={(e)=> {props.onChangeQuantity(e,props.index)}}>
            {options}
        </select>
    );
}