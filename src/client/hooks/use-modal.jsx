import React from 'react';
import ModalManager from '../lib/modal';

export default function useModal(modalComponent) {
  const functions = React.useMemo(() => {
    return ModalManager.useModal(modalComponent);
  }, [modalComponent]);

  // Make sure to close the modal when parent component is destroyed or "modalComponent" is changed
  React.useEffect(() => {
    return () => {
      functions[1]();
    };
  }, [functions]);

  return functions;
}
