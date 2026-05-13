import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import OtpInput from './OtpInput'

const Login = ({ url, setToken }) => {
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        otp: ""
    })
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onAuth = async (event) => {
        event.preventDefault();
        setLoading(true);
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const requestData = currState === "Login" ? { email: data.email, password: data.password } : { ...data, role: 'admin' };
            const response = await axios.post(newUrl, requestData);

            if (response.data.success) {
                if (response.data.role === 'admin') {
                    setToken(response.data.token);
                    localStorage.setItem("adminToken", response.data.token);
                    toast.success(currState === "Login" ? "Welcome Admin" : "Admin Account Created");
                    navigate('/orders');
                } else {
                    toast.error("Access Denied: Not an Admin");
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || (currState === "Login" ? "Login Failed" : "Registration Failed"));
        } finally {
            setLoading(false);
        }
    }

    const sendOtp = async () => {
        if (!data.email) return toast.error("Please enter email first");
        if (data.password.length < 6) return toast.error("Password must be at least 6 characters");

        try {
            setLoading(true);
            const res = await axios.post(`${url}/api/user/send-otp`, { email: data.email });
            if (res.data.success) {
                setOtpSent(true);
                if (res.data.devOtp) {
                    toast.info("Email failed. YOUR CODE IS: " + res.data.devOtp, { autoClose: false });
                } else {
                    toast.success("OTP sent to your email");
                }
            } else {
                toast.error(res.data.message + (res.data.error ? ": " + res.data.error : ""));
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onAuth} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState === "Login" ? "Admin Login" : "Admin Sign Up"}</h2>
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                    )}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                    {currState === "Sign Up" && otpSent && (
                        <div style={{marginTop: '10px'}}>
                             <p style={{fontSize:'13px', color:'#666', textAlign:'center', marginBottom:'5px'}}>Enter OTP</p>
                             <OtpInput onComplete={(code) => setData({...data, otp: code})} />
                        </div>
                    )}
                </div>

                <button 
                    type={currState === "Sign Up" && !otpSent ? "button" : "submit"}
                    onClick={currState === "Sign Up" && !otpSent ? sendOtp : undefined}
                    disabled={loading}
                >
                    {loading ? "Processing..." : (currState === "Login" ? "Login" : (otpSent ? "Verify & Sign Up" : "Send OTP"))}
                </button>

                {currState === "Sign Up" && otpSent && (
                    <p className="resend-otp" onClick={sendOtp} style={{cursor:'pointer', color:'#007bff', textAlign:'center', marginTop:'10px', fontSize:'14px'}}>
                        Resend OTP
                    </p>
                )}

                <div className="login-popup-condition">
                    <p>
                        {currState === "Login" 
                            ? <>Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></>
                            : <>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></>
                        }
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Login
