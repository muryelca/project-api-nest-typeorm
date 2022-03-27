import React from "react";

const PaginationSelector = ({productPerPage, setProductPerPage}) => {

    return(

        <div>
            Itens por pagina: 
        <select value={productPerPage} onChange={(e) => setProductPerPage(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

    )

}

export default PaginationSelector;