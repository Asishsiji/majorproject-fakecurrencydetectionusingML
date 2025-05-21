import React, { useState, useEffect, useRef, useCallback } from "react";
import {getMessages,getUnreadMessages,GetUserList,sendMessage,} from "../api/allApi";
import "./chat.css";

function Chat({ id }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1000);
  const token = sessionStorage.getItem("token");
  const messagesEndRef = useRef(null);

  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    if (token) {
      const fetchUnreadMessages = () => {
        getUnreadMessages(token)
          .then((response) => {
            const unreadData = {};
            response.data.forEach((item) => {
              unreadData[item.sender] = item.unread_count;
            });
            setUnreadMessages(unreadData);
          })
          .catch(console.error);
      };
  
      fetchUnreadMessages(); 
      const interval = setInterval(fetchUnreadMessages, 1000); 
  
      return () => clearInterval(interval); 
    }
  }, [token]);
  

  useEffect(() => {
    const userId = id || sessionStorage.getItem("id");
    setLoading(true);
    GetUserList(token)
      .then((response) => {
        const loggedInUser = response.data.find((user) => user.id == userId);
        if (!loggedInUser) return;

        const isControlRoom =
          (loggedInUser.control_room === true ||
            loggedInUser.control_room === "true") &&
          !loggedInUser.is_superuser;

        const filteredUsers = response.data.filter(
          (user) => user.control_room !== isControlRoom && !user.is_superuser
        );

        setUsers(filteredUsers);
        if (filteredUsers.length > 0) {
          setSelectedUser(filteredUsers[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, id]);

  const fetchMessages = useCallback(() => {
    if (!selectedUser) return;
    getMessages(token, selectedUser.id)
      .then((response) => setMessages(response.data))
      .catch(console.error);
  }, [selectedUser, token]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      sendMessage(token, selectedUser.id, newMessage)
        .then((response) => {
          setMessages((prev) => [...prev, response.data]);
          setNewMessage("");
        })
        .catch(console.error);
    },
    [newMessage, selectedUser, token]
  );

  const toggleSidebar = () => {
    if (window.innerWidth < 1000) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const selectUserAndCloseSidebar = (user) => {
    setSelectedUser(user);
    if (window.innerWidth <= 1000) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="custom-chat-container d-flex flex-column flex-md-row bg-dark text-white">
      <button className="sidebar-toggle-btn d-md-none bg-info" onClick={toggleSidebar}>
        <i className="fa fa-users"></i> Users
      </button>

      <aside className={`custom-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="search-box position-relative p-2 d-flex justify-content-between">
          <h5 className="text-center">Chat </h5>
          {isSidebarOpen && window.innerWidth < 1000 && (
            <button className="close-sidebar-btn d-md-none bg-primary text-white" onClick={toggleSidebar}>
              <i className="fa fa-times"></i>
            </button>
          )}
        </div>

        <div className="user-list flex-grow-1 overflow-auto p-3">
          {loading ? (
            <p>Loading...</p>
          ) : (
            users.map((user) => (
              <div key={user.id}
                className={`list-group-item list-group-item-action d-flex align-items-center bg-secondary text-white rounded mb-2 ${
                  selectedUser?.id === user.id ? "active bg-primary" : ""}`}
                onClick={() => selectUserAndCloseSidebar(user)} style={{ cursor: "pointer" }}>
                <div className="avatar bg-light text-dark rounded-circle d-flex align-items-center justify-content-center me-3">
                  <i className="fas fa-user"></i>
                </div>

                <div className="overflow-hidden position-relative" style={{ width: "150px", height: "20px" }}>
                  <p className="fw-bold mb-0">{user.first_name}</p>
                </div>

                {unreadMessages[user.id] > 0 && (
                  <span className="unread-dot ms-auto"></span>
                )}
              </div>
            ))
          )}
        </div>
      </aside>

      <main className="custom-chat-window flex-grow-1 d-flex flex-column">
        <header className="d-flex justify-content-between align-items-center bg-secondary p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <i className="fa fa-user-circle fs-3 text-white me-2"></i>
            <p className="mb-0 fs-5 fw-bold">
              {selectedUser?.first_name || "Select a user"}
            </p>
          </div>
        </header>

        <div className="custom-messages flex-grow-1 p-3 overflow-auto">
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            messages.map((msg) => {
              const isSender =
                String(msg.sender) ===
                String(id || sessionStorage.getItem("id"));

              return (
                <div key={msg.id} className={`d-flex ${ isSender ? "justify-content-end" : "justify-content-start" } mb-2`}>
                  {!isSender && (
                    <div className="avatar bg-light text-dark rounded-circle d-flex align-items-center justify-content-center me-2">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  <div className={`chat-bubble ${isSender ? "bg-light text-white" : "bg-secondary text-white" } p-2 rounded`}>
                    <div>{msg.message}</div>
                    <small className="text-info text-end " style={{fontSize: "0.75rem",textAlign: isSender ? "right" : "left",}}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                  {isSender && (
                    <div className="avatar bg-light text-dark rounded-circle d-flex align-items-center justify-content-center ms-2">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="chat-input-container d-flex align-items-center bg-secondary p-3 border-top border-secondary">
          <form className="d-flex align-items-center w-100" onSubmit={handleSendMessage}>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Message ${selectedUser?.first_name || ""}...`} className="form-control flex-grow-1 bg-dark text-white rounded px-3"/>
            <button type="submit" className="send-button ms-2">
              <i className="fa fa-paper-plane text-primary fs-4"></i>
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}

export default Chat;
