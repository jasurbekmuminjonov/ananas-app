import React from 'react';
import Cookies from 'js-cookie';
import Auth from './pages/Auth';
import Layout from './layout/Layout';

const App = () => {
  const token = Cookies.get('token')
  return (
    token ? <Layout /> : <Auth />
  );
};


export default App;