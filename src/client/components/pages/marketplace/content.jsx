import React from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { classnames } from 'react-form-dynamic';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import PropTypes from 'prop-types';

import { useActionDispatch } from '../../../hooks';
import { setObject } from '../../../redux/actions/object';
import useIsMobile from '../../../hooks/is-mobile';

import * as URLS from '../../../urls';

const NEW_TEMPLATE = 'newTemplate';
const LOCATION_TYPE = 'locationType';

const SCREEN_MY = 1;
const SCREEN_ALL = 2;

let to;
let fetching = true;

const MarketPlaceContent = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [screen, setScreen] = React.useState(SCREEN_ALL);
  const [list, setList] = React.useState([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const updateTemplateData = useActionDispatch(setObject(NEW_TEMPLATE));
  const saveLocationType = useActionDispatch(setObject(LOCATION_TYPE));

  const templatesList = useSelector(state => state.templates.items);
  const myTemplatesList = useSelector(state => state.myTemplates.items);
  const templatesListFetching = useSelector(state => state.templates.inprogress);
  const myTemplatesListFetching = useSelector(state => state.myTemplates.inprogress);
  const newTemplateData = useSelector(state => state.newTemplate);
  const profile = useSelector(state => state.profile.data);

  const isMobile = useIsMobile();

  const handleTemplateSelection = (selectedTemplate) => {
    const data = { ...newTemplateData.data };
    data.activeList = screen;
    updateTemplateData(data);
    history.push(URLS.PRODUCT_DETAILS(selectedTemplate.templateId), {
      screen
    });
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

  const handleLocationTypeFilterSelect = ({ target: { value } }) => {
    if (value === 'All') {
      setList(chooseList());
    } else {
      const tmpList = chooseList().filter(t => t.locationType === value);
      setList(tmpList);
    }
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
    saveLocationType(tpl.locationType);
    handleTemplateSelection(tpl);
  };

  React.useEffect(()=> {
    const { activeList = SCREEN_ALL } = newTemplateData;
    setScreen(activeList);
  }, []);

  React.useEffect(() => {
    initList();
  }, [templatesList, screen]);

  React.useEffect(() => {
    fetching = (templatesListFetching || myTemplatesListFetching);
  }, [templatesListFetching, myTemplatesListFetching]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (history && history.location && history.location.state && history.location.state.screen) {
      setScreen(history.location.state.screen);
    }
  },[]);
  
  return (
    <>
      <div className='container pt-3'>
        <div className='row justify-content-center'>
          <div className='col-12'>
            <h1 className='mb-2'><Trans i18nKey="marketplace" /></h1>
            <p className='mb-0 lead'><Trans i18nKey="lib_templates" /></p>
          </div>
        </div>
      </div>
      <nav className="mt-3">
        <div className="nav nav-tabs nav-fill font-weight-bold" id="nav-tab" role="tablist">
          <div className="container px-md-3 d-flex">
            <a
              className={classnames(['nav-item nav-link', (screen === SCREEN_MY) && 'active'])}
              href="#"
              onClick={(e) => handleScreenChange(SCREEN_MY, e)}
            >
              <Trans i18nKey="my_prods" />
            </a>
            <a
              className={classnames(['nav-item nav-link', (screen === SCREEN_ALL) && 'active'])}
              href="#"
              onClick={(e) => handleScreenChange(SCREEN_ALL, e)}
            >
              <Trans i18nKey="all_prods" />
            </a>
            {profile.isOwner && !isMobile && <a className="nav-item nav-link" id="nav-manage-tab" href="#" onClick={() => history.push(URLS.TEMPLATES)}><Trans i18nKey="Manage" /> <i className="fas fa-sm fa-external-link" aria-hidden="true"></i></a>}
          </div>
        </div>
      </nav>

      <div className="bg-light py-3 border-bottom">
        <div className="container">
          <div className="tab-content" id="nav-tabContent">
            <div className="tab-pane fade show active" id="nav-my" role="tabpanel" aria-labelledby="nav-my-tab">
              <div className="d-flex w-100">
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
                        placeholder={t('search_prod')}
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
                  onClick={() => setShowFilters(show => !show)}
                ><i className="fas fa-filter" aria-hidden="true"></i> <span className="sr-only"><Trans>Filter Templates</Trans></span></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFilters && <div id="marketplace-filters" className='border-bottom py-3 collapse show'>
        <div className="container">
          <div className="row">
            <div className="col-6">
              <Form.Group className="form-group mb-2">
                <Form.Label className="text-secondary mb-1"><small><Trans i18nKey="categories" /></small></Form.Label>
                <Form.Control as="select" onChange={handleLocationTypeFilterSelect} id="filter-sort-task" className="selectpicker form-control" data-dropup-auto="false" tabIndex="-98">
                  <option selected="">{t('All')}</option>
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
                <Form.Control as="select" disabled={true}>
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
                  <a className="template d-flex mb-3 text-dark" onClick={handleSelect(template)}>
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

MarketPlaceContent.propTypes = {
  templatesList: PropTypes.array,
};

MarketPlaceContent.displayName = 'MarketPlaceContent';
export default MarketPlaceContent;
