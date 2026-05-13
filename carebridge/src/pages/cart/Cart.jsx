import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/frontend";

const Cart = ({ setShop }) => {
  useEffect(() => {
    setShop(true);
  }, [setShop]);

  const navigate = useNavigate();
  const {
    menu,
    cartItems,
    addToCart,
    removeFromCart,
    totalQuantity,
    url,
  } = useContext(StoreContext);

  return (
    <div className="cart-container">
      <div className="cart">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Remove</p>
          </div>
        </div>
      </div>

      <br />
      <hr />

      {Array.isArray(menu) &&
        menu.map((item, index) => {
          if (cartItems?.[item._id]) {
            return (
              <div className="cart-items-item" key={index}>
                <div className="cart-lists">
                  <img
                    src={url + "/images/" + item.image}
                    alt={item.name}
                  />

                  <div className="cart-item-details">
                    <p>{item.name}</p>
                    <p>${item.price}</p>

                    <div className="ordersadd">
                      <div className="count-handler">
                        <img
                          className="increment"
                          onClick={() => removeFromCart(item._id)}
                          src={assets.remove_icon_red}
                          alt="remove"
                        />
                        <h4>{cartItems?.[item._id] || 0}</h4>
                        <img
                          className="decrement"
                          onClick={() => addToCart(item._id)}
                          src={assets.add_icon_green}
                          alt="add"
                        />
                      </div>
                    </div>

                    <p
                      className="remove"
                      onClick={() => removeFromCart(item._id)}
                    >
                      X
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}

      <div className="cart-bottom">
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
              <p>$2</p>
            </div>
            <hr />
            <div className="cart-toatal-details">
              <b>Total</b>
              <b>$0</b>
            </div>
          </div>

          <button onClick={() => navigate("/order")}>
            ADD ADDRESS TO PROCEED
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
