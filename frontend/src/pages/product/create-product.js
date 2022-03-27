import React from 'react';
import { useState } from 'react';
import logoBanner from './../../assets/logo.webp'
import './product.css'

const createProduct = () => {
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[firstName, setFirstName] = useState("")
  const[lastName, setLastName] = useState("")

  return (
  <div className="container">
    <div className="container-product">
      <div className="wrap-product">
        <form className="product-form">
          <span className="product-form-title">Crie seu produto.</span>
  
          <div className="wrap-input">              
            <input
             className={firstName !== "" ? 'has-val input' : 'input'}
             type="firstName" 
             value={firstName}
             onChange={e => setFirstName(e.target.value)}
             />
            <span className="focus-input" data-placeholder="Primeiro Nome"></span>
          </div>

          <div className="wrap-input">              
            <input
             className={lastName !== "" ? 'has-val input' : 'input'}
             type="lastName" 
             value={lastName}
             onChange={e => setLastName(e.target.value)}
             />
            <span className="focus-input" data-placeholder="Sobrenome"></span>
          </div>

          <div className="wrap-input">              
            <input
             className={email !== "" ? 'has-val input' : 'input'}
             type="email" 
             value={email}
             onChange={e => setEmail(e.target.value)}
             />
            <span className="focus-input" data-placeholder="E-mail"></span>
          </div>
  
          <div className="wrap-input">
            <input 
            className={password !== "" ? 'has-val input' : 'input'} 
            type="password" 
            value={password}
             onChange={e => setPassword(e.target.value)}
            />
            <span className="focus-input" data-placeholder="Senha"></span>
          </div>
  
          <div className="container-product-form-btn">
            <button className="product-form-btn">Criar Conta!</button>
          </div>

          <div className="text-center">
            <span className="txt1">Já possui conta? </span>

            <a className="txt2" href="./../login"> Faça seu Login</a>
          </div>
          
        </form>
      </div>
    </div>
  </div>
  );
}

export default createProduct;