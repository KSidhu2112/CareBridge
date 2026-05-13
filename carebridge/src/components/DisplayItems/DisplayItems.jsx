import React, { useContext } from "react";
import "./DisplayItems.css";
import DisplayAll from "../DisplayAll/DisplayAll";
import { StoreContext } from "../../context/StoreContext";

const DisplayItems = ({ subCategory, setSubCategory }) => {
  const { menu } = useContext(StoreContext);

  // ✅ Safe filtering (prevents toLowerCase error)
  const filteredItems =
    !Array.isArray(menu)
      ? []
      : subCategory === ""
      ? menu
      : menu.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase() === subCategory.toLowerCase()
        );

  return (
    <div>
      <div className="items-section">
        <h2>
          {subCategory
            ? `Available ${subCategory} Donations`
            : "All Available Donations"}
        </h2>

        <div className="items-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <DisplayAll
                key={item._id || index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            ))
          ) : (
            <div className="no-items-container">
              <div className="no-items-icon">🍽️</div>
              <h3>No Donations Available Yet</h3>
              <p>We're currently working on bringing more items to this category. Please check back soon or explore other categories!</p>
              <button onClick={() => setSubCategory("")} className="reset-btn">Explore All Items</button>
            </div>
          )}
        </div>
      </div>

      <hr />
    </div>
  );
};

export default DisplayItems;
