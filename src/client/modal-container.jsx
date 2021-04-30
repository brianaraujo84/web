import React from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import ModalManager from './lib/modal';

const duration = 300; // Should be same as bootstrap modal's transition duration

const ModalContainer = () => {
  const [modals, setModals] = React.useState({});

  React.useEffect(() => {
    ModalManager.addChangeListener(setModals);
    return () => {
      ModalManager.removeChangeListener(setModals);
    };
  }, []);

  return (
    <TransitionGroup>
      {Object.entries(modals).map(([key, { component: Component, props = {} }]) => (
        <Transition key={key} timeout={duration}>
          {state => (
            <Component {...props} show={state !== 'exiting' && state !== 'exited'} onHide={() => ModalManager.closeModal(key)} />
          )}
        </Transition>
      ))}
    </TransitionGroup>
  );
};

ModalContainer.displayName = 'ModalContainer';

export default ModalContainer;
