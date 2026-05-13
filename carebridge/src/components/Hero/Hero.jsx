import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero({setShop}) {
  const navigate = useNavigate();

  return (
    <section className="hero" id="Home">
      <div className="hero-content">
        <h2>Make a Difference Today</h2>
        <p>
          Join our mission to redistribute resources and create a more equitable society.
          Your donations can help bridge the gap and improve lives.
        </p>

        <div className="hero-btns">
          <button onClick={()=>navigate("/donation")} className="donate">Start Donating</button>
          <button
            className="receive"
            onClick={() => {
              setShop(true);
              navigate("/menu");
            }}
          >
            Begin Receiving
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;
