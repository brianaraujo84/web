import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useActionDispatch } from './hooks';
import { saveShortcuts } from './redux/actions/electron';

const ElectronLoader = () => {
  const history = useHistory();
  const profile = useSelector(state => state.profile.data);

  const _saveShortcuts = useActionDispatch(saveShortcuts);

  useEffect(() => {
    let unsubscribe, unsubscribeShowTemplateBuilder;
    if (window.electron) {
      unsubscribe = window.electron.receive('shortcuts-list', (shortcuts) => {
        _saveShortcuts(shortcuts);
      });
      
      unsubscribeShowTemplateBuilder = window.electron.receive('show-template-builder', () => {
        history.push('/templates');
      });
    }
    return () => {
      if (window.electron) {
        if (unsubscribe) { unsubscribe(); }
        if (unsubscribeShowTemplateBuilder) { unsubscribeShowTemplateBuilder(); }
      }
    };
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (window.electron) {
      if (profile && profile.username && profile.imgThumb) {
        unsubscribe = window.electron.receive('show-profile-page', () => {
          history.push('/account');
        });
        window.electron.send('update-profile', `${window.location.origin}${profile.imgThumb}`);
      } else { 
        window.electron.send('update-profile');
      }
    }
    return () => {
      if (window.electron && unsubscribe) {
        unsubscribe();
      }
    };
  }, [profile]);

  return null;
};

export default ElectronLoader;
