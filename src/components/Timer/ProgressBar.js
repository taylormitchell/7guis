import style from './Timer.module.css'

const ProgressBar = (props) => {
    return (
        <div className={style["progress-bar"]}>
          <div className={style["progress"]} style={{ width: `${props.percent}%` }}></div>
        </div>
    )
}

export default ProgressBar;