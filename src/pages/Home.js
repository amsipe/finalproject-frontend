import React, { Component } from 'react';
import request from 'superagent';
import _ from 'lodash';
import './main.css';

class Home extends Component {
    constructor(props){
        super(props);
    }
    render() {
        
        return (
            <div>
                {this.props.children}
                This is the main page.</div>
        )
    }
}

export default Home;