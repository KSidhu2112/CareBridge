import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar/navBar';
import Sidebar from './components/sideBar/sideBar';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import DeliveryBoys from './pages/DeliveryBoys/DeliveryBoys';
import DeliveryBoyOrders from './pages/DeliveryBoys/DeliveryBoyOrders';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import './Index.css';
import { useState, useEffect } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url="http://localhost:5000"
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    }
  }, [token]);

  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login url={url} setToken={setToken} />
      </>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Navbar setToken={setToken} />
      <div className="app-container">
        <Sidebar />

        {/* Page content area */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard url={url} />} />
            <Route path="/add" element={<Add url={url}/>} />
            <Route path="/list" element={<List url={url}/>} />
            <Route path="/orders" element={<Orders url={url}/>} />
            <Route path="/deliveryboys" element={<DeliveryBoys url={url}/>} />
            <Route path="/deliveryboys/:id/orders" element={<DeliveryBoyOrders url={url}/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
