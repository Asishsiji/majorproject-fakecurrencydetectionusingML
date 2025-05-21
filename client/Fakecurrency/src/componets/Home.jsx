import React, { useState } from 'react';
import './Home.css';

function Home() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(true);

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-secondary nav-dark sticky-top px-4 py-3">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#home">
                        Fake Currency Detection
                    </a>

                    <button className="navbar-toggler" type="button" onClick={() => setIsNavCollapsed(!isNavCollapsed)} aria-expanded={!isNavCollapsed} aria-label="Toggle navigation" style={{ borderColor: "white" }}>
                        <i className="fa fa-bars text-white"></i>
                    </button>


                    <div className={`collapse navbar-collapse justify-content-end ${isNavCollapsed ? 'collapse' : 'show'}`} id="navbarTogglerDemo02">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li>
                                <a href="#home" className="nav-link me-3 fw-bold" onClick={handleNavCollapse}>
                                    Home
                                </a>
                            </li>
                            <li>
                                <a className="nav-link me-3 fw-bold" href="#about" onClick={handleNavCollapse}>
                                    About
                                </a>
                            </li>
                            <li>
                                <a className="nav-link me-3 fw-bold" href="#guid" onClick={handleNavCollapse}>
                                    Guide
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link me-3 fw-bold" href="/login" onClick={handleNavCollapse}>
                                    Login
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container bg mt-5" id="home">
                <h1 className="main_heading">
                    <span>Fake Currency</span> Detection System
                </h1>
                <p className="description">
                    <i>Ensure authenticity with advanced AI-powered detection. Scan and verify banknotes instantly.</i>
                </p>
            </div>

            <div className="about-section mt-5" id="about">
                <div className="about-content">
                    <h2 className="about-heading mt-5">About Our <span>Fake Currency Detection System</span></h2>
                    <p className="about-text">
                        Our advanced AI-powered system helps detect counterfeit currency with precision.
                        Using cutting-edge machine learning and image recognition technology, we ensure quick
                        and reliable verification of banknotes. Whether for businesses, banks, or individuals,
                        our tool provides security and trust in every transaction.
                    </p>
                </div>
                <div className="about-image">
                    <img src="./images/fakeimage2.jpeg" alt="Fake Currency Detection" />
                </div>
            </div>

            <div className="guide-section" id="guid">
                <h2 className="guide-heading mt-5">
                    What to Do If You Receive <span>Fake Currency?</span>
                </h2>
                <p className="guide-description">
                    If you suspect a banknote is counterfeit, follow these important steps to stay safe and report it properly.
                </p>
                <div className="steps-container">
                    <div className="step">
                        <i className="fa fa-exclamation-triangle step-icon"></i>
                        <h3>Do Not Use or Return</h3>
                        <p>Do not try to spend or return the fake currency, as it is illegal.</p>
                    </div>
                    <div className="step">
                        <i className="fa fa-phone-alt step-icon"></i>
                        <h3>Contact Authorities</h3>
                        <p>Report the counterfeit note to the police or your local financial authority.</p>
                    </div>
                    <div className="step">
                        <i className="fa fa-university step-icon"></i>
                        <h3>Visit the Bank</h3>
                        <p>Take the fake note to the nearest bank to verify and report it officially.</p>
                    </div>
                    <div className="step">
                        <i className="fa fa-file-alt step-icon"></i>
                        <h3>Provide Details</h3>
                        <p>Give information about where you received the note to help authorities track it.</p>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <p>© {new Date().getFullYear()} Fake Currency Detection System. All Rights Reserved.</p>
            </footer>
        </>
    );
}

export default Home;
