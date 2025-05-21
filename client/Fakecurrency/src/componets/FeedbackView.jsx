import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { GetFeedback } from "../api/allApi";



function FeedbackView() {
  const [feedback, setfeedback] = useState([])

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = () => {
    GetFeedback()
      .then((res) => {
        setfeedback(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px", minHeight: '100vh' }}>
      <div style={{ backgroundColor: "#000", color: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #333", paddingBottom: "16px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>User Feedback</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {feedback.map((item) => (
            <div style={{ border: "1px solid #444", borderRadius: "8px", padding: "16px", backgroundColor: "#111" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h6 style={{ fontSize: "18px", fontWeight: "500" }}>{item.user?.username}</h6>
                <div style={{ display: "flex" }}>
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      style={{ color: index < item.rating ? "#FFD700" : "#555", marginRight: "4px" }}
                    />
                  ))}
                </div>
              </div>
              <p style={{ color: "#bbb" }}>{item.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeedbackView;
