import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Layout from '../../shared/layout';
import { useTitle, useActionDispatch } from '../../../hooks';
import { getPostStandardObjectsList } from '../../../redux/actions/objects';
import TemplateTableItem from './templateTableItem';
import * as URLS from '../../../urls';

const Templates = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useTitle(t('Templates'));

  const [locationType, setLocationType] = React.useState('');
  const [search_term, setSearch_term] = React.useState('');

  const getTemplates = useActionDispatch(getPostStandardObjectsList('templates', 'templates', undefined, 'administer/template'));

  const templatesList = useSelector(state => state.templates.items);

  const onSubmit = async (search_term) => {
    setSearch_term(search_term.toLowerCase());
  };

  React.useEffect(()=> {
    if (locationType) {
      getTemplates({
        'templateType':'Reference',
        locationType,
        // active
      });
    } else {
      getTemplates({'templateType':'Reference'});
    }
  }, [locationType]);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className='container pb-5 pt-3'>
          <div className='row align-items-center'>
            <div className='col pl-0'><h1>Templates</h1></div>
            <div className='col pr-0 text-right'>
              <button className='btn-primary btn' onClick={() => history.push(URLS.NEW_TEMPLATE)}><i className='fas fa-plus mr-1' aria-hidden></i> Create New</button>
            </div>
          </div>
          <div className='row mt-4'>
            <div className='col px-0'>
              <form>
                <label className='sr-only' htmlFor='inlineFormInputGroup'>Search</label>
                <div className='input-group mb-2'>
                  <div className='input-group-prepend'>
                    <div className='input-group-text'>
                      <i className='fas fa-search' aria-hidden></i>
                    </div>
                  </div>
                  <input type='text' className='form-control' id='inlineFormInputGroup' placeholder={t('Search Template')} onChange={(event) => onSubmit(event.target.value)} />
                </div>
              </form>
            </div>
            <div className='col'>
              <div className='form-group mb-2'>
                <select id='businesstype' className='form-control' onChange={(event) => setLocationType(event.target.value)}>
                  <option value=''>All Business Types</option>
                  <option value='Home'>Home</option>
                  <option value='Business'>Business</option>
                  <option value='Office'>Office</option>
                  <option value='School'>School</option>
                  <option value='Hotel'>Hotel</option>
                  <option value='Airbnb'>Airbnb</option>
                </select>
              </div>
            </div>
          </div>
          <div className='row mt-2'>
            <table className='table'>
              <thead style={{ width: '100%', alignItems: 'center'}}>
                <tr>
                  <th className=''>Template Name</th>
                  <th className=''>Status</th>
                  <th className=''>Author</th>
                  <th className=''>Business Type</th>
                  <th className=''>Tasks</th>
                </tr>
              </thead>
              <tbody style={{ whiteSpace: 'nowrap' }}>
                {templatesList ? templatesList.filter(item => item.templateName.toLowerCase().includes(search_term)).map((template, index) => (
                  <TemplateTableItem key={index} template={template} locationType={locationType} />
                )) : undefined}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

Templates.displayName = 'Templates';

export default Templates;
