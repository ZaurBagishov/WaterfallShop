import styles from '../assets/Button.module.css';
import PropTypes from 'prop-types';




function Button(props) {
  return (
    <div>
      <button style={{ width: props.width, height: props.height }} className={styles.btnProducts} onClick={props.onClick}>
        <span>{props.name}</span>
      </button>
    </div>
  );
}
Button.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,

  height: PropTypes.string.isRequired,
};

export default Button;
