import React from 'react'
import style from './Window.module.css'

const WindowButton = props => {
    return (
        <button className={`${style['window-button']} ${style[props.color]}`} />
    )
}

export default WindowButton