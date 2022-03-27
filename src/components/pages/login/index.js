import React from 'react';
import { useState } from 'react';
import logoBanner from './../../../assets/logo.webp'
import './../../style/login.css'
import { Link } from 'react-router-dom'

const Login = () => {  
   const[email, setEmail] = useState("")
   const[password, setPassword] = useState("")

   return (
    <div className="container">
    <div className="container-login">
      <div className="wrap-login">
        <form className="login-form">
          <span className="login-form-title">Bem Vindo!</span>
          <span className="login-form-title">
            <img src={logoBanner} alt="BeSafe" />
          </span>

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

          <div className="container-login-form-btn">
            <button className="login-form-btn">Login</button>
          </div>

          <div className="text-center">
            <span className="txt1">Não possui conta? </span>

           {/* </div><a className="txt2" <Link to="./../register">> </Link> Criar conta.</a> */}
            <Link to="./../register"> Criar conta.</Link>

          </div>
          
        </form>
      </div>
      </div>
    </div>
  );
}

export default Login;