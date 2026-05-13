import React, { useRef, useState } from 'react';
import './OtpInput.css';

const OtpInput = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Allow only the last character entered
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Notify parent if complete
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length) onComplete(combinedOtp);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);

        // Optional: Move focus to the first empty box
        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // Move focus to previous input on backspace
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="otp-input-container">
            {otp.map((value, index) => {
                return (
                    <input
                        key={index}
                        type="text"
                        ref={(input) => (inputRefs.current[index] = input)}
                        value={value}
                        onChange={(e) => handleChange(index, e)}
                        onClick={() => handleClick(index)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="otp-field"
                    />
                );
            })}
        </div>
    );
};

export default OtpInput;
