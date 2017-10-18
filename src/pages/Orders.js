import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';
import './main.css';

class Orders extends Component {
    constructor(props){
        super(props);
        this.state = {
            orders: []
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

    render() {
        var orders = _.map(this.state.orders,(order,index) => {
            console.log(order);
            return <li key={index} >Order Number: {order.OrderID}, Order Total: ${order.OrderTotal}, Order Completed: {order.Completed}</li>
          })
        return (
            <div>This is orders page
                <ul className="orders-list">{orders}</ul>
            </div>

        )
    }
}

export default Orders;