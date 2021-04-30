import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  toast: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 10000,
  }
};

let to, animate;

const Toast = ({
  onClose,
  delay,
  message,
  handlerFn,
  handlerName,
}) => {
  const [runAnim, setRunAnim] = React.useState(false);

  const onHandlerFn = () => {
    handlerFn();
    onClose();
  };

  React.useEffect(() => {
    to = window.setTimeout(() => {
      onClose();
    }, delay);
    animate = window.setTimeout(() => {
      setRunAnim(true);
    }, delay - 1000);
    return () => {
      window.clearTimeout(to);
      window.clearTimeout(animate);
    };
  }, []);

  return (
    <>
      <div className={`custom-toast p-4 d-flex w-100 fade-in ${runAnim && 'fade-out'}`} style={styles.toast}>
        <div className="alert bg-dark d-flex align-items-center justify-content-between text-light w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="mr-1">{message} {handlerName && <a className="text-warning" onClick={onHandlerFn}><u>{handlerName}</u></a>}</div>
          <button type="button" className="close text-light" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </>
  );
};


Toast.propTypes = {
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string,
  delay: PropTypes.number,
  handlerFn: PropTypes.func,
  handlerName: PropTypes.string,
};

Toast.defaultProps = {
  delay: 2000,
  message: '',
  handlerFn: () => {},
  handlerName: '',
};

Toast.displayName = 'Toast';
export default Toast;
