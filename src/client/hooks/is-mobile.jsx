
import { useMediaPredicate } from 'react-media-hook';

export default () => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return false;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return true;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return false;
  } else if (/Android/.test(userAgent)) {
    return useMediaPredicate('(max-width: 800px)');
  } else if (/Linux/.test(platform)) {
    return useMediaPredicate('(max-width: 800px)');
  }
  return null;
};
