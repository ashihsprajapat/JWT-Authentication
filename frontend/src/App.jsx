import { useState } from 'react'

import { Route, Routes } from "react-router-dom"
import './App.css'
import HomePage from './pages/homePage';
import {Login} from './pages/Login';
import EmailVarify from './pages/EmailVarify';
import ResetPassword from './pages/ResetPassword';
import NotFount from './pages/NotFound';
import NavBar from './componenet/Navbar';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ToastContainer/>
        <NavBar/>
        <Routes>


          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-verify" element={<EmailVarify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/*" element={<NotFount />} />

        </Routes>
      </div>
    </>
  )
}

export default App
