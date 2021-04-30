/**
 * Catch shortcut fired from electron
 * @param {string} shortcut 
 * @param {function} callback 
 * @returns {void} 
 */
const catchShortcut = (shortcut, callback) => {
  if (window.electron) {
    window.electron.receive(shortcut, callback);
  }
};

export default catchShortcut;
