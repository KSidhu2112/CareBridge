import React, { useContext, useEffect, useState } from "react";
import "./UserOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const UserOrders = () => {
  const {  token, url } = useContext(StoreContext);
  const [orders, setOrders]=useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          url + "/api/order/myorders",
          { headers: { token } }
        );
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (token) fetchOrders();
  }, [token, url]);

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`user-star ${star <= Math.round(rating) ? 'user-star-filled' : 'user-star-empty'}`}>
        ★
      </span>
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", ...new Set(orders.map(o => o.status))];

  return (
    <div className="my-orders">
      <div className="orders-header-section">
        <h2>My Orders</h2>
        <div className="orders-filters">
            <input 
                type="text" 
                placeholder="Search by ID or items..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
            >
                {statuses.map((status, idx) => (
                    <option key={idx} value={status}>{status}</option>
                ))}
            </select>
        </div>
      </div>

      {!orders || filteredOrders.length === 0 ? (
        <p>No orders found matching your criteria.</p>
      ) : (
        <div className="orders-container">
          {filteredOrders.map(order => (
            <div className="order-card" key={order._id}>
              <div className="order-info">
                <p><b>Order ID:</b> {order._id.slice(-8)}</p>
                <p><b>Status:</b> <span className={`status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span></p>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Boy Rating Section */}
              {order.deliveryBoyDetails && (
                <div className="delivery-boy-info">
                  <div className="db-detail-row">
                    <span className="db-detail-icon">🚚</span>
                    <span className="db-detail-name">{order.deliveryBoyDetails.name}</span>
                    <span className="db-detail-rating">
                      {renderStars(order.deliveryBoyDetails.averageRating || 0)}
                      <span className="db-detail-avg">
                        {order.deliveryBoyDetails.averageRating 
                          ? order.deliveryBoyDetails.averageRating.toFixed(1) 
                          : "N/A"}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Your Rating for this order */}
              {order.rating && (
                <div className="your-rating-badge">
                  <span>Your rating:</span>
                  <span className="your-rating-stars">{renderStars(order.rating)}</span>
                  <span className="your-rating-num">{order.rating}/5</span>
                </div>
              )}
              
              <div className="order-actions">
                <button 
                  className="track-btn" 
                  onClick={() => navigate(`/track/${order._id}`)}
                >
                  Track Order
                </button>
                <button 
                  className="details-btn" 
                  onClick={() => navigate(`/orderdetails/${order._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;

