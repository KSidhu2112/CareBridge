import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Hero.css";

function Hero({setShop, setIsLogin}) {
  const navigate = useNavigate();
  const { role } = useContext(StoreContext);

  const handleDonateClick = () => {
    if (!role) {
      setIsLogin(true);
    } else {
      navigate("/donation");
    }
  };

  const handleReceiveClick = () => {
    if (!role) {
      setIsLogin(true);
    } else {
      setShop(true);
      navigate("/menu");
    }
  };

  return (
    <section className="hero" id="Home">
      <div className="hero-content">
        <h2>Make a Difference Today</h2>
        <p>
          Join our mission to redistribute resources and create a more equitable society.
          Your donations can help bridge the gap and improve lives.
        </p>

        <div className="hero-btns">
          {(!role || role === 'donor') && (
            <button onClick={handleDonateClick} className="donate">Start Donating</button>
          )}
          {(!role || role === 'receiver') && (
            <button onClick={handleReceiveClick} className="receive">
              Begin Receiving
            </button>
          )}
        </div>

      </div>
    </section>
  );
}

export default Hero;
