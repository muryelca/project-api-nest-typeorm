import React from 'react';
import { useState } from 'react';
import logoBanner from './assets/logo.webp'
import './login.css'

const Register = () => {
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[firstName, setFirstName] = useState("")
  const[lastName, setLastName] = useState("")

  return (
  <div className="container">
    <div className="container-register">
      <div className="wrap-register">
        <form className="register-form">
          <span className="register-form-title">Bem Vindo, crie sua conta aqui!</span>
          <span className="register-form-title">
            <img src={logoBanner} alt="BeSafe" />
          </span>
  
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
  
          <div className="container-register-form-btn">
            <button className="register-form-btn">Criar Conta!</button>
          </div>
          
        </form>
      </div>
    </div>
  </div>
  );
}

export default Register;