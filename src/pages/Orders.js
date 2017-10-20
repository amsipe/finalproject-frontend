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
            results: null
        }
    }
    componentWillMount(){
        this.getOrders();
      }
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
    handleOrderDelete(){
    
    //e.preventDefault();
    var stateCopy = _.map(this.state.orders,_.cloneDeep);
    var url = 'http://localhost:5000/orders/' + this.state.search;
    request
        .del(url)
        .set('accept','json')
        .end((err,res) => {
        if(err){
            throw Error(err);
        }
        this.getOrders();
        })
    }

    handleSearchChange(e){
        this.setState({
            search: e.target.value
        })
    }

    handleOrderSearch(e){
        e.preventDefault();
        console.log(e);
        var url = 'http://localhost:5000/orders/' + this.state.search;
        request.get(url)
        .set('accept','json')
        .end((err,res) => {
          if(err){
            throw Error(err);
          }
          this.setState({
            results: JSON.parse(res.text)
          });
        });
    }

    render() {
        const orders = _.map(this.state.orders,(order,index) => {
            
            return <li key={index} >Order Number: {order.OrderID}, Order Total: ${order.OrderTotal}, Order Completed: {order.Completed}</li>
        })
        const results = _.map(this.state.results,(result,index) => {
            let total = result.Price * result.Quantity
            return (
                    <tr key={index}>
                        <td>{result.OrderID}</td>
                        <td>{result.Name}</td>
                        <td>{result.Quantity}</td>
                        <td>${total.toFixed(2)}</td>
                        <td><button>Remove</button></td>

                    </tr>    
            )
        })
        return (
            
            <div>This is orders page
                <form >
                    <input type="text" name="searchOrder" onChange={this.handleSearchChange.bind(this)}/>
                    <button onClick={this.handleOrderSearch.bind(this)}>Search</button>
                    <button onClick={this.handleOrderDelete.bind(this)}>Delete</button>
                </form>
                {(!this.state.results) ? null : 
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
                        <tbody>
                            {results}
                        </tbody>
                    </table>     
                    <button>Update Order</button>
                    <button>Cancel Order</button>   
                </div>   
                } 
                <ul className="orders-list">{orders}</ul>
            </div>

        )
    }
}

export default Orders;