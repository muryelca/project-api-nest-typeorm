import React from "react";
import './../style/product.css'

const PaginationComponent = ({pages, currentPage, setCurrentPage}) => {

    return(

        <div className="pagination">
        {Array.from(Array(pages), (item, index) => {
          return <button
           style= { index === currentPage ? {background: "green"} : null}
           className="active"
           value={index} 
           onClick={(e) => 
                setCurrentPage(Number(e.target.value))}>
            {index + 1}
            </button>
        })}
      </div>

    )

}

export default PaginationComponent;