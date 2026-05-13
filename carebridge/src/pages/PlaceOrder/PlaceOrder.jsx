import React, { useContext } from 'react'
import "./PlaceOrder.css"
import { StoreContext } from '../../context/StoreContext';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const {totalQuantity,token,cartItems,url,menu,orderId,setOrderId}=useContext(StoreContext);
    const navigate=useNavigate();
    const [data,setData]=useState({
      firstName:"",
      lastName:"",
      email:"",
      street:"",
      city:"",
      state:"",
      country:"",
      phone:""
    })

    useEffect(() => {
  if (orderId) {
    console.log("Order ID updated:", orderId);
  }
}, [orderId]);

    const onChangeHandler=(event)=>{
      const name=event.target.name;
      const value=event.target.value;
      setData(data=>({...data,[name]:value}))
    }

    const placeOrder=async(event)=>{
      event.preventDefault();
      let orderItems=[];
      menu.forEach((item) => {
        if (cartItems[item._id] > 0) {
          let itemInfo = { ...item, quantity: cartItems[item._id] };
          orderItems.push(itemInfo);
        }
      });
      let orderData={
        address:data,
        items:orderItems,
      }
      try {
        let res=await axios.post(url+"/api/order/place",orderData,{headers:{token}})
        if(res.data.success){
          const newOrder=res.data.orderId;
          setOrderId(newOrder)
          navigate(`/orderdetails/${res.data.orderId}`);
        }
        else{
          alert(res.data.message || "Error in Placing Order")
        }
      } catch (error) {
        console.error("Order error:", error);
        alert(error.response?.data?.message || "Failed to connect to the server. Please try again.");
      }
    }

  return (
    <form onSubmit={placeOrder} action="" className="place-order">
        <div className="place-order-left">
            <h3>Delivery Information</h3>
            <div className="multi-fields">
                <input type="text" name='firstName'  onChange={onChangeHandler} id="" value={data.firstName} placeholder='First Name'/>
                <input type="text" name="lastName" id="" value={data.lastName} onChange={onChangeHandler} placeholder='Last Name'/>
            </div>
            <input type="email" name="email" id="" value={data.email} onChange={onChangeHandler} placeholder='Email Address'/>
            <input type="text" name='street' value={data.street} onChange={onChangeHandler} placeholder='Street'/>
            <div className="multi-fields">
                <input type="text" name="city" id="" value={data.city} onChange={onChangeHandler} placeholder='City'/>
                <input type="text" name="state" value={data.state} onChange={onChangeHandler} id="" placeholder='State'/>
            </div>

            <input type="Number" name="phone" value={data.phone} onChange={onChangeHandler} placeholder='Phone No' />

          </div>

        <div className="place-order-right">
            <div className="cart-totals">
        <h2>Cart Totals</h2>
        <div>
          <div className="cart-toatal-details">
            <p>Total Quantity</p>
            <p>{totalQuantity}</p>
          </div>
          <hr />
          <div className="cart-toatal-details">
            <p>Delivery Fee</p>
            <p>{2}</p>
            
          </div>
          <hr />
          <div className="cart-toatal-details">
            <b>Total</b>
            <b>{2}</b>
          </div>
        </div>
        <button type='submit'>PROCEED TO PLACE Order</button>
      </div>
        </div>
    </form>
  )
}

export default PlaceOrder
