import React, { useEffect, useState } from 'react';
import { DeleteControlRoom, GetControlRoom, GetLocation, UpdateControlRoom } from '../api/allApi';

function ControlRoomList() {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState({
        first_name: '',
        phone: '',
        email: '',
        location: '',
        id: '',
    });
    const [location, setLocation] = useState([]);

    useEffect(() => {
        fetchControlRoom();
        fetchLocation();
    }, []);

    const fetchControlRoom = () => {
        GetControlRoom().then((res) => setData(res.data));
    };

    const fetchLocation = () => {
        GetLocation().then((res) => setLocation(res.data));
    };

    const handleSubmit = (event) => {
        event.preventDefault();


        UpdateControlRoom(selectedData, selectedData.id).then(() => {
            fetchControlRoom();

            const closeButton = document.querySelector('#exampleModal .btn-close');
            if (closeButton) {
                closeButton.click();
            }
        });
    };

    const handleSelected = (item) => {
        setSelectedData({
            id: item.id,
            first_name: item.first_name,
            phone: item.phone,
            email: item.email,
            location: item.location.id,
        });
    };

    const handleDelete = (id) => {
        DeleteControlRoom(id).then(res => {
            fetchControlRoom()

        })
    }

    return (
        <>
            <div className="container-fluid pt-4 px-4">
                <div className="row g-4" style={{ minHeight: '100vh' }}>
                    <div className="col-12">
                        <div className="bg-secondary rounded h-100 p-4">
                            <h5 className="mb-4">Control Room List</h5>
                            <div className="table-responsive">
                                <table className="table table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Location</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={item.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{item.first_name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.location.name}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning me-2 mb-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#exampleModal"
                                                        onClick={() => handleSelected(item)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-primary mb-2" onClick={() => handleDelete(item.id)}> Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: '#6c757d' }}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">
                                    Edit
                                </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label text-dark">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={selectedData.first_name}
                                            onChange={(e) => setSelectedData({ ...selectedData, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="location" className="form-label text-dark">
                                            Location
                                        </label>
                                        <select
                                            className="form-select mb-3"
                                            aria-label="Default select example"
                                            value={selectedData.location}
                                            onChange={(e) => setSelectedData({ ...selectedData, location: e.target.value })}
                                        >
                                            <option value="">Select Location</option>
                                            {location.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label text-dark">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={selectedData.email}
                                            onChange={(e) => setSelectedData({ ...selectedData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ControlRoomList;
