import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {  assets as fassets } from "../../assets/frontend";
import axios from "axios";

import { StoreContext } from "../../context/StoreContext";

function Navbar({ setIsLogin ,shop,setShop}) {
    const [active, setActive] = useState("Home"); // default active
    const navigate = useNavigate();
    const location = useLocation();
    const isTracking = location.pathname.startsWith("/track");
    const {totalQuantity,setTotalQuantity,token,setToken,orderId,setOrderId,url,role,setRole,userName,setUserName}=useContext(StoreContext);
    const handleClick = (item) => {
      setActive(item);
    };

    const logout=()=>{
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      setToken("");
      setRole("");
      setUserName("");
      navigate("/");
      navigate("/");
    }

    const handleTrackOrder = async () => {
      if (!token) {
        setIsLogin(true);
        return;
      }
      if (orderId) {
        navigate(`/track/${orderId}`);
        return;
      }
      try {
        const res = await axios.get(url + "/api/order/myorders", {
          headers: { token },
        });
        if (res.data.success && res.data.orders && res.data.orders.length > 0) {
          // Find the most recent active order (not Received or Cancelled), or fallback to the latest order
          const activeOrder = res.data.orders.find(
            (o) => o.status !== "Received" && o.status !== "Cancelled"
          );
          if (activeOrder) {
            navigate(`/track/${activeOrder._id}`);
          } else {
            // Fallback to the latest order
            navigate(`/track/${res.data.orders[0]._id}`);
          }
        } else {
          // If no orders, send to myorders page where they can see the "No orders found" state
          navigate("/myorders");
        }
      } catch (err) {
        console.error("Error fetching orders for tracking:", err);
        navigate("/myorders");
      }
    };



  return (
    <div className="navbar">
      <div className="logo">
        <Link to={'/'} onClick={()=>setShop(false)}>
          <span className="logo-text">Care<span className="logo-highlight">Bridge</span></span>
        </Link>
      </div>

      <div className="list">
        <ul>
          <li
            className={active === "Home" ? "active" : ""}
            onClick={() => handleClick("Home")}
          ><Link to="/">Home</Link>
          </li>
          
          <li
            className={active === "About" ? "active" : ""}
            onClick={() => handleClick("About")}
          >
            <a href="/#about">About</a>
          </li>
          <li
            className={active === "Contact" ? "active" : ""}
            onClick={() => handleClick("Contact")}
          >
            <a href="/#contact">Contact</a>
          </li>
        </ul>
      </div>

      

      <div className="navbar-right">
        {role === 'receiver' && (
          <button 
            className="track-order" 
            onClick={() => navigate("/menu")}
          >
            Request Help
          </button>
        )}

        {role === 'receiver' && (
          <button 
            className="track-order" 
            onClick={isTracking ? () => navigate("/cart") : handleTrackOrder}
          >
            {isTracking ? "Cart" : "Track Order"}
          </button>
        )}
        
        {role === 'donor' && (
          <button 
            className="track-order" 
            onClick={() => navigate("/donation")}
          >
            Donate Now
          </button>
        )}
        <div className="navbar-icons">
          <img src={fassets.search_icon} alt="" />
          {(!role || role === 'receiver') && (
            <div className="navbar-search-icon">
              <Link to={'/cart'}><img onClick={()=>setShop(true)} src={fassets.basket_icon} alt="" /></Link>
              <div className= {totalQuantity===0 ? ""  : "dot"}></div>
            </div>
          )}
        </div>

        {shop && role === 'receiver' && (
          <div className="cartbtn">
            <button onClick={() => navigate('/menu')}>Request More</button>
          </div>
        )}

        {!token ? (
          <div className="sign-in">
            <button onClick={()=>setIsLogin(true)}>Sign Up</button>
          </div> 
        ) : (
          <div className="navbar-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="user-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '5px' }}>
              <span className="user-name" style={{ fontWeight: 'bold', fontSize: '14px', color: '#49557e' }}>{userName || "User"}</span>
              <span className={`role-badge`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: role === 'donor' ? '#4CAF50' : '#2196F3', color: 'white', textTransform: 'capitalize', fontWeight: '500' }}>{role}</span>
            </div>
            <img  src={fassets.profile_icon} alt="" style={{ cursor: 'pointer' }} />
            <ul className="nav-profile_dropdown">
              <li onClick={() => navigate("/dashboard")}><img src={fassets.bag_icon} alt="" /><p>Dashboard</p></li>
              {role === 'donor' && <li onClick={() => navigate("/mydonations")}><img src={fassets.bag_icon} alt="" /><p>History</p></li>}
              {role === 'receiver' && <li onClick={() => navigate("/myorders")}><img src={fassets.bag_icon} alt="" /><p>History</p></li>}
              <hr />
              <li onClick={()=>logout()}><img  src={fassets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>

      
    </div>
  );
}

export default Navbar;
