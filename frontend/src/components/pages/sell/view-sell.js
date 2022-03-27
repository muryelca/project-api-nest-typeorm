import React from 'react';
import { useState, useEffect } from 'react';
import './sell.css'
import sell from './../../../assets/sell.png'
import PaginationComponent from './../../layouts/paginationComponents';
import PaginationSelector from './../../layouts/paginationSelector';


const ViewSell = () => {
  const[sells, setSell] = useState([])
  const[sellPerPage, setSellPerPage] = useState(10)
  const[currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(sells.length / sellPerPage)
  const startIndex = currentPage * sellPerPage;
  const endIndex = startIndex + sellPerPage;
  const currentSell = sells.slice(startIndex, endIndex)

  useEffect(() => { 
    const fetchData = async () => {
    const result = await fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(data => data)

    setSell(result)
  }
  fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(0)
  }, [sellPerPage])

  return (
    <div className='container'>
      <div className="container-sell">
      <div className="wrap-sell">
        <div className="sell-form">
          <span className="sell-form-title">Todas as vendas.</span>
          <span className="login-form-title">
            <img src={sell} alt="Produto" />
          </span>      

      {currentSell.map(item => {
        return <div className='item'>
          <span>{item.id}</span>
          <span>{item.title}</span>
          <span>{item.completed}</span>
           </div>
      })}

    <PaginationSelector sellPerPage={sellPerPage} setSellPerPage={setSellPerPage}/>
    <PaginationComponent pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

        </div>
      </div>
    </div>
  </div>
  );
}

export default ViewSell;