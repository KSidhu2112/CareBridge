import React, { useState } from 'react';
import './Register.css'; // Reusing style or creating new
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = ({ url }) => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        otp: ""
    });
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onRegister = async (event) => {
        event.preventDefault();
        if (!otpSent) {
            toast.error("Please send and verify OTP first");
            return;
        }
        try {
            setLoading(true);
            // Append role 'delivery_boy' to the request
            const requestData = { ...data, role: 'delivery_boy' };

            const response = await axios.post(`${url}/api/user/register`, requestData);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                toast.success("Registration Successful");
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error Registering");
            console.error(error);
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
                toast.success("OTP sent to your email");
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
        <div className='register-container'>
            <form onSubmit={onRegister} className="register-form">
                <h2>Binder Registration</h2>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name='name' onChange={onChangeHandler} value={data.name} required placeholder='Your Name' autoComplete="name" />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name='email' onChange={onChangeHandler} value={data.email} required placeholder='Your Email' autoComplete="email" />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name='phone' onChange={onChangeHandler} value={data.phone} required placeholder='Your Phone Number' autoComplete="tel" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name='password' onChange={onChangeHandler} value={data.password} required minLength="6" placeholder='Password (min 6 chars)' autoComplete="new-password" />
                </div>

                {otpSent && (
                    <div className="form-group">
                        <label>Verification Code (OTP)</label>
                        <input type="text" name='otp' onChange={onChangeHandler} value={data.otp} required placeholder='Enter 6-digit OTP' />
                    </div>
                )}

                <button 
                    type={!otpSent ? "button" : "submit"} 
                    onClick={!otpSent ? sendOtp : undefined}
                    disabled={loading}
                >
                    {loading ? "Processing..." : (otpSent ? "Verify & Register" : "Send OTP")}
                </button>

                {otpSent && (
                    <p className="resend-otp" onClick={sendOtp} style={{cursor:'pointer', color:'#007bff', textAlign:'center', marginTop:'10px'}}>
                        Resend OTP
                    </p>
                )}
                <p>Already have an account? <span onClick={() => navigate('/login')}>Login here</span></p>
            </form>
        </div>
    )
}

export default Register;
