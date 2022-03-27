import React from "react";
import { Link } from "react-router-dom";

import Container from './Container'
import styles from './../style/navbar.css'
import logo from './../../assets/logo.webp'


function Navbar () {

return (
    <Container>
    <Link to="./../pages/product/view-product.js"> Produtos </Link>
    <Link to="./../pages/sell/view-sell.js"> Vendas </Link>
    <Link to="./../pages/login/index.js"> Login </Link>
    <Link to="./../pages/register/index.js"> Registrar </Link>
    </Container>
)
}

export default Navbar;