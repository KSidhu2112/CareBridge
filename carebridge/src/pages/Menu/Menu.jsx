import React from 'react'
import "./Menu.css"
import ReceivingExploreMenu from '../../components/ReceivingExploreMenu/ReceivingExploreMenu'
import AllMenu from '../../components/AllMenu/AllMenu'
import DisplayItems from '../../components/DisplayItems/DisplayItems'

const Menu = ({subCategory,setSubCategory,category,setCategory}) => {
  return (
    <div>
      {/* <ReceivingExploreMenu category={category} setCategory={setCategory} /> */}
      <AllMenu subCategory={subCategory} setSubCategory={setSubCategory}  />
      <DisplayItems subCategory={subCategory} setSubCategory={setSubCategory}  />
    </div>
  )
}

export default Menu
