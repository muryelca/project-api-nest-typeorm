import React from 'react';
import { useState } from 'react';
import './../../style/sell.css'
import box from './../../../assets/box.png'

const EditSell = () => {
  const[quantity, setQuantity] = useState("")
  const[body, setBody] = useState("")
  const[name, setName] = useState("")
  const[price, setPrice] = useState("")

  return (
  <div className="container">
    <div className="container-sell">
      <div className="wrap-sell">
        <form className="sell-form">
          <span className="sell-form-title">Edite seu produto.</span>
          <span className="login-form-title">
            <img src={box} alt="Produto" />
          </span>
  
          <div className="wrap-input"> {/* Edite sua venda */}             
            <input
             className={name !== "" ? 'has-val input' : 'input'}
             type="name" 
             value={name}
             onChange={e => setName(e.target.value)}
             />
            <span className="focus-input" data-placeholder="Edite sua venda"></span>
          </div>

          <div className="wrap-input"> {/* Preco do produto */}             
            <input
             className={price !== "" ? 'has-val input' : 'input'}
             type="price" 
             value={price}
             onChange={e => setPrice(e.target.value)}
             />
            <span className="focus-input" data-placeholder="Digite o preço"></span>
          </div>

          <div className="wrap-input"> {/* Quantidade do produto */}             
            <input
             className={quantity !== "" ? 'has-val input' : 'input'}
             type="quantity" 
             value={quantity}
             onChange={e => setQuantity(e.target.value)}
             />
            <span className="focus-input" data-placeholder="Quantidade do produto"></span>
          </div>
  
          <div className="wrap-input"> {/* Descrição do produto */}
            <input 
            className={body !== "" ? 'has-val input' : 'input'} 
            type="body" 
            value={body}
             onChange={e => setBody(e.target.value)}
            />
            <span className="focus-input" data-placeholder="Descrição do produto"></span>
          </div>
  
          <div className="container-sell-form-btn"> {/* botao editar produto */}
            <button className="sell-form-btn">Edite a venda!</button>
          </div>
          
        </form>
      </div>
    </div>
  </div>
  );
}

export default EditSell;