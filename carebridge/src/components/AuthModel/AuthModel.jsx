import React, { useContext, useState } from "react";
import "./AuthModal.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import OtpInput from "./OtpInput";

function AuthModal({ setIsLogin }) {
  const [curState, setCurState] = useState("signup");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "donor"
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { url, setToken, setRole, setUserName, setUserEmail } = useContext(StoreContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (curState === "signup" && data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }

    const newUrl =
      curState === "signup"
        ? `${url}/api/user/register`
        : `${url}/api/user/login`;

    try {
      setLoading(true);
      const res = await axios.post(newUrl, data);

      if (res.data.success) {
        setToken(res.data.token);
        setRole(res.data.role);
        if (res.data.name) {
          setUserName(res.data.name);
          localStorage.setItem("userName", res.data.name);
        }
        if (res.data.email) {
          setUserEmail(res.data.email);
          localStorage.setItem("userEmail", res.data.email);
        }
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userRole", res.data.role);
        setIsLogin(false);
        alert("Authentication Successful");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!data.email) return alert("Please enter email first");
    if (data.password !== data.confirmPassword) return alert("Passwords do not match");
    if (data.password.length < 6) return alert("Password must be at least 6 characters");

    try {
      setLoading(true);
      const res = await axios.post(`${url}/api/user/send-otp`, { email: data.email });
      if (res.data.success) {
        setOtpSent(true);
        if (res.data.devOtp) {
          alert("Email service unavailable. Your verification code is: " + res.data.devOtp);
        } else {
          alert("OTP sent to your email");
        }
      } else {
        alert(res.data.message + (res.data.error ? ": " + res.data.error : ""));
      }
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={onLogin} className={curState}>
        <span className="close" onClick={() => setIsLogin(false)}>
          &times;
        </span>

        <h2>{curState === "signup" ? "Sign Up" : "Login"}</h2>

        {curState === "signup" && (
          <input
            name="name"
            value={data.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter Name"
            required
          />
        )}

        <input
  name="email"
  value={data.email}
  onChange={handleChange}
  type="email"
  placeholder="Enter Email"
  required
  autoComplete="username"
/>


        <input
  name="password"
  value={data.password}
  onChange={handleChange}
  type="password"
  placeholder="Enter Password"
  required
  autoComplete="new-password"
/>

{curState === "signup" && (
  <input
    name="confirmPassword"
    value={data.confirmPassword}
    onChange={handleChange}
    type="password"
    placeholder="Confirm Password"
    required
    autoComplete="new-password"
  />
)}

{curState === "signup" && (
  <div className="role-selector" style={{display: 'flex', gap: '15px', margin: '10px 0'}}>
    <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
      <input type="radio" name="role" value="donor" checked={data.role === 'donor'} onChange={handleChange} /> 
      Donor
    </label>
    <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
      <input type="radio" name="role" value="receiver" checked={data.role === 'receiver'} onChange={handleChange} /> 
      Receiving
    </label>
  </div>
)}

{curState === "signup" && otpSent && (
  <div style={{textAlign:'center'}}>
    <p style={{fontSize:'14px', color:'#666', marginBottom:'5px'}}>Enter Verification Code</p>
    <OtpInput onComplete={(code) => setData({...data, otp: code})} />
  </div>
)}

        <button 
          type={curState === "signup" && !otpSent ? "button" : "submit"} 
          onClick={curState === "signup" && !otpSent ? sendOtp : undefined}
          disabled={loading}
        >
          {loading ? "Processing..." : (curState === "signup" ? (otpSent ? "Verify & Sign Up" : "Send OTP") : "Login")}
        </button>

        {curState === "signup" && otpSent && (
          <p className="resend-otp" onClick={sendOtp} style={{cursor:'pointer', color:'#007bff', fontSize:'14px', marginTop:'5px'}}>
            Resend OTP
          </p>
        )}

        <p className="sign">
          {curState === "signup" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setCurState("login")}>Login</span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setCurState("signup")}>Sign Up</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

export default AuthModal;
