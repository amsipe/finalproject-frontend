import React from 'react';


const Quantity = (props) => {
    const options = [];
    for(var i =1; i<=props.count;i++){
        
        options.push(<option key={i} value={i}>{i}</option>)
    }
    
    return (
        <select className="quantity-select" value={props.select} onChange={(e)=> {props.onChangeQuantity(e,props.index)}}>
            {options}
        </select>
    );
}

export default Quantity;