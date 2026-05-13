import React from 'react'
import "./ReceivingExploreMenu.css"
import { menu_list } from "../../assets/frontend"

const ReceivingExploreMenu = ({  category, setCategory }) => {
  
  return (
    <div>
      <h1>Receiving Page</h1>

      <div className='explore-menu' id='explore-menu'>
        <h1>Explore Our Menu</h1>

        <p className='explore-menu-text'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, dolor. Tempore omnis dolorum molestiae earum harum esse aliquid impedit iure accusamus repudiandae officia eum, cum inventore possimus quidem. Quaerat repellat eaque accusamus. Qui, quae magnam error voluptates, accusantium eos eligendi reprehenderit iste itaque saepe rerum quasi quidem nisi non numquam.
        </p>

        <div className="explore-menu-list">
          {menu_list.map((item, index) => (
            <div
              key={index}
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
        <hr />
      </div>
    </div>
  );
};

export default ReceivingExploreMenu;
