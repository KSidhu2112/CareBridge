import React, { useContext } from "react";
import { assets } from "../../assets/frontend";
import "./DisplayAll.css";
import { StoreContext } from "../../context/StoreContext";

const DisplayAll = ({ id, name, description, price, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  return (
    <div className="item-card" key={id}>
      <img src={url + "/images/" + image} alt={name} />

      <div className="addtocart">
        {!cartItems?.[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="add"
          />
        ) : (
          <div className="count-handler">
            <img
              className="increment"
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="remove"
            />
            <p>{cartItems?.[id] || 0}</p>
            <img
              className="decrement"
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="add"
            />
          </div>
        )}
      </div>

      <div className="det">
        <h3>{name}</h3>
        <p>{description}</p>
        {price > 0 && <p>Price: ${price}</p>}
      </div>
    </div>
  );
};

export default DisplayAll;
