import React from "react";
import { Link } from "react-router-dom";

import Container from './Container'
import './../style/navbar.css'


function Navbar () {
return (
    <nav className="navbar">
      <Container>

        <ul className="list">
          <li className="items">
           <Link to="./view-product">Produtos</Link>
          </li>

          <li className="items">
           <Link to="./view-sell">Vendas</Link>
          </li>

          <li className="items">
           <Link to="./login">Login</Link>
          </li>

          <li className="items">
           <Link to="./register">Registrar</Link>
          </li>

        </ul>
      </Container>
    </nav>
)
}

export default Navbar;