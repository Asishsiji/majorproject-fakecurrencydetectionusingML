import React from 'react'
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('id')
    navigate('/')
  };
  return (
    <>
      <button href="" className="btn p-2 text-white" onClick={handleLogout}><i className="fas fa-sign-out-alt p-2"></i>Logout</button>
    </>
  )
}

export default Logout