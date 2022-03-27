import React from 'react';
import styles from './../style/Container.css'

function Container(props) {
    return (
      <div className={`${styles.container} ${styles[props.customClass]}`}>
       {props.children}
       </div>
    )
}

export default Container;