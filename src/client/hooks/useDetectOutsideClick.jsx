import { useEffect } from 'react';

/**
 * Hook for handling closing when clicking outside of an element
 * @param {React.node} el
 * @param {boolean} initialState
 */
export const useDetectOutsideClick = (el, handler) => {
  const onClick = e => {
    if (el.current && !el.current.contains(e.target)) {
      handler(event);
    }
  };
  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  });
};
