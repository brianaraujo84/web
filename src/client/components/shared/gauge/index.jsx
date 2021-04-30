import React from 'react';
import PropTypes from 'prop-types';
import { Donut } from 'gaugeJS';

const Gauge = ({
  width,
  maxValue,
  minValue,
  animationSpeed,
  options,
  value,
  rotate,
}) => {

  const styles = {
    container: {
      position: 'relative',
      width: `${width}px`,
    },
    textContainer: {
      position: 'absolute',
      top: '50%',
      marginLeft: 'auto',
      marginRight: 'auto',
      left: '0',
      right: '0',
      textAlign: 'center',
    },
    rotate: {
      transform: 'rotate(180deg)',
    },
  };


  const canvas = React.useRef();

  const setGauge = (v) => {
    const gauge = new Donut(canvas.current);
    gauge.setOptions(options);
    gauge.animationSpeed = animationSpeed;
    gauge.minValue = minValue;
    gauge.maxValue = maxValue;
    gauge.set(v);
  };

  React.useEffect(() => {
    setGauge(value);
  }, [value]);

  return (
    <div style={styles.container}>
      <canvas
        ref={canvas}
        height={width}
        width={width}
        style={{ ...(rotate && styles.rotate) }}
      />
      <div style={styles.textContainer}>
        {value}
      </div>
    </div>

  );
};

Gauge.propTypes = {
  width: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  animationSpeed: PropTypes.number.isRequired,
  options: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  rotate: PropTypes.bool.isRequired,
};

Gauge.defaultProps = {
  width: 230,
  minValue: 0,
  maxValue: 1000,
  animationSpeed: 32,
  value: 0,
  rotate: false,
  options: {
    angle: 0.5,
    lineWidth: 0.13,
    radiusScale: 1,
    pointer: {
      length: 0.6,
      strokeWidth: 0.035,
      color: '#000000',
    },
    limitMax: false,
    limitMin: false,
    colorStart: '#6F6EA0',
    colorStop: '#7F47DD',
    strokeColor: '#D3D4DF',
    generateGradient: true,
    highDpiSupport: true,
  },
};

Gauge.displayName = 'Gauge';
export default Gauge;
