import React, { useState } from "react";
import { addFeedbackUrl } from "../api/allApi";
import { toast, ToastContainer } from "react-toastify";

function AddFeedback() {
  const [rating, setRating] = useState(3);
  const [feedback, setFeedback] = useState("");

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value, 10));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = { feedback, rating, };

    addFeedbackUrl(data)

      .then((res) => {
        setFeedback("");
        setRating(2);
        toast.success("Feedback submitted");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "An error occurred. Please try again.");
      });
  };


  return (
    <>
      <div className="bio-graph-heading">
        <ToastContainer />
        <h2 className="feedback-heading ">Leave Your Feedback</h2>
        <p className="feedback-quote">
          <i>
            Your feedback is the fuel that drives improvement. Share your
            thoughts and help us grow!
          </i>
        </p>
      </div>
      <div className="feedback-container-fluid">
        <div className="feedback-container">
          <form onSubmit={handleSubmit}>
            <textarea
              name="feedback"
              placeholder="Write your feedback here..."
              rows="4"
              className="feedback-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>

            <div className="rating-input">
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      value={starValue}
                      onClick={() => setRating(starValue)}
                      required
                      onChange={handleRatingChange}
                      style={{ display: "none" }}
                    />
                    <i
                      className={`fa fa-star`}
                      style={{
                        color: starValue <= rating ? "#f39c12" : "#444",
                        fontSize: "25px",
                        cursor: "pointer",
                        transition: "color 0.3s ease",
                      }}
                    ></i>
                  </label>
                );
              })}
            </div>


            <button type="submit" className="submit-feedback-button">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddFeedback;
