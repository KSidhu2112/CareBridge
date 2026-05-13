import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TrackOrder.css";
import { StoreContext } from "../../context/StoreContext";

const TrackOrder = () => {
  const { orderId } = useParams();
  const { token, url } = useContext(StoreContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${url}/api/order/orderdetails/${orderId}`,
          { headers: { token } }
        );
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchOrder();
      // Set up polling for live updates
      const interval = setInterval(fetchOrder, 10000); // 10 seconds
      return () => clearInterval(interval);
    }
  }, [orderId, token, url]);

  const handleVerify = async (confirm) => {
    try {
      const res = await axios.post(`${url}/api/order/verify`, { orderId, confirm });
      if (res.data.success) {
        setOrder({ ...order, status: confirm ? "Received" : "Cancelled" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const res = await axios.post(`${url}/api/order/rate`, { orderId, rating }, { headers: { token } });
      if (res.data.success) {
        setRatingSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!order) return <div className="error-msg">Order not found</div>;

  const statuses = ["Placed", "Assigned", "Out for Delivery", "Delivered", "Received"];
  // If cancelled, show cancelled, else map to standard flow
  const currentStatusIndex = order.status === "Cancelled" ? -1 : statuses.indexOf(order.status);

  return (
    <div className="track-order-container">
      <div className="track-header">
        <h2>Track Your Order</h2>
        <p className="order-id">Order ID: <span>{order._id}</span></p>
      </div>

      <div className="tracking-timeline">
        {statuses.map((status, index) => (
          <div key={index} className={`timeline-step ${index <= currentStatusIndex ? 'active' : ''}`}>
            <div className="step-icon">
              {index <= currentStatusIndex ? '✓' : index + 1}
            </div>
            <p className="step-label">{status}</p>
          </div>
        ))}
        <div className="progress-bar">
            <div 
                className="progress-fill" 
                style={{ width: `${currentStatusIndex >= 0 ? (currentStatusIndex / (statuses.length - 1)) * 100 : 0}%` }}
            ></div>
        </div>
      </div>

      <div className="live-tracking-panel">
        <div className="map-view">
            {/* Placeholder for map */}
            <div className="map-placeholder">
                <div className="map-pin user-pin">🏠</div>
                <div className="map-pin store-pin">🏪</div>
                <div className="map-route-line"></div>
                
                {order.status === "Out for Delivery" && (
                    <div className="delivery-truck">🚚</div>
                )}
            </div>
        </div>

        <div className="tracking-info">
            <h3>Estimated Delivery</h3>
            <div className="time-estimate">
                {order.status === "Delivered" ? (
                    <span className="success-text">Arrived!</span>
                ) : (
                    <span>~ 15-20 mins</span>
                )}
            </div>
            
            <div className="driver-details">
                <div className="driver-avatar">👤</div>
                <div>
                    <p className="driver-name">Valet: {order.deliveryBoyDetails?.name || "Assigning..."}</p>
                    <p className="driver-rating">⭐ {order.deliveryBoyDetails?.averageRating ? order.deliveryBoyDetails.averageRating.toFixed(1) : "N/A"}</p>
                </div>
            </div>
            
            {order.status === "Delivered" && (
                <div className="delivery-confirmation">
                    <h4>Has your order arrived?</h4>
                    <div className="confirmation-actions">
                        <button className="confirm-btn" onClick={() => handleVerify(true)}>Yes, Received</button>
                        <button className="reject-btn" onClick={() => handleVerify(false)}>No, Issue</button>
                    </div>
                </div>
            )}

            {order.status === "Received" && (
                <div className="rating-section">
                    <h4>Rate your experience</h4>
                    {!ratingSubmitted ? (
                        <>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span 
                                        key={star} 
                                        className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            {rating > 0 && (
                                <button className="submit-rating-btn" onClick={handleRatingSubmit}>
                                    Submit Rating
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="rating-success">
                            <span className="check-icon">✓</span> Thank you for your feedback!
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
