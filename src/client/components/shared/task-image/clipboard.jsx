import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Clipboard = (props) => {
  const [images, setImages] = useState([]);

  const getContainer = () => props.container || window;

  const isValidFormat = (fileType) => props.acceptedFiles.includes(fileType);

  const pasteHandler = (e) => checkPasted(e, pushImage);

  const transformImages = (data, cb) => {
    for (let i = 0; i < data.items.length; i++) {
      if (isValidFormat(data.items[i].type) !== false) {
        const blob = data.items[i].getAsFile();
        const URL = window.URL;

        if (blob) {
          const src = URL.createObjectURL(blob);

          cb(src);
        }
      } else {
        props.onError('Sorry, that\'s not a format we support');
      }
    }
  };

  const checkPasted = (e, cb) => {
    e.clipboardData && e.clipboardData.items.length > 0
      ? transformImages(e.clipboardData, cb)
      : props.onError('Sorry, to bother you but there was no image pasted.');
  };

  const pushImage = (source) => setImages([...images, source]);

  useEffect(() => {
    props.onPaste(images);
  }, [images]);

  const equals = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => v === b[i]);

  useEffect(() => {
    if (!equals(props.refreshState, images)) {
      setImages(props.refreshState);
    }
  }, [props.refreshState]);

  useEffect(() => {
    const elm = getContainer();
    elm.addEventListener('paste', pasteHandler);

    return () => {
      if (elm) {
        elm.removeEventListener('paste', pasteHandler);
      }
    };
  }, []);

  const { children } = props;
  return children ? children({ images }) : null;
};

Clipboard.propTypes = {
  refreshState: PropTypes.array.isRequired,
  acceptedFiles: PropTypes.array.isRequired,
  onPaste: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

Clipboard.defaultProps = {
  onPaste: () => null,
  onError: () => null,
  refreshState: [],
  acceptedFiles: ['image/gif', 'image/png', 'image/jpeg', 'image/bmp']
};

Clipboard.displayName = 'ScreenshotClipboard';
export default Clipboard;
