import React, { useState } from "react";
import "./AllMenu.css";
import { All_menu, menu } from "../../assets/frontend";
import { assets } from "../../assets/frontend";

const AllMenu = ({ subCategory, setSubCategory }) => {

  const [count, setCount] =useState(0);

  // Filter items only by subcategory
  
  return (
    <div>
      
      <div className="banner">
  <div className="banner-text">
    <h1>CareBridge Donation</h1>
    <h2>Feed in Need</h2>
    <p>
      At CareBridge, we believe in sharing food, care, and hope. 
      Choose the menu you like the most and be a part of our mission 
      to nourish lives and spread kindness. Your contribution ensures 
      that no one goes to bed hungry, and every plate served is a 
      step towards a brighter future. Together, we can create a 
      ripple effect of generosity, where small acts of kindness 
      bring big changes in the lives of those in need. 
      CareBridge connects hearts and hands to deliver not only meals, 
      but also hope, dignity, and love across communities.
    </p>
  </div>
</div>





      <div className="explore-menu" id="explore-menu">
        <h1>Explore Our Menu</h1>

        <p className="explore-menu-text">
          Select a donation category → then see available items.
        </p>

        {/* Subcategories */}
        <div className="subcategory-section">
          <h2>{subCategory === "" ? "All Items" : "Choose Subcategory"}</h2>
          <div className="subcategory-list">
            {All_menu.map((sub, idx) => (
              <div
                key={idx}
                className={`subcategory-item ${
                  subCategory === sub.menu_name ? "active" : ""
                }`}
                onClick={() =>
                  setSubCategory((prev) =>
                    prev === sub.menu_name ? "" : sub.menu_name
                  )
                }
              >
                
                <img src={sub.menu_image} alt={sub.menu_name}  />
                <p>{sub.menu_name}</p>
              </div>
            ))}
          </div>
        </div>

        
        <hr />
      </div>
    </div>
  );
};

export default AllMenu;


