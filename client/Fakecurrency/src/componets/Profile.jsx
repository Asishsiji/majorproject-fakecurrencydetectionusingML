import React, { useState, useEffect } from "react";
import "./Profile.css";
import Chat from "./Chat";
import AddFeedback from "./AddFeedback";
import UserHistory from "./UserHistory";
import { addfakeCurrency, GetUser } from "../api/allApi";
import Logout from "./Logout";
import { ref as createStorageRef, uploadBytes } from "firebase/storage";
import { get, ref, update } from "firebase/database";
import { database, storage } from "../api/firebase";
import { toast, ToastContainer } from "react-toastify";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [activesection, setactivesection] = useState("profile");
  const [user, setuser] = useState(null);

  const uname = sessionStorage.getItem("username");

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCheckCurrency = async () => {
    setLoading(true);

    try {
      if (!image) {
        toast.error("No image added");
        setLoading(false);
        return;
      }

      // Step 1: Upload Image
      const imgRef = createStorageRef(storage, "LiveImage2/img.jpg");
      await uploadBytes(imgRef, image);

      // Step 2: Update uploadFlag
      const dbRef = ref(database, "LiveImage2");
      await update(dbRef, { uploadFlag: "1" });

      let conditionMet = false;
      const timeout = 30000;
      const startTime = Date.now();

      // Step 3: Check resultFlag
      while (!conditionMet) {
        if (Date.now() - startTime > timeout) {
          toast.error("Time Exceeded Try Again");
          break;
        }

        const flagRef = ref(database, "LiveImage2/resultFlag");
        const flagSnapshot = await get(flagRef);
        const flagData = flagSnapshot.val();

        if (flagData === "1") {
          conditionMet = true;

          const resultRef = ref(database, "LiveImage2/result");
          const resultSnapshot = await get(resultRef);
          const resultData = resultSnapshot.val().result;
          generateSpeech(resultData);
          setResult(resultData);
          let booleanValue = resultData.toLowerCase().includes("fake");
          if (booleanValue) {
            addfakeCurrency({ image: image }).then((res) => {});
          }

          const resflag = ref(database, "LiveImage2");
          await update(resflag, { resultFlag: "0" });
          setLoading(false);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if (!conditionMet) {
        await update(dbRef, { uploadFlag: "0" });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const generateSpeech = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const fetchUserDetails = () => {
    GetUser().then((res) => {
      const filterUser = res.data.find((user) => user.username === uname);
      if (filterUser) {
        setuser(filterUser);
      }
    });
  };

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("open");
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 990) {
      document.querySelector(".sidebar").classList.remove("open");
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer />

      <div className="sidebar pe-4 pb-3">
        <nav className="navbar bg-secondary navbar-dark">
          <a href="#" className="navbar-brand mx-4 mb-3">
            <h3 className="text-primary">Fake Currency</h3>
          </a>
          <div className="d-flex align-items-center ms-4 mb-4">
            <div className="ms-3">
              <h6 className="text-uppercase font-monospace">
                {user ? user.username : ""}
              </h6>
              <p style={{ fontSize: "13px" }}>
                {user ? user.email : "Loading..."}
              </p>
            </div>
          </div>
          <div className="navbar-nav w-100">
            <a
              href="#"
              className={`nav-item nav-link ${
                activesection === "profile" ? "active" : ""
              }`}
              onClick={() => {
                setactivesection("profile");
                closeSidebarOnMobile();
              }}
            >
              <i className="fa fa-tachometer-alt me-2"></i>Profile
            </a>

            <a
              href="#"
              className={`nav-item nav-link ${
                activesection === "detect" ? "active" : ""
              }`}
              onClick={() => {
                setactivesection("detect");
                closeSidebarOnMobile();
              }}
            >
              <i className="fa fa-keyboard me-2"></i>Verify Currency
            </a>

            <a
              href="#"
              className={`nav-item nav-link ${
                activesection === "chat" ? "active" : ""
              }`}
              onClick={() => {
                setactivesection("chat");
                closeSidebarOnMobile();
              }}
            >
              <i className="fa fa-keyboard me-2"></i>Chat
            </a>

            <a
              href="#"
              className={`nav-item nav-link ${
                activesection === "addfeedback" ? "active" : ""
              }`}
              onClick={() => {
                setactivesection("addfeedback");
                closeSidebarOnMobile();
              }}
            >
              <i className="fa fa-chart-bar me-2"></i>Add Feedbacks
            </a>

            <a
              href="#"
              className={`nav-item nav-link ${
                activesection === "history" ? "active" : ""
              }`}
              onClick={() => {
                setactivesection("history");
                closeSidebarOnMobile();
              }}
            >
              <i className="fa fa-chart-bar me-2"></i>History
            </a>
          </div>
        </nav>
      </div>

      <main className="content">
        <nav className="navbar navbar-expand w-100 d-flex justify-content-between bg-secondary navbar-dark sticky-top px-4 py-0 ">
          <a
            href="#"
            className="sidebar-toggler flex-shrink-0"
            onClick={toggleSidebar}
          >
            <i className="fa fa-bars "></i>
          </a>
          <Logout />
        </nav>

        {activesection === "profile" && (
          <div
            className="d-flex flex-column align-items-center text-center bg-dark text-white p-5"
            style={{ minHeight: "100vh" }}
          >
            <div className="bio-graph-heading bg-warning text-dark p-4 rounded shadow-lg w-75">
              <h5 className="fw-bold">
                Reliable Fake Currency Detection for Secure Transactions
              </h5>
              <p>
                <i>
                  Advanced fake currency detection ensures secure transactions
                  with real-time accuracy.
                </i>
              </p>
            </div>
            <div className="panel-body w-75 mt-5 p-4 border rounded shadow-lg bg-secondary text-white">
              <h2 className="text-center">
                <i>Profile Information</i>
              </h2>
              <div className="profile-details  border rounded shadow-sm bg-dark">
                <div className="row text-start">
                  <div className="col-md-6 user-info">
                    <p>
                      <strong>Name:</strong> {user ? user.username : ""}
                    </p>
                  </div>
                  <div className="col-md-6 user-info">
                    <p >
                      <strong >Email:</strong> {user ? user.email : "Loading..."}
                    </p>
                  </div>
                </div>
                <div className="row text-start">
                  <div className="col-md-6 user-info">
                    <p>
                      <strong>Mobile:</strong> {user ? user.phone : "Loading..."}
                    </p>
                  </div>
                  <div className="col-md-6 user-info">
                    <p>
                      <strong>Location:</strong>{" "}
                      {user ? user.location.name : "Loading..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fake-currency-info w-75 mt-4 p-4 border rounded shadow-lg bg-light text-white">
              <h3 className="text-center">
                <i>What to Do If You Receive Fake Currency?</i>
              </h3>
              <ul className="text-left">
                <li>Do not attempt to use the fake currency.</li>
                <li>
                  Immediately report it to the nearest bank or law enforcement
                  agency.
                </li>
                <li>
                  Take note of the person who gave you the fake note if
                  possible.
                </li>
                <li>Handle the note carefully to preserve any evidence.</li>
                <li>
                  Use our AI-powered verification tool to check the authenticity
                  of your notes.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activesection === "detect" && (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="currency-verification w-75   mt-4 p-4  text-white text-center">
              <h3>
                <i>Currency Verification</i>
              </h3>
              <input
                type="file"
                className="form-control my-3"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                className="btn btn-primary px-4 py-2 w-100"
                onClick={handleCheckCurrency}
                disabled={!image || loading}
              >
                {loading ? "Checking..." : "Upload & Verify"}
              </button>
              {result && (
                <p
                  className={`mt-3 fw-bold ${
                    result.includes("Fake") ? "text-danger" : "text-success"
                  }`}
                >
                  {result}
                </p>
              )}
            </div>
          </div>
        )}

        {activesection === "chat" && (
          <div className="p-2">
            <Chat />
          </div>
        )}

        {activesection === "addfeedback" && (
          <div>
            <AddFeedback />
          </div>
        )}

        {activesection === "history" && (
          <div>
            <UserHistory />
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
