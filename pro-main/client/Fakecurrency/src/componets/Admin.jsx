import React, { useEffect, useState } from "react";
import "./style.css";
import UsersList from "./UsersList";
import ControlRoomList from "./ControlRoomList";
import FeedbackView from "./FeedbackView";
import { AddControlRoom, GetLocation, PostLocation } from "../api/allApi";
import Logout from "./Logout";
import { toast, ToastContainer } from "react-toastify";


function Admin() {
  const [activesection, setactivesection] = useState("dashboard");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [Addlocation, setAddlocation] = useState({ name: '' })
  const [location, setlocation] = useState([])
  const [phoneError, setPhoneError] = useState(""); 

  const [formdata, setformdata] = useState({
    first_name: '',
    phone: '',
    username: '',
    password: '',
    email: '',
    location: ''
  })


  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

    };


    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  


  const handleLocation = (event) => {
    event.preventDefault()
    PostLocation(Addlocation).then(res => {
      setAddlocation({ name: '' })
      fetchlocation();

    })
  }

  const fetchlocation = () => {
    GetLocation().then(res => {
      setlocation(res.data)
    })

  }

  const handleRegister = (event) => {
    event.preventDefault()
    if (formdata.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }
    const data = {
      first_name: formdata.first_name,
      phone: formdata.phone,
      username: formdata.username,
      password: formdata.password,
      email: formdata.email,
      location: formdata.location

    }




    AddControlRoom(data).then(res => {
      setformdata({
        first_name: '',
        phone: '',
        username: '',
        password: '',
        email: '',
        location: ''
      })
      toast.success('control room added')
    }).catch(err => {
      const errors = err.response.data;
      const errorMessages = Object.values(errors).flat();
      const firstError = errorMessages[0];
      toast.error(firstError || 'An unexpected error occurred!');
    })
  }

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    
   
    if (!/^\d*$/.test(phone)) {
      return;
    }
  
    setformdata({ ...formdata, phone });
  
   
    if (phone.length === 10) {
      setPhoneError(""); 
    } else {
      setPhoneError("Phone number must be exactly 10 digits.");
    }
  };
  
  useEffect(() => {
    fetchlocation();
  }, [])




  return (
    <div>
      <ToastContainer />
      <div className="container-fluid position-relative d-flex p-0" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <div className="sidebar pe-4 pb-3">
          <nav className="navbar bg-secondary navbar-dark">
            <a href="#" className="navbar-brand mx-4 mb-3">
              <h3 className="text-primary">Fake Currency</h3>
            </a>
            <div className="d-flex align-items-center ms-4 mb-4">
              <div className="ms-3">
                <h6 className="mb-0">Admin</h6>
              </div>
            </div>
            <div className="navbar-nav w-100">
            <a href="#" className={`nav-item nav-link ${activesection === "dashboard" ? "active" : ""}`} 
              onClick={() => { setactivesection("dashboard"); closeSidebarOnMobile(); }}>
              <i className="fa fa-tachometer-alt me-2"></i>Add Control Room
            </a>

            <a href="#" className={`nav-item nav-link ${activesection === "users" ? "active" : ""}`} 
              onClick={() => { setactivesection("users"); closeSidebarOnMobile(); }}>
              <i className="fa fa-keyboard me-2"></i>Users
            </a>

            <a href="#" className={`nav-item nav-link ${activesection === "controlroom" ? "active" : ""}`} 
              onClick={() => { setactivesection("controlroom"); closeSidebarOnMobile(); }}>
              <i className="fa fa-keyboard me-2"></i>Control Rooms
            </a>

            <a href="#" className={`nav-item nav-link ${activesection === "feedback" ? "active" : ""}`} 
              onClick={() => { setactivesection("feedback"); closeSidebarOnMobile(); }}>
              <i className="fa fa-chart-bar me-2"></i>Feedbacks
            </a>

            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="content">
          {/* Navbar */}
          <nav className="navbar navbar-expand d-flex justify-content-between bg-secondary navbar-dark sticky-top px-4 py-0 ">

            <a href="#" className="sidebar-toggler flex-shrink-0" onClick={toggleSidebar}>
              <i className="fa fa-bars "></i>
            </a>
            <Logout />
          </nav>

          {/* Dashboard Section */}
          {activesection === "dashboard" && (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "100vh" }}
            >
              <div className="container-fluid pt-4 px-4">
                <div className="row justify-content-center">
                  <div className="col-sm-12 col-md-9">
                    <div className="bg-secondary rounded p-4">
                      <h6 className="mb-4 text-center">Control Room Registration Form</h6>
                      <form onSubmit={handleRegister}>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Name
                          </label>
                          <input type="text" className="form-control" id="name"
                            value={formdata.first_name}
                            onChange={(e) => setformdata({ ...formdata, first_name: e.target.value })}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">
                            Username
                          </label>
                          <input type="text" className="form-control" id="username"
                            value={formdata.username}
                            onChange={(e) => setformdata({ ...formdata, username: e.target.value })}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="location" className="form-label">
                            Location
                          </label>
                          <select className="form-select mb-3" aria-label="Default select example"
                            value={formdata.location}
                            onChange={(e) => setformdata({ ...formdata, location: e.target.value })}
                          >
                            <option >Select Location</option>
                            {
                              location.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>

                              ))}

                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            Email address
                          </label>
                          <input type="email" className="form-control" id="email"
                            value={formdata.email}
                            onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
  <label htmlFor="phone" className="form-label">
    Phone
  </label>
  <input
    type="tel"
    className="form-control"
    id="phone"
    value={formdata.phone}
    onChange={handlePhoneChange}
  />
  {phoneError && <small className="text-danger">{phoneError}</small>}
</div>


                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          <input type="password" className="form-control" id="password"
                            value={formdata.password}
                            onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
                          />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                          Register
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <div className="bg-secondary rounded p-4 mt-4">
                      <h6 className="mb-4 text-center">Add Location </h6>
                      <form onSubmit={handleLocation}>
                        <div className="mb-3">
                          <label htmlFor="locationName" className="form-label">
                            Location Name
                          </label>
                          <input type="text" className="form-control" id="locationName"
                            value={Addlocation.name}
                            onChange={(e) => setAddlocation({ ...Addlocation, name: e.target.value })}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          Save Location
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          }
          {activesection === 'users' && (
            <UsersList />
          )}
          {activesection === 'controlroom' && (
            <ControlRoomList />
          )}
          {activesection === 'feedback' && (
            <FeedbackView />
          )}

         

          {/* Footer */}
          <div className="container-fluid pt-4 px-4">
            <div className="bg-secondary rounded-top p-4">
              <div className="row">
                <div className="col-12 col-sm-6 text-center text-sm-start" style={{ color: 'white' }}>
                  &copy; <a href="#"> Fake currency </a>, All Rights Reserved.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top" onClick={scrollToTop}>
          <i className="fa fa-arrow-up"></i>
        </a>
      </div>
    </div>
  );
}

export default Admin;
