import React, { useState } from 'react'; 
import styles from './Counter.module.css';

const Counter = props => {
    const [count, setCount] = useState(0)
    const clickButtonHandler = () => {
        setCount(prevState => prevState + 1)
    }
    return (
        <div className={styles.counter}>
            <input className={styles.input} type="text" value={count} disabled></input>
            <button className={styles.button} onClick={clickButtonHandler}>Count</button>
        </div>
    )
}

export default Counter;