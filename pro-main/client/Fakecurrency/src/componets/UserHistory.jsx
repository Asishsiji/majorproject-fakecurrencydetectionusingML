import React, { useEffect, useState } from "react";
import { viewfakeCurrency } from "../api/allApi";

function UserHistory() {
  const [historyData, sethistoryData] = useState([])
  const fetchHistory = () => {
    viewfakeCurrency().then(res => {
      sethistoryData(res.data)


    })

  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="container-fluid pt-4 px-4" style={{ overflowY: 'auto' }}>
      <div className="row g-4" style={{ minHeight: "100vh" }}>
        <div className="col-12">
          <div className="bg-secondary rounded h-100 p-4">
            <h5 className="mb-4">Fake Currency History</h5>
            <div className="table-responsive">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th scope="col">SI No.</th>
                    <th scope="col">Image</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <img
                          src={item.image_url}
                          alt="Fake currency"
                          style={{ width: "180px", height: "auto", objectFit: "cover", borderRadius: "5px", cursor: "pointer" }}
                          onClick={() => setSelectedImage(item.image_url)}
                        />
                      </td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
}

export default UserHistory;
