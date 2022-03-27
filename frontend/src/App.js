import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Login from './pages/login';
import Register from './pages/register';
import CreateProduct from './pages/product/create-product'
import EditProduct from './pages/product/edit-product';
import ViewProduct from './pages/product/view-product';
import CreateSell from './pages/sell/create-sell';



const App = () => {
  return (
    <Router>
        <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/create-product' element={<CreateProduct />} />
        <Route path='/edit-product' element={<EditProduct />} />
        <Route path='/view-product' element={<ViewProduct />} />
        <Route path='/create-sell' element={<CreateSell />} />
        </Routes>
    </Router>
  );
}

export default App;