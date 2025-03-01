import styles from "../assets/Loader.module.css"
import ReactDOM from "react-dom"

function Loader() {
  return ReactDOM.createPortal (
    <>
    <div className={styles.loaderOverlay}>

    <span className={styles.loader}></span>
    </div>
    </>,
     document.getElementById("loader")
  )
}

export default Loader