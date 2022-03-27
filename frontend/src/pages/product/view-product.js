import React from 'react';
import { useState, useEffect } from 'react';
import './product.css'
import box from './../../assets/box.png'
import PaginationComponent from '../../components/paginationComponents';
import PaginationSelector from '../../components/paginationSelector';


const ViewProduct = () => {
  const[products, setProduct] = useState([])
  const[productPerPage, setProductPerPage] = useState(10)
  const[currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(products.length / productPerPage)
  const startIndex = currentPage * productPerPage;
  const endIndex = startIndex + productPerPage;
  const currentProduct = products.slice(startIndex, endIndex)

  useEffect(() => { 
    const fetchData = async () => {
    const result = await fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(data => data)

    setProduct(result)
  }
  fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(0)
  }, [productPerPage])

  return (
    <div className='container'>
      <div className="container-product">
      <div className="wrap-product">
        <div className="product-form">
          <span className="product-form-title">Todos os produtos.</span>
          <span className="login-form-title">
            <img src={box} alt="Produto" />
          </span>      

      {currentProduct.map(item => {
        return <div className='item'>
          <span>{item.id}</span>
          <span>{item.title}</span>
          <span>{item.completed}</span>
           </div>
      })}

    <PaginationSelector productPerPage={productPerPage} setProductPerPage={setProductPerPage}/>
    <PaginationComponent pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

        </div>
      </div>
    </div>
  </div>
  );
}

export default ViewProduct;