import React from 'react'
import WindowButton from './WindowButton'
import style from './Window.module.css'

const WindowHeader = props => {
    return (
        <div className={style['window-header']}>
            {/* <div className={style.buttons}>
                <WindowButton color='red'/>
                <WindowButton color='yellow'/>
                <WindowButton color='green'/>
            </div> */}
            <div>
                <span>{props.title}</span>
            </div>
        </div>
    );
}

export default WindowHeader;