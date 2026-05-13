import React, { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AuthModel from "./components/AuthModel/AuthModel"; // fixed folder/file name
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Donation from "./pages/Donation/Donation";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import UserOrders from "./pages/UserOrders/UserOrders";
function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [showModel,setShowModel]=useState(true);
  const [category,setCategory]=useState("All");
  const [subCategory,setSubCategory]=useState("");
  const [shop,setShop]=useState(false);

  return (
    <>
      {isLogin && <AuthModel setIsLogin={setIsLogin} />}
      {showModel  && <Navbar setIsLogin={setIsLogin} shop={shop} setShop={setShop} /> }
      <div>
        <Routes>
          
          <Route path="/" element={<Home setShowModel={setShowModel} setShop={setShop}/>} />
          {/* <Route path="/donate" element={<FoodDonation setShowModel={setShowModel}/>} /> */}
          <Route path="/menu" element={<Menu subCategory={subCategory} setSubCategory={setSubCategory} category={category} setCategory={setCategory}/>} />
          <Route path="/cart" element={<Cart  setShop={setShop} />}/>
          <Route path="/order" element={<PlaceOrder />}/>
          <Route path="/donation" element={<Donation />}/>
          {/* <Route path="/orderdetails" element={<OrderDetails />}/> */}
          <Route path="/orderdetails/:orderId" element={<OrderDetails />} />
          <Route path="/track/:orderId" element={<TrackOrder />} />
          <Route path="/myorders" element={<UserOrders />} />
          {/* <Route path="/verify" element={<Verify />}/> */}


        </Routes>
      </div>
      {showModel  && <Footer />}
    </>
  );
}

export default App;
