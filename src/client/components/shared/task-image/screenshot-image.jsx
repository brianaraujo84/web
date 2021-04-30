import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: ${props => props.size.width}px;
  height: ${props => props.size.height}px;
`;

const Image = ({ src, alt, index, onRemove }) => {
  const [size, setSize] = React.useState({ width: 100, height:100 });
  
  const handleImageLoad = ({ target }) => {
    setSize({
      width: target.clientWidth,
      height: target.clientHeight,
    });
  };

  return (
    <Wrapper className="screenshot-image" size={size}>
      <img src={src} alt={`Pasted: ${alt}`} onLoad={handleImageLoad} />
      <i className='text-danger fas fa-times-circle' onClick={() => onRemove(index)} />
    </Wrapper>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  index: PropTypes.number,
  onRemove: PropTypes.func.isRequired,
};

Image.defaultProps = {
  alt: 'Screenshot Image',
  onRemove: () => {}
};

Image.displayName = 'ScreenshotImage';
export default Image;
