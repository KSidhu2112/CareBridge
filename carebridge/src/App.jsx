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
import MyDonations from "./pages/MyDonations/MyDonations";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [showModel,setShowModel]=useState(true);
  const [category,setCategory]=useState("All");
  const [subCategory,setSubCategory]=useState("");
  const [shop,setShop]=useState(false);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {isLogin && <AuthModel setIsLogin={setIsLogin} />}
      {showModel  && <Navbar setIsLogin={setIsLogin} shop={shop} setShop={setShop} /> }
      <div>
        <Routes>
          
          <Route path="/" element={<Home setShowModel={setShowModel} setShop={setShop} setIsLogin={setIsLogin}/>} />
          {/* <Route path="/donate" element={<FoodDonation setShowModel={setShowModel}/>} /> */}
          <Route path="/menu" element={<ProtectedRoute allowedRoles={['receiver', '']}><Menu subCategory={subCategory} setSubCategory={setSubCategory} category={category} setCategory={setCategory}/></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={['receiver', '']}><Cart  setShop={setShop} /></ProtectedRoute>}/>
          <Route path="/order" element={<ProtectedRoute allowedRoles={['receiver']}><PlaceOrder /></ProtectedRoute>}/>
          <Route path="/donation" element={<ProtectedRoute allowedRoles={['donor']}><Donation /></ProtectedRoute>}/>
          {/* <Route path="/orderdetails" element={<OrderDetails />}/> */}
          <Route path="/orderdetails/:orderId" element={<ProtectedRoute allowedRoles={['receiver']}><OrderDetails /></ProtectedRoute>} />
          <Route path="/track/:orderId" element={<ProtectedRoute allowedRoles={['receiver']}><TrackOrder /></ProtectedRoute>} />
          <Route path="/myorders" element={<ProtectedRoute allowedRoles={['receiver']}><UserOrders /></ProtectedRoute>} />
          <Route path="/mydonations" element={<ProtectedRoute allowedRoles={['donor']}><MyDonations /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* <Route path="/verify" element={<Verify />}/> */}


        </Routes>
      </div>
      {showModel  && <Footer />}
    </>
  );
}

export default App;
