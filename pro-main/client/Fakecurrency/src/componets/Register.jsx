import React, { useEffect, useState } from "react";
import { GetLocation, registerUser, sendOtp } from "../api/allApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [location, setlocation] = useState([]);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [phoneError, setPhoneError] = useState(""); 

  const [userData, setUserData] = useState({
    first_name: "",
    username: "",
    email: "",
    location: "",
    password: "",
    otp: "",
    phone: "",
  });

  
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

 
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    if (!/^\d*$/.test(phone)) {
      return; 
    }
    setUserData({ ...userData, phone });

    if (phone.length === 10 && validatePhone(phone)) {
      setPhoneError(""); 
    } else {
      setPhoneError("Phone number must be 10 digits.");
    }
  };

  
  const handleGetOtp = (e) => {
    e.preventDefault();

    if (!validatePhone(userData.phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return;
    }

    setloading(true);
    sendOtp({ email: userData.email })
      .then(() => {
        toast.success("OTP sent to your email");
        setShowOtpSection(true);
      })
      .catch(() => {
        toast.error("Failed to send OTP. Try again.");
      })
      .finally(() => {
        setloading(false);
      });
  };


  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await GetLocation();
        setlocation(res.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocation();
  }, []);

  
  const handleOtpChange = (index, value, event) => {
    if (!/^\d?$/.test(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    if (event.key === "Backspace" && index > 0 && !value) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const otpString = otp.join("");

    if (!validatePhone(userData.phone)) {
      setPhoneError("Invalid phone number.");
      return;
    }

    const data = {
      ...userData,
      otp: otpString,
    };

    registerUser(data)
      .then(() => {
        setUserData({
          first_name: "",
          username: "",
          email: "",
          phone: "",
          location: "",
          password: "",
          otp: "",
        });
        navigate("/login");
      })
      .catch((err) => {
        const errors = err.response?.data || {};
        const errorMessages = Object.values(errors).flat();
        toast.error(errorMessages[0] || "An unexpected error occurred!");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <div className="container-fluid pt-4 px-4">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-6">
            <div className="bg-secondary rounded p-4">
              <h4 className="mb-4 text-center">User Registration Form</h4>
              <form>
                {!showOtpSection && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={userData.first_name}
                        onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        maxLength="10"
                        value={userData.phone}
                        onChange={handlePhoneChange}
                      />
                      {phoneError && <small className="text-danger">{phoneError}</small>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">Location</label>
                      <select
                        className="form-select mb-3"
                        value={userData.location}
                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                      >
                        <option>Select Location</option>
                        {location.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {!showOtpSection ? (
                  <button type="submit" className="btn btn-primary w-100" onClick={handleGetOtp}>
                    {loading ? "Loading..." : "Get OTP"}
                  </button>
                ) : (
                  <>
                    <div className="mb-3 text-center">
                      <label htmlFor="otp" className="form-label">Enter OTP</label>
                      <div className="d-flex justify-content-center gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            className="form-control text-center"
                            style={{ width: "50px" }}
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value, e)}
                            onKeyDown={(e) => handleOtpChange(index, "", e)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" onClick={handleSubmit}>
                      Register
                    </button>
                  </>
                )}
              </form>
              <div className="mt-3 ">
                <a href="/login">Back to login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
