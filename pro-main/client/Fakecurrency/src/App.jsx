import React from 'react'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Admin from './componets/Admin'
import Register from './componets/Register'
import Profile from './componets/Profile'
import Login from './componets/Login'
import ForgotPassword from './componets/ForgotPassword'
import ControlRoom from './componets/ControlRoom'
import Home from './componets/Home'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot' element={<ForgotPassword/>}/>
        <Route path='/controlroom' element={<ControlRoom/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App