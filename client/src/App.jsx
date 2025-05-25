import React from 'react';
import Auth from './pages/Login';
import Layout from './layout/Layout';
import AuthLayout from './layout/AuthLayout';

const App = () => {
  const token = localStorage.getItem('token')
  return (
    token ? <Layout /> : <AuthLayout />
  );
};


export default App;