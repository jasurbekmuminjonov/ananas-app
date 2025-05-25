import React from 'react';
import Login from '../pages/Login';
import { Routes, Route } from 'react-router-dom'
import Register from '../pages/Register';
import Verify from '../pages/Verify';
const AuthLayout = () => {
    return (
        <div className='auth_layout'>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
            </Routes>
        </div>
    );
};


export default AuthLayout;