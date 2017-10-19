import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';
import './main.css';

class Orders extends Component {
    constructor(props){
        super(props);
        this.state = {
            orders: [],
            search: null
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

    handleOrderSearch(){
        console.log('hotdog');
    }

    render() {
        var orders = _.map(this.state.orders,(order,index) => {
            
            return <li key={index} >Order Number: {order.OrderID}, Order Total: ${order.OrderTotal}, Order Completed: {order.Completed}</li>
          })
        return (
            <div>This is orders page
                <form >
                    <input type="text" name="deleteOrder" onChange={this.handleSearchChange.bind(this)}/>
                    <button onClick={this.handleOrderDelete.bind(this)}>Delete</button>
                    <button onClick={this.handleOrderSearch.bind(this)}>Search</button>
                </form>
                <ul className="orders-list">{orders}</ul>
            </div>

        )
    }
}

export default Orders;