import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { throttle } from 'throttle-debounce';
import Button from 'react-bootstrap/Button';
import Clipboard from '../../shared/task-image/clipboard';


const MACOS = 'Mac OS';
const IOS = 'iOS';
const WINDOWS = 'Windows';
const ANDROID = 'Android';
const LINUX = 'Linux';

const SCREENSHOT_PLACEHOLDER = {
  [MACOS]: '/assets/img/screenshot-keys-mac.png',
  [WINDOWS]: '/assets/img/screenshot-keys-windows.png',
  [IOS]: '/assets/img/screenshot-keys-windows.png',
  [ANDROID]: '/assets/img/screenshot-keys-windows.png',
  [LINUX]: '/assets/img/screenshot-keys-windows.png'
};

const ScreenshotContent = ({
  onSubmit,
  onClose
}) => {
  const [os, setOS] = React.useState('');

  const handleSubmit = throttle(1000, false, (data) => {
    onSubmit(data);
  });

  const handleClose = () => {
    onClose();
  };

  const handlePasteButton = async () => {
    try {
      const items = await navigator.clipboard.read();
      const image = items[0];
      if (image.types.includes('image/png')) {
        const blob = await image.getType('image/png');
        const URL = window.URL;
        const src = URL.createObjectURL(blob);
        handleSubmit([src]);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handlePaste = (upload) => {
    if (!upload || upload.length === 0) {
      return;
    }
    handleSubmit(upload);
  };

  /**
   * params: error
   */
  const handlePasteError = () => {
    // ATTENTION
    // The thing pasted should be valid image.
  };

  const getOS = () => {
    const userAgent = window.navigator.userAgen;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      return MACOS;
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      return IOS;
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      return WINDOWS;
    } else if (/Android/.test(userAgent)) {
      return ANDROID;
    } else if (/Linux/.test(platform)) {
      return LINUX;
    }
    return null;
  };

  const isOtherOS = () => {
    return os !== MACOS && os !== WINDOWS;
  };

  React.useEffect(() => {
    setOS(getOS());
  }, []);

  return (
    <div className="screenshot-wrapper pt-1">
      <h6 className='title pt-3'>Task Images</h6>
      <div className='screenshot-content'>
        <Clipboard onPaste={handlePaste} onError={handlePasteError} refreshState={[]} />
        <div className="w-100 text-right px-2 pt-2">
          <span className='close-icon' onClick={handleClose}><i className='far fa-times-circle'></i></span>
        </div>
        <div className='image-wrapper text-center px-3 pb-3'>
          <p className='description mb-2'>
            {os === MACOS && (<Trans><span>Press and hold these keys and drag to capture desired area:</span></Trans>)}
            {os === WINDOWS && (<Trans><span>Press the <b>Print Screen</b> (sometimes labeled <b>PrtScr</b>) key</span></Trans>)}
            {isOtherOS() && (<Trans><span>Press the <b>Print Screen</b> (sometimes labeled <b>PrtScr</b>) key</span></Trans>)}
          </p>
          <img src={SCREENSHOT_PLACEHOLDER[os]} />
          <div className="mt-3">
            <Button onClick={handlePasteButton}><Trans>Paste Screenshot</Trans></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ScreenshotContent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

ScreenshotContent.defaultProps = {
  onSubmit: () => {},
  onClose: () => {},
};

ScreenshotContent.displayName = 'LocationDetailsScreenshotContent';
export default ScreenshotContent;
