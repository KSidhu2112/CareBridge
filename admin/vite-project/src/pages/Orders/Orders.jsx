import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { toast } from 'react-toastify';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/all`);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, confirm) => {
    try {
      const res = await axios.post(`${url}/api/order/verify`, {
        orderId,
        confirm,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Orders...</h2>;
  }

  return (
    <div className="admin-orders">
      <h2>Admin Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h3>Order ID: {order._id}</h3>

            <p>
              <b>Status:</b>{" "}
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </p>

            {/* ADDRESS */}
            <h4>Delivery Address</h4>
            <p>
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>
              {order.address.street}, {order.address.city}
            </p>
            <p>{order.address.state}</p>
            <p>📞 {order.address.phone}</p>

            {/* ITEMS */}
            <h4>Items</h4>
            {order.items.map((item, index) => (
              <p key={index}>
                {item.name} × {item.quantity}
              </p>
            ))}

            {/* ACTION BUTTONS */}
            {order.status === "Placed" && (
              <div className="order-actions">
                <button
                  className="verify-btn"
                  onClick={() => handleOrderAction(order._id, true)}
                >
                  Send / Mark as Received
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => handleOrderAction(order._id, false)}
                >
                  Cancel Order
                </button>
              </div>
            )}

            {order.status !== "Placed" && (
              <p className="info-text">
                Order already {order.status}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
