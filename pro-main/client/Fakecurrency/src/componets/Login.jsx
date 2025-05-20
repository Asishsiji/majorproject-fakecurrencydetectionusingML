import React, { useEffect, useState } from 'react';
import { GetUser, GetUserList, TokenLogin } from '../api/allApi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function Login() {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [admin, setAdmin] = useState([]);
    const [user, setUser] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAdmin();
    }, []);

    const fetchAdmin = () => {
        GetUserList().then((res) => {
            setUser(res.data);
            const filter = res.data.filter((user) => user.is_superuser);
            setAdmin(filter);
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        TokenLogin(loginData)
            .then((res) => {
                const token = res.data.token;
                const uname = loginData.username;
                const id = res.data.user.id;
                sessionStorage.setItem("id", id)

                sessionStorage.setItem("username", uname);
                sessionStorage.setItem("token", token);


                const foundPerson = admin.find((user) => user.username === uname);
                const foundControlRoom = user.find((user) => user.username === uname);


                if (foundPerson) {
                    navigate("/admin");
                } else if (foundControlRoom.control_room) {
                    navigate("/controlroom");
                } else {
                    navigate("/profile");
                }
            })
            .catch((err) => {
                toast.error("Invalid Username or Password");
            });
    };

    return (
        <div>
            <ToastContainer />
            <div className="container-fluid position-relative d-flex p-0">
                <div className="container-fluid">
                    <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                        <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                            <div className="bg-secondary rounded p-4 p-sm-5 my-4 mx-3">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <a href="index.html" className="">
                                        <h5 className="text-primary">Fakecurrency Detection</h5>
                                    </a>
                                    <h5>Login</h5>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            placeholder="Enter your name"
                                            name="username"
                                            value={loginData.username}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="username">User Name</label>
                                    </div>
                                    <div className="form-floating mb-4">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="floatingPassword"
                                            placeholder="Password"
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <p>Forgot Password? <a href="/forgot">Reset Now</a></p>
                                    </div>
                                    <button type="submit" className="btn btn-primary py-3 w-100 mb-4">Login</button>
                                </form>
                                <div>
                                    <p className="text-center mb-0">Don't have an Account? <a href="/register">Register</a></p>
                                    <p className="text-center mb-0 "><i className="fa fa-arrow-left"></i> <a href="/">
                                        Back to home</a></p>
                                </div>
                                {/* <div className='mt-2'>
                                    <p>*If the control room is trying to log in, use the phone number as the username.</p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;


