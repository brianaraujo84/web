import uniqueId from 'lodash.uniqueid';
import { EventEmitter } from 'events';

const CHANGE = 'change';

class ModalManager extends EventEmitter {
  constructor() {
    super();
    this.modals = {};
  }

  generateModalKey() {
    return uniqueId('modal_');
  }

  openModal(key, component, props = {}) {
    this.setModals({
      ...this.modals,
      [key]: {
        component,
        props,
      },
    });
  }

  updateModal(key, propsChange) {
    if (this.modals[key]) {
      this.setModals({
        ...this.modals,
        [key]: {
          ...this.modals[key],
          props: {
            ...this.modals[key].props,
            ...propsChange,
          }
        }
      });
    }
  }

  closeModal(key) {
    if (!this.modals[key]) {
      return;
    }

    const modals = { ...this.modals };
    delete modals[key];
    this.setModals(modals);
  }

  useModal(modalComponent) {
    const key = this.generateModalKey();
    const open = props => this.openModal(key, modalComponent, props);
    const update = props => this.updateModal(key, props);
    const close = () => this.closeModal(key);
    return [open, close, update];
  }

  setModals(modals) {
    this.modals = modals;
    this.emit(CHANGE, modals);
  }

  addChangeListener(callback) {
    this.addListener(CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE, callback);
  }
}

export default new ModalManager();
