import React from "react";
import "./DonationSection.css"; // CSS for styling
import { useNavigate } from "react-router-dom";

function DonationSection() {
  const navigate = useNavigate();
  return (
    <section id="donation-section" className="donation-grid">

      <div className="donation-card">
        <i className="fas fa-book icon"></i>
        <h3>Education</h3>
        <p>
          Donate books, school supplies, and learning materials to help
          students in need.
        </p>
        <button onClick={()=>navigate('/education')}>Donate Education Materials</button>
      </div>

      <div className="donation-card">
        <i className="fas fa-utensils icon"></i>
        <h3>Food</h3>
        <p>
          Contribute non-perishable food items to support families facing
          food insecurity.
        </p>
        <button onClick={()=>navigate('/food')}>Donate Food</button>
      </div>

      <div className="donation-card">
        <i className="fas fa-tshirt icon"></i>
        <h3>Clothing</h3>
        <p>
          Share gently used clothing to help those in need stay warm and
          dignified.
        </p>
        <button onClick={()=>navigate('/cloths')}>Donate Cloths</button>
      </div>

    </section>
  );
}

export default DonationSection;
