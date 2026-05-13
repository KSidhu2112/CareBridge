import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderDetails.css";
import { StoreContext } from "../../context/StoreContext";

const OrderDetails = () => {
  const {orderId} = useParams(); // ✅ from URL
  const { token, url } = useContext(StoreContext);
  // setOrderId(or);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${url}/api/order/orderdetails/${orderId}`,
          { headers: { token } }
        );
        // console.log(res)

        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, url]);

  const cancelOrder = async () => {
    try {
      const res = await axios.post(
        `${url}/api/order/cancel`,
        { orderId },
        { headers: { token } }
      );

      if (res.data.success) {
        alert("Order cancelled");
        navigate("/my-orders");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="order-details">
      <h2>Order Details</h2>

      <p><b>Order ID:</b> {order._id}</p>
      <p><b>Status:</b> {order.status}</p>

      <h3>Delivery Address</h3>
      <p>
        {order.address.street}, {order.address.city}, {order.address.state}
      </p>
      <p>{order.address.country} - {order.address.phone}</p>

      <h3>Items</h3>
      <div className="items">
        {order.items.map((item, index) => (
          <div key={index} className="item">
            <p>{item.name}</p>
            <p>Qty: {item.quantity}</p>
            <p>₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="actions">
        <button
          className="track"
          onClick={() => navigate(`/track/${order._id}`)}
        >
          Track Order
        </button>

        {order.status === "Placed" && (
          <button className="cancel" onClick={cancelOrder}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
