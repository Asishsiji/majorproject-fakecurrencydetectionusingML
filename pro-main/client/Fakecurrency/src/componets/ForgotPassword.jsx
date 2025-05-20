import React, { useState } from "react";
import { sendOtp, resetPassword } from "../api/allApi";
import { toast, ToastContainer } from "react-toastify";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(Array(4).fill(""));
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleGetOtp = (e) => {
        e.preventDefault();
        setLoading(true);

        sendOtp({ email })
            .then((res) => {
                toast.success("OTP sent to your email!");
                setOtpSent(true);
            })
            .catch((err) => {
                toast.error(err.response?.data?.error || "Failed to send OTP");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleResetPassword = () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const otpString = otp.join("");

        resetPassword({ email, otp: otpString, new_password: newPassword })
            .then((res) => {
                toast.success("Password reset successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            })
            .catch((err) => {
                toast.error(err.response?.data?.error || "Failed to reset password");
            });
    };


    const handleOtpChange = (index, value, event) => {
        if (!/^\d?$/.test(value)) return; // Allow only single digit numbers
        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus(); // Move to next field
        }

        if (event.key === "Backspace" && index > 0 && !value) {
            document.getElementById(`otp-${index - 1}`).focus(); // Move to previous field
        }
    };


    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <ToastContainer />
            <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                <div className="bg-secondary rounded p-4 p-sm-5 my-4 mx-3">
                    <h5 className="text-primary text-center mb-3">Forgot Password</h5>

                    {!otpSent ? (
                        <>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingEmail"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="floatingEmail">Email address</label>
                            </div>
                            <button className="btn btn-primary w-100 py-2" onClick={handleGetOtp} disabled={loading}>
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </>
                    ) : (
                        <>
                            <label htmlFor="otp" className="form-label">Enter OTP</label>
                            <div className="d-flex justify-content-center mb-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`} // Unique ID for each input
                                        type="text"
                                        className="form-control text-center ms-1"
                                        style={{ width: "50px" }}
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value, e)}
                                        onKeyDown={(e) => handleOtpChange(index, "", e)} // Handle backspace navigation
                                    />
                                ))}
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingNewPassword"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <label htmlFor="floatingNewPassword">New Password</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingConfirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <label htmlFor="floatingConfirmPassword">Confirm Password</label>
                            </div>

                            <button className="btn btn-primary w-100 py-2" onClick={handleResetPassword}>
                                Reset Password
                            </button>
                        </>
                    )}
                    <p className="text-center mt-3"><a href="/login">Back to Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
