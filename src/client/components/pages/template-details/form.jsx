import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-form-dynamic';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';

import { Input } from 'react-form-dynamic';
import EnhancedInput from './enhanced-input';
import { useActionDispatch } from '../../../hooks';
import { toBase64Array, preloadImage } from '../../../utils';
import { uploadTemplateTaskImages, deleteTemplateTaskImage } from '../../../redux/actions/files';
import { _postObject } from '../../../services/services';
import * as URLS from '../../../urls';
import SearchTags from './search-tags';
import useDebounce from '../../../hooks/useDebounce';

const classes = {
  input: {
    input: 'form-control',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
  lgInput: {
    input: 'form-control form-control-lg',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
  compliantHeader: {
    input: 'rounded text-uppercase text-center bg-black text-white badge-status-text p-0 font-weight-bold',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
  eventCompletionTextInput: {
    input: 'w-100 mb-1 rounded text-center event-completed-on-text p-0 font-weight-bold',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
  eventNextScheduledforTextInput: {
    input: 'w-100 mb-1 rounded text-center event-scheduled-text p-0',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  }
};

const screenshotTaskIds = ['screenshotOne', 'screenshotTwo', 'screenshotThree', 'screenshotFour', 'screenshotFive'];
         
const Form = ({ template, getTemplates, taskCount, status }) => {
  const { t } = useTranslation();
  const { templateId } = useParams();

  const [isTitleEdit, setIsTitleEdit] = React.useState(false);
  const [isTemplateInfoEdit, setIsTemplateInfoEdit] = React.useState(false);
  const [isAuthorInfoEdit, setIsAuthorInfoEdit] = React.useState(false);
  const [screenshots, setScreenshots] = React.useState([]);
  const [inputChanged, setInputChanged] = React.useState(false);

  const uploadTemplateImages = useActionDispatch(uploadTemplateTaskImages);
  const deleteTemplateImage = useActionDispatch(deleteTemplateTaskImage);

  const marketplaceIconRef = React.useRef(null);
  const smartDisplayDefaultImageRef = React.useRef(null);
  const smartDisplayCompliantImageRef = React.useRef(null);
  const smartDisplayNonCompliantImageRef = React.useRef(null);
  const virtualDisplayDefaultImageImageRef = React.useRef(null);
  const virtualDisplayCompliantImageImageRef = React.useRef(null);
  const virtualDisplayNonCompliantImageImageRef = React.useRef(null);
  const screenshotImagesRef = React.useRef(null);

  React.useEffect(()=> {
    for (const taskId of screenshotTaskIds) {
      const url = `/api/files/template/${templateId}/${taskId}/6`;
      preloadImage(url, () => {
        setScreenshots(prev => [...prev, url]);
      }); 
    }
  }, []);

  React.useEffect(()=>{
    formik.setFieldValue('screenshots', screenshots);
  }, [screenshots]);

  const fields = [
    {
      name: 'templateName',
      initialValue: template.templateName,
    },
    {
      name: 'marketplaceIcon',
      initialValue: `/api/files/template/${templateId}/logo/thumbnail.png`,
    },
    {
      name: 'locationType',
      initialValue: template.locationType,
    },
    {
      name: 'author',
      initialValue: template.author,
    },
    {
      name: 'shortDescription',
      initialValue: template.templateShortDescription,
    },
    {
      name: 'templateDescription',
      initialValue: template.templateDescription,
    },
    {
      name: 'abouttheAuthor',
      initialValue: template.abouttheAuthor,
    },
    {
      name: 'searchTags',
      initialValue: template.searchTags
    },
    {
      name: 'screenshots',
      initialValue: [],
    },
    {
      name: 'compliantHeader',
      initialValue: template.compliantHeader,
    },
    {
      name: 'defaultHeader',
      initialValue: template.defaultHeader,
    },
    {
      name: 'nonCompliantHeader',
      initialValue: template.nonCompliantHeader,
    },
    {
      name: 'eventCompletionText',
      initialValue: template.eventCompletetionText,
    },
    {
      name: 'eventNextScheduledforText',
      initialValue: template.eventNextScheduledforText,
    },
    {
      name: 'footer',
      initialValue: template.footer,

    },
    {
      name: 'smartDisplayCompliantImage',
      initialValue: `/api/files/template/${templateId}/smartDisplayCompliantImage/6`,
    },
    {
      name: 'smartDisplayNonCompliantImage',
      initialValue: `/api/files/template/${templateId}/smartDisplayNonCompliantImage/6`,
    },
    {
      name: 'smartDisplayDefaultImage',
      initialValue: `/api/files/template/${templateId}/smartDisplayDefaultImage/6`,
    },
    {
      name: 'virtualDisplayDefaultImage',
      initialValue: `/api/files/template/${templateId}/virtualDisplayDefaultImage/6`,
    },
    {
      name: 'virtualDisplayCompliantImage',
      initialValue: `/api/files/template/${templateId}/virtualDisplayCompliantImage/6`,
    },
    {
      name: 'virtualDisplayNonCompliantImage',
      initialValue: `/api/files/template/${templateId}/virtualDisplayNonCompliantImage/6`,
    },
  ];

  const handleOpenMarketplaceRef = (event) => {
    event.preventDefault();
    marketplaceIconRef.current.click();
  };
  
  const handleAddScreenshotRef = (event) => {
    event.preventDefault();
    screenshotImagesRef.current.click();
  };

  const handleOpensmartDisplayCompliantImageRef = (event) => {
    event.preventDefault();
    smartDisplayCompliantImageRef.current.click();
  };

  const handleOpensmartDisplayDefaultImageRef = (event) => {
    event.preventDefault();
    smartDisplayDefaultImageRef.current.click();
  };

  const handleOpensmartDisplayNonCompliantImageRef = (event) => {
    event.preventDefault();
    smartDisplayNonCompliantImageRef.current.click();
  };

  const handleOpenvirtualDisplayDefaultImageImageRef = (event) => {
    event.preventDefault();
    virtualDisplayDefaultImageImageRef.current.click();
  };

  const handleOpenvirtualDisplayCompliantImageImageRef = (event) => {
    event.preventDefault();
    virtualDisplayCompliantImageImageRef.current.click();
  };

  const handleOpenvirtualDisplayNonCompliantImageImageRef = (event) => {
    event.preventDefault();
    virtualDisplayNonCompliantImageImageRef.current.click();
  };

  const handleTextChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    formik.setFieldValue(name, value);
    setInputChanged(true);
  };

  const handleTextChangeWithoutSave = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    formik.setFieldValue(name, value);
  };

  const handleSearchTags = (tags = []) => {
    formik.setFieldValue('searchTags', tags.join(', '));
  };

  
  const uploadImage = async (file, templateId, taskId, intendedFileName) => {
    // screenshotsRef.current.value = null;
    const values = await toBase64Array([file]);
    const images = values.reduce((acc, cur) => {
      acc.push({ ...cur.value, imageName: `image_${Date.now()}.${cur?.value?.extension}` });
      return acc;
    }, []);
    const insertImages = [];
    images.forEach((img) => {
      const imgContent = `data:image/${img.extension};base64,${img.content}`;
      const imgTempContent = `data:image/${img.extension};base64,${img.tempContent}`;
      insertImages.push({
        name: img.imageName,
        originUrl: imgContent,
        url: imgTempContent,
        inProgress: true
      });
    });
    await uploadTemplateImages(images, templateId, taskId, intendedFileName);
  };

  const removeImage = async (name, taskId) => {
    if (formik.values[name]) {
      formik.setFieldValue(name, null);
      await deleteTemplateImage(templateId, taskId);
    }
  };

  const handleUploadImage = (name, taskId, intendedFileName) => async (event) => {
    event.preventDefault();
    const { files } = event.target;
    if (files.length === 0) {
      return;
    }
    
    formik.setFieldValue(name, URL.createObjectURL(files[0]));
    await uploadImage(files[0], templateId, taskId, intendedFileName);
  };

  const handleAddScreenshotImage = async (event) => {
    event.preventDefault();
    const { files } = event.target;
    const notUsedTaskIds = screenshotTaskIds;
    for (const screenshot of formik.values.screenshots) {
      for (var i = 0; i < notUsedTaskIds.length; i++) {
        if (screenshot.includes(notUsedTaskIds[i])) {
          notUsedTaskIds.splice(i, 1);
        }
      }
    }
    if (notUsedTaskIds.length > 0) {
      const taskId = notUsedTaskIds[0];
      formik.setFieldValue('screenshots', [...formik.values.screenshots, URL.createObjectURL(files[0])]);
      await uploadImage(files[0], templateId, taskId, 'screenshot');
    }
  };

  const handleRemoveScreenshotImage = async (index) => {
    const screenshot = formik.values.screenshots[index];
    let taskId = null;
    for (const tId of screenshotTaskIds) {
      if (screenshot.includes(tId)) {taskId = tId;}
    }
    formik.values.screenshots.splice(index, 1);
    formik.setFieldValue('screenshots', formik.values.screenshots);
    if (taskId) {
      await deleteTemplateImage(templateId, taskId, 'screenshot.png');
    }
  };

  const handleSubmit = async () => {
    const {
      templateName,
      shortDescription,
      templateDescription,
      author,
      abouttheAuthor,
      footer,
      compliantHeader,
      defaultHeader,
      nonCompliantHeader,
      eventCompletionText,
      eventNextScheduledforText,
      searchTags,
    } = formik.values;
    try {
      const data = {
        templateId,
        templateName,
        status,
        shortDescription,
        templateDescription,
        author,
        abouttheAuthor,
        footer,
        compliantHeader,
        defaultHeader,
        nonCompliantHeader,
        eventCompletionText,
        eventNextScheduledforText,
        searchTags
      };
      setIsTitleEdit(false);
      await _postObject('v1/confidence/reference/template', data);
      getTemplates({'templateType':'Reference'});
    } catch (error) {
      history.push(URLS.PAGE_400);
    }
  };

  const formik = useForm({ fields, onSubmit: handleSubmit });

  const debouncedValues = useDebounce(formik.values, 3000);

  React.useEffect(() => {
    if (inputChanged) {
      handleSubmit();
      setInputChanged(false);
    }
  },[debouncedValues]);

  return (
    <>
      <div className="row pt-4">
        <div className="d-flex col-12 px-0">
          <button className="position-absolute m-2 py-1 px-2 rounded bg-primary border border-white text-white" onClick={handleOpenMarketplaceRef}>
            <i className="far fa-pencil-alt" aria-hidden="true"></i> <span className="sr-only">Edit Image</span>
          </button>
          <input
            type="file"
            accept="image/png"
            capture="user"
            style={{ display: 'none' }}
            ref={marketplaceIconRef}
            onChange={handleUploadImage('marketplaceIcon', 'logo', 'thumbnail')}
            data-target="file-input"
          />
          <img
            className="rounded border mr-2" 
            src={formik.values.marketplaceIcon ? formik.values.marketplaceIcon : '/assets/img/placeholder-square.png'} 
            width="185" 
            height="185"
          />
          <div className="pl-2 w-100">
            <div className="mb-2">
              {!isTitleEdit 
                ? <h2 className="template-detail-text" onClick={()=>setIsTitleEdit(true)}>
                  {formik.values.templateName} <Link className="small template-task-number" to={URLS.TEMPLATE_TASKS(templateId)}><Trans>{taskCount ? `${taskCount} Tasks` : '0 Tasks'}</Trans></Link>
                </h2>
                : <div className="template-detail-edit">
                  <Input
                    classes={classes.lgInput}
                    name='templateName'
                    formik={formik}
                    maxLength="150"
                  />
                  <div className="buttons text-right mt-2">
                    <button className="btn btn-sm btn-outline-secondary discard mr-1" onClick={()=>setIsTitleEdit(false)}>  Discard </button>
                    <button className="btn btn-sm btn-primary text-white save" onClick={handleSubmit} > Save </button>
                  </div>
                </div>}
            </div>
            <div className="mb-3">
              <label className="d-block text-secondary mb-1">Business Type</label>
              <p className="p-2 rounded d-inline-block border bg-light mb-2">{formik.values.locationType || 'None'} <small className="font-italic text-secondary">Business type cannot be edited.</small></p>
            </div>
          </div>
        </div>
        <div className="col-12 px-0 mt-3">
          <div className="mb-3">
            <label className="mb-1 d-block text-secondary">Short Description</label>
            <EnhancedInput
              name="shortDescription"
              maxLength="150"
              formik={formik}
              onSave={handleSubmit}
            />
          </div>
          <div className="mb-3">
            <label className="d-block mb-1 text-secondary">Information about the template</label>
            {!isTemplateInfoEdit 
              ? <p className="template-detail-text mb-0 d-inline-block rounded border bg-light p-2" onClick={()=>setIsTemplateInfoEdit(true)}>
                {formik.values.templateDescription}
              </p>
              : <div className="template-detail-edit">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter information about the template"
                  name="templateDescription"
                  onChange={handleTextChangeWithoutSave}
                  maxLength={3000}
                >
                  {formik.values.templateDescription}
                </textarea>
                <div className="d-flex">
                  <div className={`${formik.values.templateDescription.length === 3000 ? 'text-danger' : 'text-secondary'} small pt-1`}>
                    <span>{formik.values.templateDescription.length}</span>/{3000}
                  </div>
                  <div className="w-100 buttons text-right mt-2">
                    <button className="btn btn-sm btn-outline-secondary discard mr-1" onClick={()=>setIsTemplateInfoEdit(false)}>Discard</button>
                    <button className="btn btn-sm btn-primary text-white save" onClick={handleSubmit}>Save</button>
                  </div>
                </div>
              </div>}
          </div>
          <div className="mb-3">
            <label className="d-block mb-1 text-secondary">Author</label>
            <EnhancedInput
              name="author"
              classes={classes.input}
              maxLength="100"
              formik={formik}
              onSave={handleSubmit}
            />
          </div>
          <div className="mb-3">
            <label className="mb-1 d-block text-secondary">Information about the author</label>
            {!isAuthorInfoEdit 
              ? <p className="template-detail-text mb-0 d-inline-block rounded border bg-light p-2" onClick={()=>setIsAuthorInfoEdit(true)}>
                {formik.values.abouttheAuthor}
              </p>
              : <div className="template-detail-edit">
                <textarea
                  name="abouttheAuthor"
                  className="form-control"
                  rows="3"
                  placeholder="Enter information about the author"
                  onChange={handleTextChangeWithoutSave}
                  maxLength={3000}
                >
                  {formik.values.abouttheAuthor}
                </textarea>
                <div style={{ textAlign: 'right' }}>
                  <span>{3000 - formik.values.abouttheAuthor.length}</span>
                </div>
                <div className="buttons text-right mt-2">
                  <button className="btn btn-sm btn-outline-secondary discard mr-1" onClick={()=>setIsAuthorInfoEdit(false)}>Discard</button>
                  <button className="btn btn-sm btn-primary text-white save" onClick={handleSubmit}>Save</button>
                </div>
              </div>}
          </div>
          <div className="mb-3">
            <SearchTags
              formik={formik}
              name="searchTags"
              onChange={handleSearchTags}
              onSave={handleSubmit}
            />
          </div>
          <div>
            <label className="text-secondary">App Screenshots</label>
            <div className="d-flex">
              {formik.values.screenshots.map((screenshot, index)=>(
                <div key={index.toString()} className="template-app-screenshot border-primary border rounded mr-3 overflow-hidden">
                  <button className="btn btn-sm btn-danger border-white ml-2 mt-2 position-absolute" onClick={()=>handleRemoveScreenshotImage(index)}>
                    <i className="far fa-trash-alt"></i>
                    <span className="sr-only">Delete</span>
                  </button>
                  <img src={screenshot}/>
                </div>
              ))}
              {formik.values.screenshots.length < 5 && <a href="#" className="template-app-screenshot btn btn-outline-primary px-5 d-flex align-items-center" onClick={handleAddScreenshotRef}>
                <i className="far fa-lg fa-plus"></i>
              </a>}
              <input
                type="file"
                accept="image/png"
                capture="user"
                style={{ display: 'none' }}
                ref={screenshotImagesRef}
                name="screenshots"
                onChange={handleAddScreenshotImage}
                data-target="file-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5 pt-4 border-top">
        <div className="col-12 px-0">
          <h2>Badge of Confidence</h2>
          <div className="clearfix">
            <div className="text-center p-0 float-left badge-configuration-container badge-configuration-container-small mr-5 mt-4">
              <h4 className="mb-3">Default</h4>
              <div className="badge-inline-form border shadow mx-auto">
                <div className="bg-black py-2 px-3">
                  <Input
                    classes={classes.compliantHeader}
                    name="defaultHeader"
                    formik={formik}
                    maxLength="15"
                    placeholder="Header Text"
                    value={formik.values.defaultHeader}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="badge-image-preview mt-4">
                  <div className="position-absolute d-flex justify-content-center text-center mt-4">
                    {
                      formik.values.virtualDisplayDefaultImage
                        ? <div className="uploaded bg-white rounded mr-3 align-self-center">
                          PNG
                          <a className="edit text-primary ml-2" onClick={handleOpenvirtualDisplayDefaultImageImageRef}>
                            <i className="far fa-pencil-alt" aria-hidden="true"></i>
                            <span className="sr-only">Edit</span>
                          </a>
                          <a className="edit text-danger ml-2" onClick={()=>removeImage('virtualDisplayDefaultImage', 'virtualDisplayDefaultImage', 'badge.png')}>
                            <i className="far fa-trash-alt" aria-hidden="true"></i>
                            <span className="sr-only">Delete</span>
                          </a>
                        </div>
                        :<button type="button" className="btn btn-primary mr-3 align-self-center" onClick={handleOpenvirtualDisplayDefaultImageImageRef}>Upload PNG</button>
                    }
                    {
                      formik.values.smartDisplayDefaultImage
                        ? <div className="uploaded bg-white rounded align-self-center">
                          BMP
                          <a className="edit text-primary ml-2" onClick={handleOpensmartDisplayDefaultImageRef}>
                            <i className="far fa-pencil-alt" aria-hidden="true"></i>
                            <span className="sr-only">Edit</span>
                          </a>
                          <a className="edit text-danger ml-2" onClick={()=>removeImage('smartDisplayDefaultImage', 'smartDisplayDefaultImage', 'badge.bmp')}>
                            <i className="far fa-trash-alt" aria-hidden="true"></i>
                            <span className="sr-only">Delete</span>
                          </a>
                        </div>
                        :<button type="button" className="btn btn-primary mr-3 align-self-center" onClick={handleOpensmartDisplayDefaultImageRef}>Upload BMP</button>
                    }
                  </div>
                  <img
                    className="badge-image"
                    src={formik.values.virtualDisplayDefaultImage || '../assets/img/badge-template-large.png'}
                    onError={(e)=>{e.target.onerror = null; e.target.src='../assets/img/badge-template-large.png';}}
                  />
                  <input
                    type="file"
                    accept="image/png"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={virtualDisplayDefaultImageImageRef}
                    name='virtualDisplayDefaultImage'
                    onChange={handleUploadImage('virtualDisplayDefaultImage', 'virtualDisplayDefaultImage', 'badge')}
                    data-target="file-input"
                  />
                  <input
                    type="file"
                    accept="image/bmp"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={smartDisplayDefaultImageRef}
                    name='smartDisplayDefaultImage'
                    onChange={handleUploadImage('smartDisplayDefaultImage', 'smartDisplayDefaultImage', 'badge')}
                    data-target="file-input"
                  />
                </div>
                <div className="my-3 px-3">
                  <Input
                    classes={classes.eventCompletionTextInput}
                    name="eventCompletionText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Completed On Text')}
                    value={formik.values.eventCompletionText}
                    onChange={handleTextChange}
                  />
                  <h3 className="fade-25">12/08/2020 @ 10:45AM PT</h3>
                  <Input
                    classes={classes.eventNextScheduledforTextInput}
                    name="eventNextScheduledforText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Next Scheduled For Text')}
                    value={formik.values.eventNextScheduledforText}
                    onChange={handleTextChange}
                  />
                  <p className="fade-25">12/09/2020 @ 10:45AM PT</p>
                </div>
                <div className="bg-black p-3 text-white">
                  <textarea
                    rows="3"
                    maxLength="165"
                    placeholder="Footer Text"
                    name="footer"
                    className="mb-2 w-100 rounded text-center bg-black text-white badge-footer-text p-0"
                    onChange={handleTextChange}
                    value={formik.values.footer}
                  >
                  </textarea>
                  <h4 className="fade-50 mb-0">Confidence #: 11111</h4>
                </div>
              </div>
            </div>
            <div className="text-center p-0 float-left badge-configuration-container badge-configuration-container-small mr-5 mt-4">
              <h4 className="mb-3">Compliant</h4>
              <div className="badge-inline-form border shadow mx-auto">
                <div className="bg-black py-2 px-3">
                  <Input
                    classes={classes.compliantHeader}
                    name="compliantHeader"
                    formik={formik}
                    maxLength="15"
                    placeholder="Header Text"
                    value={formik.values.compliantHeader}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="badge-image-preview mt-4">
                  <div className="position-absolute d-flex justify-content-center text-center mt-4">
                    {
                      formik.values.virtualDisplayCompliantImage
                        ? <div className="uploaded bg-white rounded mr-3 align-self-center">
                          PNG
                          <a className="edit text-primary ml-2" onClick={handleOpenvirtualDisplayCompliantImageImageRef}>
                            <i className="far fa-pencil-alt" aria-hidden="true"></i>
                            <span className="sr-only">Edit</span>
                          </a>
                          <a className="edit text-danger ml-2" onClick={()=>removeImage('virtualDisplayCompliantImage', 'virtualDisplayCompliantImage', 'badge.png')}>
                            <i className="far fa-trash-alt" aria-hidden="true"></i>
                            <span className="sr-only">Delete</span>
                          </a>
                        </div>
                        :<button type="button" className="btn btn-primary mr-3 align-self-center" onClick={handleOpenvirtualDisplayCompliantImageImageRef}>Upload PNG</button>
                    }
                    {
                      formik.values.smartDisplayCompliantImage
                        ? <div className="uploaded bg-white rounded align-self-center">
                          BMP
                          <a className="edit text-primary ml-2" onClick={handleOpensmartDisplayCompliantImageRef}>
                            <i className="far fa-pencil-alt" aria-hidden="true"></i>
                            <span className="sr-only">Edit</span>
                          </a>
                          <a className="edit text-danger ml-2" onClick={()=>removeImage('smartDisplayCompliantImage', 'smartDisplayCompliantImage', 'badge.bmp')}>
                            <i className="far fa-trash-alt" aria-hidden="true"></i>
                            <span className="sr-only">Delete</span>
                          </a>
                        </div>
                        :<button type="button" className="btn btn-primary mr-3 align-self-center" onClick={handleOpensmartDisplayCompliantImageRef}>Upload BMP</button>
                    }
                  </div>
                  <img src="../assets/img/badge-template-check.png" className="badge-icon position-absolute"/>
                  <img
                    className="badge-image"
                    src={formik.values.virtualDisplayCompliantImage || '../assets/img/badge-template-large.png'}
                    onError={(e)=>{e.target.onerror = null; e.target.src='../assets/img/badge-template-large.png';}} 
                  />
                  <input
                    type="file"
                    accept="image/png"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={virtualDisplayCompliantImageImageRef}
                    name='virtualDisplayCompliantImage'
                    onChange={handleUploadImage('virtualDisplayCompliantImage', 'virtualDisplayCompliantImage', 'badge')}
                    data-target="file-input"
                  />
                  <input
                    type="file"
                    accept="image/bmp"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={smartDisplayCompliantImageRef}
                    name='smartDisplayCompliantImage'
                    onChange={handleUploadImage('smartDisplayCompliantImage', 'smartDisplayCompliantImage', 'badge')}
                    data-target="file-input"
                  />
                </div>
                <div className="my-3 px-3">
                  <Input
                    classes={classes.eventCompletionTextInput}
                    name="eventCompletionText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Completed On Text')}
                    value={formik.values.eventCompletionText}
                    onChange={handleTextChange}
                  />
                  <h3 className="fade-25">12/08/2020 @ 10:45AM PT</h3>
                  <Input
                    classes={classes.eventNextScheduledforTextInput}
                    name="eventNextScheduledforText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Next Scheduled For Text')}
                    value={formik.values.eventNextScheduledforText}
                    onChange={handleTextChange}
                  />
                  <p className="fade-25">12/09/2020 @ 10:45AM PT</p>
                </div>
                <div className="bg-black p-3 text-white">
                  <textarea 
                    rows="3"
                    maxLength="165" 
                    placeholder="Footer Text" 
                    name="footer"
                    className="mb-2 w-100 rounded text-center bg-black text-white badge-footer-text p-0"
                    onChange={handleTextChange}
                    value={formik.values.footer}
                  >
                  </textarea>
                  <h4 className="fade-50 mb-0">Confidence #: 11111</h4>
                </div>
              </div>
            </div>
            <div className="text-center p-0 float-left badge-configuration-container badge-configuration-container-small mt-4">
              <h4 className="mb-3">Non-Compliant</h4>
              <div className="badge-inline-form border shadow mx-auto">
                <div className="bg-black py-2 px-3 text-white text-uppercase">
                  <Input
                    classes={classes.compliantHeader}
                    name="nonCompliantHeader"
                    formik={formik}
                    maxLength="15"
                    placeholder="Header Text"
                    value={formik.values.nonCompliantHeader}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="badge-image-preview mt-4">
                  <div className="position-absolute d-flex justify-content-center text-center mt-4">
                    {
                      formik.values.virtualDisplayNonCompliantImage 
                        ? <div className="uploaded bg-white rounded mr-3 align-self-center">
                          PNG
                          <a className="edit text-primary ml-2" onClick={handleOpenvirtualDisplayNonCompliantImageImageRef}>
                            <i className="far fa-pencil-alt" aria-hidden="true"></i> 
                            <span className="sr-only">Edit</span>
                          </a>
                          <a className="edit text-danger ml-2" onClick={()=>removeImage('virtualDisplayNonCompliantImage', 'virtualDisplayNonCompliantImage', 'badge.png')}>
                            <i className="far fa-trash-alt" aria-hidden="true"></i> 
                            <span className="sr-only">Delete</span>
                          </a>
                        </div>
                        : <button type="button" className="btn btn-primary mr-3 align-self-center" onClick={handleOpenvirtualDisplayNonCompliantImageImageRef}>Upload PNG</button>
                    }
                    {
                      formik.values.smartDisplayNonCompliantImage 
                        ? <div className="uploaded bg-white rounded mr-3 align-self-center">
                          BMP
                          <a className="edit text-primary ml-2" onClick={handleOpensmartDisplayNonCompliantImageRef}>
                            <i className="far fa-pencil-alt" aria-hidden="true"></i> 
                            <span className="sr-only">Edit</span>
                          </a>
                          <a className="edit text-danger ml-2" onClick={()=>removeImage('smartDisplayNonCompliantImage', 'smartDisplayNonCompliantImage', 'badge.bmp')}>
                            <i className="far fa-trash-alt" aria-hidden="true"></i> 
                            <span className="sr-only">Delete</span>
                          </a>
                        </div>
                        : <button type="button" className="btn btn-primary mr-3 align-self-center" onClick={handleOpensmartDisplayNonCompliantImageRef}>Upload BMP</button>
                    }
                  </div>
                  <img src="../assets/img/badge-template-x.png" className="badge-icon position-absolute"/>
                  <img
                    className="badge-image"
                    src={formik.values.virtualDisplayNonCompliantImage || '../assets/img/badge-template-large.png'}
                    onError={(e)=>{e.target.onerror = null; e.target.src='../assets/img/badge-template-large.png';}} 
                  />

                  <input
                    type="file"
                    accept="image/png"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={virtualDisplayNonCompliantImageImageRef}
                    name='virtualDisplayNonCompliantImage'
                    onChange={handleUploadImage('virtualDisplayNonCompliantImage', 'virtualDisplayNonCompliantImage', 'badge')}
                    data-target="file-input"
                  />
                  <input
                    type="file"
                    accept="image/bmp"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={smartDisplayNonCompliantImageRef}
                    name='smartDisplayNonCompliantImage'
                    onChange={handleUploadImage('smartDisplayNonCompliantImage', 'smartDisplayNonCompliantImage', 'badge')}
                    data-target="file-input"
                  />
                </div>
                <div className="my-3 px-3">
                  <Input
                    classes={classes.eventCompletionTextInput}
                    name="eventCompletionText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Completed On Text')}
                    value={formik.values.eventCompletionText}
                    onChange={handleTextChange}
                  />
                  <h3 className="fade-25">12/08/2020 @ 10:45AM PT</h3>
                  <Input
                    classes={classes.eventNextScheduledforTextInput}
                    name="eventNextScheduledforText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Next Scheduled For Text')}
                    value={formik.values.eventNextScheduledforText}
                    onChange={handleTextChange}
                  />
                  <p className="fade-25">12/09/2020 @ 10:45AM PT</p>
                </div>
                <div className="bg-black p-3 text-white">
                  <textarea 
                    rows="3"
                    maxLength="165" 
                    placeholder="Footer Text" 
                    name="footer"
                    className="mb-2 w-100 rounded text-center bg-black text-white badge-footer-text p-0"
                    onChange={handleTextChange}
                    value={formik.values.footer}
                  >
                  </textarea>
                  <h4 className="fade-50 mb-0">Confidence #: 11111</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
Form.propTypes = {
  template: PropTypes.object,
  getTemplates: PropTypes.func,
  taskCount: PropTypes.string,
  status: PropTypes.bool,
};
Form.displayName = 'TemplateDetailsForm';

export default Form;
