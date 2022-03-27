import React from "react";
import { Link } from "react-router-dom";

import Container from './Container'
import styles from './../style/navbar.css'


function Navbar () {

return (
    <nav>
      <Container>
          <Link to="./view-product"> Produtos </Link>
          <Link to="./view-sell"> Vendas </Link>
          <Link to="./login"> Login </Link>
          <Link to="./register"> Registrar </Link>
      </Container>
    </nav>
)
}

export default Navbar;