import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import History from './pages/History/History';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = "http://localhost:5000";

  return (
    <div className='app'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home url={url} />} />
        <Route path="/login" element={<Login url={url} />} />
        <Route path="/register" element={<Register url={url} />} />
        <Route path="/profile" element={<Profile url={url} />} />
        <Route path="/history" element={<History url={url} />} />
      </Routes>
    </div>
  );
};

export default App;
