import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';

const Layout = () => {
    return (
        <div className='layout'>
            <Routes>
                <Route path='/' element={<Home />} />
            </Routes>
        </div>
    );
};


export default Layout;