import React, { useEffect, useState } from 'react'
import { GetUser, ViewUserResult } from '../api/allApi'
import { toast, ToastContainer } from 'react-toastify';

function UsersList() {

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userHistories, setuserHistories] = useState([]);



  useEffect(() => {
    fetchUser();
  }, [])

  const [users, setuser] = useState([])
  const fetchUser = () => {
    GetUser().then(res => {
      const filteruser = res.data.filter(user => user.is_superuser === false);
      
      
      setuser(filteruser);
    }).catch(err => {
      
      toast.warning("Error fetching users:")
    });
  };

  
  const fetchFakeCurrency = (userId) => {
    ViewUserResult(userId).then(res => {
      setuserHistories(res.data)
      console.log(res.data);
      
    })
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <ToastContainer/>
      <div className="row g-4" style={{ minHeight: "100vh" }}>
        <div className="col-12">
          <div className="bg-secondary rounded h-100 p-4">
            <h5 className="mb-4">Users List</h5>
            <div className="table-responsive">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th scope="col">SI No</th>
                    <th scope="col">Name</th>
                    
                    <th scope="col">Email</th>
                    <th scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>{users.length > 0 ? (
                  <>
                    {users.map((user, index) => (
                      <tr key={user.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedUser(user.id), fetchFakeCurrency(user.id) }}>
                        <th scope="row">{index + 1}</th>
                        <td>{user.username}</td>
                        {/* <td></td> */}
                        <td>{user.email}</td>
                        <td>{user.location?.name}</td>
                      </tr>
                    ))}
                  </>
                ) : <>
                  <tr><td colSpan="5" className="text-center p-3">No Users Found</td></tr>
                </>}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
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
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="modal-content bg-dark p-4"
            style={{ width: "80%", maxHeight: "80vh", overflowY: "auto", borderRadius: "10px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-4 text-white">
              History for {users.find((user) => user.id === selectedUser)?.name}
            </h5>
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Image</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {userHistories.length > 0 ?
                  userHistories.map((history, index) => (
                    <tr key={history.id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <img
                          src={history.image_url}
                          alt="Fake currency"
                          style={{ width: "100px", height: "auto", objectFit: "cover", borderRadius: "5px", cursor: "pointer" }}
                          onClick={() => setSelectedImage(history.image_url)}
                        />
                      </td>
                      <td>{history.date}</td>
                    </tr>
                  )) : (<p className='p-4'>no data</p>)
                }
              </tbody>
            </table>
            <button className="btn btn-primary mt-3 w-100" onClick={() => setSelectedUser(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: "relative" }}>
            <img src={selectedImage} alt="Full size" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "10px" }} />
            <button
              className="btn btn-danger"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: "5px 15px",
                borderRadius: "50%",
              }}
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersList;

