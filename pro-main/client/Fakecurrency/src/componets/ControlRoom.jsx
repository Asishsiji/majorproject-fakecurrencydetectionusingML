import React, { useState } from "react";
import Chat from "./Chat";
import FakeCurrencyView from "./FakeCurrencyView";
import Logout from "./Logout";

function ControlRoom() {
  const [activesection, setactivesection] = useState("fakecurrency");
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-secondary nav-dark sticky-top px-4 py-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Fake Currency Detection
          </a>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
            style={{ borderColor: "white" }}
          >
            <i className="fa fa-bars text-white"></i>
          </button>

          <div className={`collapse navbar-collapse justify-content-end ${isNavCollapsed ? "" : "show"}`} id="navbarTogglerDemo02">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className={activesection === "fakecurrency" ? "active" : ""}>
                <a
                  className="nav-link me-3 fw-bold"
                  href="#"
                  onClick={() => {
                    setactivesection("fakecurrency");
                    setIsNavCollapsed(true); 
                  }}
                >
                  FakeCurrency
                </a>
              </li>
              <li className={activesection === "chat" ? "active" : ""}>
                <a
                  href="#"
                  className="nav-link me-3 fw-bold"
                  onClick={() => {
                    setactivesection("chat");
                    setIsNavCollapsed(true); 
                  }}
                >
                  Chat
                </a>
              </li>
              <li className="nav-item">
                <Logout />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        {activesection === "chat" && (
          <div className="container mt-2 w-100" style={{ position: "fixed" }}>
            <Chat />
          </div>
        )}

        {activesection === "fakecurrency" && (
          <div className="container mt-2 w-100" style={{ position: "fixed" }}>
            <FakeCurrencyView />
          </div>
        )}
      </div>
    </>
  );
}

export default ControlRoom;
