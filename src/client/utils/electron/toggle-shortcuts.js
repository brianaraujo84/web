/**
 * Toggle shortcuts
 * @param {string[]} enable 
 * @param {string[]} disable
 * @returns {void} 
 */
const toggleShortcuts = (enable, disable) => {
  if (window.electron) {
    window.electron.send('toggle-shortcuts', { enable, disable });
  }
};

export default toggleShortcuts;
