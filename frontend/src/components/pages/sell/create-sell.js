import React from 'react';
import { useState } from 'react';
import './../../style/sell.css'
import sell from './../../../assets/sell.png'

const CreateSell = () => {
  const[quantity, setQuantity] = useState("")
  const[name, setName] = useState("")
  const[price, setPrice] = useState("")

  return (
  <div className="container">
    <div className="container-sell">
      <div className="wrap-sell">
        <form className="sell-form">
          <span className="sell-form-title">Faça sua venda.</span>
          <span className="login-form-title">
            <img src={sell} alt="Venda" />
          </span>
  
          <div className="wrap-input"> {/* Nome do produto */}             
            <input
             className={name !== "" ? 'has-val input' : 'input'}
             type="name" 
             value={name}
             onChange={e => setName(e.target.value)}
             />
            <span className="focus-input" data-placeholder="Nome do produto"></span>
          </div>

          <div className="wrap-input"> {/* Preco do venda */}             
            <input
             className={price !== "" ? 'has-val input' : 'input'}
             type="price" 
             value={price}
             onChange={e => setPrice(e.target.value)}
             />
            <span className="focus-input" data-placeholder="Digite o preço"></span>
          </div>

          <div className="wrap-input"> {/* Quantidade do venda */}             
            <input
             className={quantity !== "" ? 'has-val input' : 'input'}
             type="quantity" 
             value={quantity}
             onChange={e => setQuantity(e.target.value)}
             />
            <span className="focus-input" data-placeholder="Quantidade do venda"></span>
          </div>
  
          <div className="container-sell-form-btn"> {/* botao criar venda */}
            <button className="sell-form-btn">Criar venda!</button>
          </div>
          
        </form>
      </div>
    </div>
  </div>
  );
}

export default CreateSell;