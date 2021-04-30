import React from 'react';

export default function useContextMenu() {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleContextMenu = React.useCallback(
    (e) => {
      e.preventDefault();
      setShowMenu(true);
    },
  );

  const handleClick = React.useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.addEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  return { showMenu };
}
