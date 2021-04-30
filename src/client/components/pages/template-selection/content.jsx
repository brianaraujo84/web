import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { classnames } from 'react-form-dynamic';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { useActionDispatch } from '../../../hooks';
import { getStandardObject, setObject } from '../../../redux/actions/object';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import * as URLS from '../../../urls';

const OBJECT_LOСATION = 'location';
const OBJECT_MY_TEMPLATES = 'myTemplates';
const NEW_TEMPLATE = 'newTemplate';

const SCREEN_MY = 1;
const SCREEN_ALL = 2;

let to;

const Content = ({ templatesList, locationType }) => {
  const { t } = useTranslation();
  const { locationId } = useParams();
  const { search: searchData = '' } = useLocation();
  const history = useHistory();

  const [screen, setScreen] = React.useState(SCREEN_ALL);
  const [list, setList] = React.useState([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [fetching, setFetching] = React.useState(false);

  const myTemplatesList = useSelector(state => state.myTemplates.items);
  const newTemplateData = useSelector(state => state.newTemplate.data);
  const templatesListFetching = useSelector(state => state.templates.inprogress);
  const myTemplatesListFetching = useSelector(state => state.myTemplates.inprogress);

  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));
  const getMyTemplates = useActionDispatch(getStandardObjectsList(OBJECT_MY_TEMPLATES, 'templateList', undefined, 'templates/purchasedtemplates'));
  const updateTemplateData = useActionDispatch(setObject(NEW_TEMPLATE));

  const handleTemplateSelection = (selectedTemplate) => {
    const data = { ...newTemplateData };
    data.activeList = screen;
    updateTemplateData(data);
    history.push({ pathname: URLS.TASK_TEMPLATE(locationId, selectedTemplate.templateId), search: searchData });
  };

  const getImageUri = (templateId) => {
    return `/api/files/template/${templateId}/logo/thumbnail.png`;
  };

  const chooseList = () => {
    if (screen === SCREEN_ALL) {
      return templatesList;
    } else {
      return myTemplatesList;
    }
  };

  const initList = () => {
    setList(chooseList());
  };

  const handleScreenChange = (screen, e) => {
    e.stopPropagation();
    e.preventDefault();
    setScreen(screen);
  };

  const handleSearchChange = ({ target: { value } }) => {
    setSearch(value);
    if (to) {
      window.clearTimeout(to);
    }
    to = window.setTimeout(() => {
      const tmpList = chooseList().slice(0).filter((t => (
        (t.templateName || '').toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        (t.templateDescription || '').toLowerCase().indexOf(value.toLowerCase()) !== -1
      )));
      setList(tmpList);
    }, 500);
  };

  const handleSelect = (tpl) => (event) => {
    event.preventDefault();
    handleTemplateSelection(tpl);
  };

  React.useEffect(() => {
    scrollTo(0, 0);
    getLocation(locationId);
    getMyTemplates();
    const { activeList = SCREEN_ALL } = newTemplateData;
    setScreen(activeList);
  }, []);

  React.useEffect(() => {
    initList();
  }, [templatesList, screen]);

  React.useEffect(() => {
    setFetching(templatesListFetching || myTemplatesListFetching);
  }, [templatesListFetching, myTemplatesListFetching]);

  return (
    <>
      <div className='pt-3'>
        <div className="container">
          <div className='row justify-content-center'>
            <div className='col-12'>
              <h1 className='mb-2'><Trans i18nKey="marketplace" /></h1>
              <p className='mb-0 lead'><Trans i18nKey="lib_templates" /></p>
            </div>
          </div>
        </div>
        <nav className='mt-3'>
          <div className='nav nav-tabs nav-fill font-weight-bold' id='nav-tab' role='tablist'>
            <div className="container px-md-3 d-flex">
              <a
                className={classnames(['nav-item nav-link', (screen === SCREEN_MY) && 'active'])}
                href="#"
                data-target="my-templates-selection"
                onClick={(e) => handleScreenChange(SCREEN_MY, e)}
              >
                <Trans i18nKey="my_templates" />
              </a>
              <a
                className={classnames(['nav-item nav-link', (screen === SCREEN_ALL) && 'active'])}
                href="#"
                data-target="all-templates-selection"
                onClick={(e) => handleScreenChange(SCREEN_ALL, e)}
              >
                <Trans i18nKey="all_templates" />
              </a>
            </div>
          </div>
        </nav>
      </div>

      <div className="border-bottom mt-3">
        <div className="container tab-content" id="nav-tabContent">
          <div className="tab-pane fade active show" id="nav-all" role="tabpanel" aria-labelledby="nav-my-tab">
            <div className="d-flex w-100 mb-3">
              <div className="w-100 pr-3">
                <InputGroup>
                  <label className="sr-only">Search</label>
                  <div className="input-group">
                    <InputGroup.Prepend className="input-group-prepend">
                      <InputGroup.Text className="input-group-text"><i className="fas fa-search" aria-hidden="true"></i></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type="text" 
                      className="form-control" 
                      id="inlineFormInputGroup"
                      value={search}
                      onChange={handleSearchChange}
                      placeholder={t('search_template')}
                      data-target="template-search-input"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      autoComplete="off"
                    />
                  </div>
                </InputGroup>
              </div>
              <button 
                className="btn btn-outline-secondary" 
                role="button" 
                data-toggle="collapse" 
                aria-expanded="true" 
                aria-controls="marketplace-filters"
                data-target="toggle-filter-btn"
                onClick={() => setShowFilters(show => !show)}
              ><i className="fas fa-filter" aria-hidden="true"></i> <span className="sr-only"><Trans>Filter Templates</Trans></span></button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && <div id="marketplace-filters">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <Form.Group className="form-group mb-2">
                <Form.Label className="text-secondary mb-1"><small><Trans i18nKey="categories" /></small></Form.Label>
                <Form.Control 
                  as="select" 
                  id="filter-sort-task" 
                  className="selectpicker form-control" 
                  data-dropup-auto="false" 
                  tabIndex="-98" 
                  disabled>
                  <option selected={''}>{t(locationType && locationType.data && locationType.data.locationType ? locationType.data.locationType : '')}</option>
                  <option>{t('Home')}</option>
                  <option>{t('Business')}</option>
                  <option>{t('Office')}</option>
                  <option>{t('School')}</option>
                  <option>{t('Hotel')}</option>
                  <option>{t('Airbnb')}</option>
                </Form.Control>
              </Form.Group>
            </div>
            <div className="col-6 pl-0">
              <Form.Group className="form-group mb-2">
                <Form.Label className="text-secondary mb-1"><small><Trans i18nKey="sort_by" /></small></Form.Label>
                <Form.Control as="select" disabled>
                  <option selected="">{t('popularity')}</option>
                  <option>{t('newest_first')}</option>
                  <option>{t('names_a_z')}</option>
                  <option>{t('names_z_a')}</option>
                </Form.Control>
              </Form.Group>
            </div>
          </div>
        </div>
      </div>}
      <div className="container mt-3">
        <div className="row justify-content-center pb-2">
          <div className="col-12">
            <div className="row">
              {!fetching && !list.length && <p className="text-center"><Trans i18nKey="no_template" /></p>}
              {(list || templatesList).map((template, index) => (
                <div className="col-12 col-md-6 col-xl-4" key={index}>
                  <a className="template d-flex mb-3 text-dark" onClick={handleSelect(template)} data-target={`template-container-${index}`}>
                    <div className="random-background border rounded mr-2">
                      <img src={getImageUri(template.templateId)} width="67" height="67" />
                    </div>
                    <div>
                      <p className="font-weight-bold my-1 truncate-1">{template.templateName}</p>
                      {template.author && <p className="mb-1 truncate-1">{template.author}</p>}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
Content.propTypes = {
  templatesList: PropTypes.array,
  locationType: PropTypes.object,
};

Content.displayName = 'Content';
export default Content;
