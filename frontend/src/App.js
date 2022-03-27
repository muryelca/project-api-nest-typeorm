import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Login from './components/pages/login/';
import Register from './components/pages/register';
import CreateProduct from './components/pages/product/create-product'
import EditProduct from './components/pages/product/edit-product';
import ViewProduct from './components/pages/product/view-product';

import CreateSell from './components/pages/sell/create-sell';
import ViewSell from './components/pages/sell/view-sell';
import EditSell from './components/pages/sell/edit-sell';

import Navbar from './components/layouts/navbar'
import Footer from './components/layouts/footer'
import Container from './components/layouts/Container'


const App = () => {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Container customClass="min-height"> 

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/create-product' element={<CreateProduct />} />
            <Route path='/edit-product' element={<EditProduct />} />
            <Route path='/view-product' element={<ViewProduct />} />
           <Route path='/create-sell' element={<CreateSell />} />
           <Route path='/view-sell' element={<ViewSell />} />
           <Route path='/edit-sell' element={<EditSell />} />

           </Container>
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;