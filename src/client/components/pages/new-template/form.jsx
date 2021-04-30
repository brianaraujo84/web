import React from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input, Select, ErrorMessage } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import { _postObject } from '../../../services/services';
import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { toBase64Array } from '../../../utils';
import { uploadTemplateTaskImages } from '../../../redux/actions/files';
import { locationTypes } from '../../../constants';

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

const Form = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const marketplaceIconRef = React.useRef(null);
  const screenshotImagesRef = React.useRef(null);
  const smartDisplayCompliantImageRef = React.useRef(null);
  const smartDisplayDefaultImageRef = React.useRef(null);
  const smartDisplayNonCompliantImageRef = React.useRef(null);
  const virtualDisplayCompliantImageImageRef = React.useRef(null);
  const virtualDisplayNonCompliantImageImageRef = React.useRef(null);
  const virtualDisplayDefaultImageImageRef = React.useRef(null);
  const [showBadgeImageText, setShowBadgeImageText] = React.useState(true);
  const [showBadgeImageCompliantText, setShowBadgeImageCompliantText] = React.useState(true);
  const [showBadgeImageNonCompliantText, setShowBadgeImageNonCompliantText] = React.useState(true);

  const uploadTemplateImages = useActionDispatch(uploadTemplateTaskImages);

  const fields = [
    {
      name: 'templateName',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'marketplaceIcon',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'locationType',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'author',
    },
    {
      name: 'compliantHeader',
      validations: [
        { rule: 'required' },
      ],
      initialValue: 'Compliant'
    },
    {
      name: 'nonCompliantHeader',
      validations: [
        { rule: 'required' },
      ],
      initialValue: 'Non-Compliant'
    },
    {
      name: 'defaultHeader',
      validations: [
        { rule: 'required' },
      ],
      initialValue: 'Ready'
    },
    {
      name: 'eventCompletionText',
      validations: [
        { rule: 'required' },
      ],
      initialValue: 'Completed on'
    },
    {
      name: 'eventNextScheduledforText',
      validations: [
        { rule: 'required' },
      ],
      initialValue: 'Next event scheduled'
    },
    {
      name: 'footer',
      validations: [
        { rule: 'required' },
      ],
      initialValue: 'Enter information about this badge here.'
    },
    {
      name: 'shortDescription',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'templateDescription',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'abouttheAuthor',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'searchTag1',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'searchTag2',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'searchTag3',
      validations: [
        { rule: 'required' },
      ],
    },
    {
      name: 'screenshots',
      initialValue: [],
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

  const handleOpenvirtualDisplayCompliantImageImageRef = (event) => {
    event.preventDefault();
    virtualDisplayCompliantImageImageRef.current.click();
  };

  const handleOpenvirtualDisplayDefaultImageImageRef = (event) => {
    event.preventDefault();
    virtualDisplayDefaultImageImageRef.current.click();

  };

  const handleOpenvirtualDisplayNonCompliantImageImageRef = (event) => {
    event.preventDefault();
    virtualDisplayNonCompliantImageImageRef.current.click();
  };

  const handleRemoveScreenshot = (index) => {
    formik.values.screenshots.splice(index, 1);
    formik.setFieldValue('screenshots', formik.values.screenshots);
  };

  const handleImageChange = async (event) => {
    event.preventDefault();
    const { name, files } = event.target;
    if(name === 'virtualDisplayDefaultImage'){
      setShowBadgeImageText(false);
    }
    if(name === 'virtualDisplayNonCompliantImage'){
      setShowBadgeImageNonCompliantText(false);
    }

    if(name === 'virtualDisplayCompliantImage'){
      setShowBadgeImageCompliantText(false);
    }

    if (name !== 'screenshots') {
      formik.setFieldValue(name, files[0]);
    } else {
      formik.setFieldValue(name, [...formik.values[name], files[0]]);
    }
  };

  const removeImage = (name) => {
    if (formik.values[name]) {
      formik.setFieldValue(name, null);
    }
    if(name === 'virtualDisplayDefaultImage'){
      setShowBadgeImageText(true);
    }
    if(name === 'virtualDisplayNonCompliantImage'){
      setShowBadgeImageNonCompliantText(true);
    }

    if(name === 'virtualDisplayCompliantImage'){
      setShowBadgeImageCompliantText(true);
    }

  };

  const handleTextChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    formik.setFieldValue(name, value);
  };

  const handleChangeLocationType = (event) => {
    formik.setFieldValue('locationType', event.target.value);
  };

  
  const handleUploadImage = async (file, templateId, taskId, intendedFileName) => {
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

  const handleSubmit = async (values) => {
    const {
      templateName,
      locationType,
      shortDescription,
      templateDescription,
      abouttheAuthor,
      searchTag1,
      searchTag2,
      searchTag3,
      footer,
      compliantHeader,
      defaultHeader,
      nonCompliantHeader,
      eventCompletionText,
      eventNextScheduledforText,
      author,
      marketplaceIcon,
      screenshots,
      smartDisplayCompliantImage,
      virtualDisplayCompliantImage,
      smartDisplayNonCompliantImage,
      virtualDisplayNonCompliantImage,
      smartDisplayDefaultImage,
      virtualDisplayDefaultImage,
    } = values;

    try {
      const data = {
        templateName,
        status: false,
        shortDescription,
        locationType,
        templateDescription,
        author,
        abouttheAuthor,
        searchTags: [searchTag1, searchTag2, searchTag3].join(', '),
        footer,
        compliantHeader,
        defaultHeader,
        nonCompliantHeader,
        eventCompletionText,
        eventNextScheduledforText
      };
      const response = await _postObject('v1/confidence/reference/template', data);
      const {templateId} = response;

      if (templateId) {
        if (marketplaceIcon) {
          await handleUploadImage(marketplaceIcon, templateId, 'logo', 'thumbnail');
        }
        const screenshotTaskIds = ['screenshotOne', 'screenshotTwo', 'screenshotThree', 'screenshotFour', 'screenshotFive'];
        screenshots.forEach(async (screenshot, index) => {
          await handleUploadImage(screenshot, templateId, screenshotTaskIds[index], 'screenshot');
        });
        if (smartDisplayCompliantImage) {
          await handleUploadImage(smartDisplayCompliantImage, templateId, 'smartDisplayCompliantImage', 'badge');
        }
        if (virtualDisplayCompliantImage) {
          await handleUploadImage(virtualDisplayCompliantImage, templateId, 'virtualDisplayCompliantImage', 'badge');
        }
        if (smartDisplayNonCompliantImage) {
          await handleUploadImage(smartDisplayNonCompliantImage, templateId, 'smartDisplayNonCompliantImage', 'badge');
        }
        if (virtualDisplayNonCompliantImage) {
          await handleUploadImage(virtualDisplayNonCompliantImage, templateId, 'virtualDisplayNonCompliantImage', 'badge');
        }
        if (smartDisplayDefaultImage) {
          await handleUploadImage(smartDisplayDefaultImage, templateId, 'smartDisplayDefaultImage', 'badge');
        }
        if (virtualDisplayDefaultImage) {
          await handleUploadImage(virtualDisplayDefaultImage, templateId, 'virtualDisplayDefaultImage', 'badge');
        }

      }
      history.push(URLS.TEMPLATES);
    } catch (error) {
      history.push(URLS.PAGE_400);
    }
  };

  const formik = useForm({ fields, onSubmit: handleSubmit });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="d-flex">
          <div className="pl-2">
            <h1>Create New Template</h1>
          </div>
        </div>
      </div>
      <div className="row pt-4">
        <div className="d-flex col-12 px-0">
          <div>
            <button className="position-absolute m-2 py-1 px-2 rounded bg-primary border border-white text-white" onClick={handleOpenMarketplaceRef}>
              <i className="far fa-pencil-alt" aria-hidden="true"></i> <span className="sr-only">Edit Image</span>
            </button>
            <input
              type="file"
              accept="image/png"
              capture="user"
              style={{ display: 'none' }}
              ref={marketplaceIconRef}
              name="marketplaceIcon"
              onChange={handleImageChange}
              data-target="file-input"
            />
            <img
              className="rounded border mr-2"
              src={formik.values.marketplaceIcon ? URL.createObjectURL(formik.values.marketplaceIcon) : '/assets/img/placeholder-square.png'}
              width="185"
              height="185"
            />
            <ErrorMessage
              formik={formik}
              name="marketplaceIcon"
              className="validation-error-message"
            />
          </div>
          <div className="pl-2 w-100">
            <div className="mb-2">
              <label className="sr-only small text-secondary"><Trans>Template Name</Trans></label>
              <Input
                classes={classes.lgInput}
                name="templateName"
                maxLength="150"
                formik={formik}
                placeholder={t('Template Name')}
              />
            </div>
            <div className="mb-2">
              <label className="sr-only small text-secondary"><Trans>Business Type</Trans></label>
              <Select
                name="locationType"
                placeholder={t('Business Type')}
                options={Object.values(locationTypes).map((locationType) => ({
                  value: locationType,
                  label: locationType,
                }))}
                classes={{ select: 'form-control' }}
                formik={formik}
                showError={false}
                onChange={handleChangeLocationType}
                data-target="select-location-zone"
              />
              <ErrorMessage
                formik={formik}
                name="locationType"
                className="validation-error-message"
              />
            </div>
          </div>
        </div>
        <div className="col-12 px-0 mt-3">
          <div className="mb-2">
            <label className="sr-only small text-secondary">Short Description</label>
            <Input
              classes={classes.input}
              name="shortDescription"
              formik={formik}
              placeholder={t('Short Description')}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              name="templateDescription"
              rows="3"
              placeholder={t('Enter information about the template')}
              onChange={handleTextChange}
              value={formik.values.templateDescription}
            ></textarea>
            <ErrorMessage
              formik={formik}
              name="templateDescription"
              className="validation-error-message"
            />
          </div>
          <div className="mb-3">
            <label className="sr-only small text-secondary">Author</label>
            <Input
              classes={classes.input}
              name="author"
              formik={formik}
              placeholder={t('Author')}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              name="abouttheAuthor"
              rows="3"
              placeholder={t('Enter Information about the author')}
              onChange={handleTextChange}
              value={formik.values.abouttheAuthor}
            ></textarea>
            <ErrorMessage
              formik={formik}
              name="abouttheAuthor"
              className="validation-error-message"
            />
          </div>
          <div className="mb-3">
            <label className="text-secondary">Search tags</label>
            <div className="row">
              <div className="col pr-0">
                <Input
                  classes={classes.input}
                  name="searchTag1"
                  formik={formik}
                  placeholder={t('Tag 1')}
                />
              </div>
              <div className="col">
                <Input
                  classes={classes.input}
                  name="searchTag2"
                  formik={formik}
                  placeholder={t('Tag 2')}
                />
              </div>
              <div className="col pl-0">
                <Input
                  classes={classes.input}
                  name="searchTag3"
                  formik={formik}
                  placeholder={t('Tag 3')}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-secondary">App Screenshots</label>
            <div className="d-flex">
              {formik.values.screenshots.map((screenshot, index) => (
                <div key={index.toString()} className="template-app-screenshot border-primary border rounded mr-3 overflow-hidden">
                  <button type="button" className="btn btn-sm btn-danger border-white ml-2 mt-2 position-absolute" onClick={()=>handleRemoveScreenshot(index)}>
                    <i className="far fa-trash-alt"></i>
                    <span className="sr-only">Delete</span>
                  </button>
                  <img src={URL.createObjectURL(screenshot)}/>
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
                onChange={handleImageChange}
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
            <div className="text-center p-0 float-left badge-configuration-container mr-5 mt-4">
              <h4 className="mb-3">Default</h4>
              <div className="badge-inline-form border shadow mx-auto">
                <div className="bg-black py-4 px-3">
                  <Input
                    classes={classes.compliantHeader}
                    name="defaultHeader"
                    formik={formik}
                    maxLength="15"
                    placeholder={t('Header Text')}
                    value={formik.values.defaultHeader}
                  />
                </div>
                <div className="badge-image-preview mt-5">

                  <div className="position-absolute d-flex justify-content-center text-center mt-4">
                    <div className="mt-3">
                      {showBadgeImageText && <h4 className="text-white mb-3" >Add your badge image</h4>}
                      {
                        formik.values.virtualDisplayDefaultImage
                          ? <div className="uploaded btn btn-primary mr-3 align-self-center">
                            PNG
                            <a className="edit text-primary ml-2" onClick={handleOpenvirtualDisplayDefaultImageImageRef}>
                              <i className="far fa-pencil-alt" aria-hidden="true"></i>
                              <span className="sr-only">Edit</span>
                            </a>
                            <a className="edit text-danger ml-2" onClick={()=>removeImage('virtualDisplayDefaultImage')}>
                              <i className="far fa-trash-alt" aria-hidden="true"></i>
                              <span className="sr-only">Delete</span>
                            </a>
                          </div>
                          : <button type="button" className="btn btn-primary mr-3 mb-3 align-self-center" onClick={handleOpenvirtualDisplayDefaultImageImageRef}>Upload PNG</button>
                      }
                      {
                        formik.values.smartDisplayDefaultImage
                          ? <div className="uploaded btn btn-primary mr-3 align-self-center">
                            BMP
                            <a className="edit text-primary ml-2" onClick={handleOpensmartDisplayDefaultImageRef}>
                              <i className="far fa-pencil-alt" aria-hidden="true"></i>
                              <span className="sr-only">Edit</span>
                            </a>
                            <a className="edit text-danger ml-2" onClick={()=>removeImage('smartDisplayDefaultImage')}>
                              <i className="far fa-trash-alt" aria-hidden="true"></i>
                              <span className="sr-only">Delete</span>
                            </a>
                          </div>
                          : <button type="button" className="btn btn-primary mb-3 mr-3 align-self-center" onClick={handleOpensmartDisplayDefaultImageRef}>Upload BMP</button>
                      }
                      {showBadgeImageText && <p className="text-white small">At least 520×520px in PNG format. Must have<br/> transparent background and only white content.</p>}
                    </div>
                  </div>

                  <img src={formik.values.virtualDisplayDefaultImage ? URL.createObjectURL(formik.values.virtualDisplayDefaultImage) : '../assets/img/badge-template-large.png'} className="badge-image"/>
                  <input
                    type="file"
                    accept="image/png"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={virtualDisplayDefaultImageImageRef}
                    name='virtualDisplayDefaultImage'
                    onChange={handleImageChange}
                    data-target="file-input"
                  />
                  <input
                    type="file"
                    accept="image/bmp"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={smartDisplayDefaultImageRef}
                    name='smartDisplayDefaultImage'
                    onChange={handleImageChange}
                    data-target="file-input"
                  />
                </div>
                <div className="my-4 px-3">
                  <Input
                    classes={classes.eventCompletionTextInput}
                    name="eventCompletionText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Completed On Text')}
                    initialValue={t('Completed on')}
                    value={formik.values.eventCompletionText}
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
                  <ErrorMessage
                    formik={formik}
                    name="deafultFooter"
                    className="validation-error-message"
                  />
                  <h4 className="fade-50 mb-0">Confidence #: 11111</h4>
                </div>
              </div>
            </div>
            <div className="text-center p-0 float-left badge-configuration-container mr-5 mt-4">
              <h4 className="mb-3">Compliant</h4>
              <div className="badge-inline-form border shadow mx-auto">
                <div className="bg-black py-4 px-3">
                  <Input
                    classes={classes.compliantHeader}
                    name="compliantHeader"
                    formik={formik}
                    maxLength="15"
                    placeholder={t('Header Text')}
                    value={formik.values.compliantHeader}
                  />
                </div>
                <div className="badge-image-preview mt-5">
                  <div className="position-absolute d-flex justify-content-center text-center mt-4">
                    <div className="mt-3">
                      {showBadgeImageCompliantText && <h4 className="text-white mb-3">Add your badge image</h4>}
                      {
                        formik.values.virtualDisplayCompliantImage
                          ? <div className="uploaded btn btn-primary mr-3 align-self-center">
                            PNG
                            <a className="edit text-primary ml-2" onClick={handleOpenvirtualDisplayCompliantImageImageRef}>
                              <i className="far fa-pencil-alt" aria-hidden="true"></i>
                              <span className="sr-only">Edit</span>
                            </a>
                            <a className="edit text-danger ml-2" onClick={()=>removeImage('virtualDisplayCompliantImage')}>
                              <i className="far fa-trash-alt" aria-hidden="true"></i>
                              <span className="sr-only">Delete</span>
                            </a>
                          </div>
                          : <button type="button" className="btn btn-primary mb-3 mr-3 align-self-center" onClick={handleOpenvirtualDisplayCompliantImageImageRef}>Upload PNG</button>
                      }
                      {
                        formik.values.smartDisplayCompliantImage
                          ? <div className="uploaded btn btn-primary mr-3 align-self-center">
                            BMP
                            <a className="edit text-primary ml-2" onClick={handleOpensmartDisplayCompliantImageRef}>
                              <i className="far fa-pencil-alt" aria-hidden="true"></i>
                              <span className="sr-only">Edit</span>
                            </a>
                            <a className="edit text-danger ml-2" onClick={()=>removeImage('smartDisplayCompliantImage')}>
                              <i className="far fa-trash-alt" aria-hidden="true"></i>
                              <span className="sr-only">Delete</span>
                            </a>
                          </div>
                          : <button type="button" className="btn btn-primary mr-3 mb-3 align-self-center" onClick={handleOpensmartDisplayCompliantImageRef}>Upload BMP</button>
                      }
                      {showBadgeImageCompliantText && <p className="text-white small">At least 520×520px in PNG format. Must have<br/> transparent background and only white content.</p>}
                    </div>
                  </div>

                  <img src="../assets/img/badge-template-check.png" className="badge-icon position-absolute"/>
                  <img src={formik.values.virtualDisplayCompliantImage ? URL.createObjectURL(formik.values.virtualDisplayCompliantImage) : '../assets/img/badge-template-large.png'} className="badge-image"/>
                  <input
                    type="file"
                    accept="image/png"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={virtualDisplayCompliantImageImageRef}
                    name='virtualDisplayCompliantImage'
                    onChange={handleImageChange}
                    data-target="file-input"
                  />
                  <input
                    type="file"
                    accept="image/bmp"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={smartDisplayCompliantImageRef}
                    name='smartDisplayCompliantImage'
                    onChange={handleImageChange}
                    data-target="file-input"
                  />
                </div>
                <div className="my-4 px-3">
                  <Input
                    classes={classes.eventCompletionTextInput}
                    name="eventCompletionText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Completed On Text')}
                    initialValue={t('Completed on')}
                    value={formik.values.eventCompletionText}
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
                  <ErrorMessage
                    formik={formik}
                    name="footer"
                    className="validation-error-message"
                  />
                  <h4 className="fade-50 mb-0">Confidence #: 11111</h4>
                </div>
              </div>
            </div>
            <div className="text-center p-0 float-left badge-configuration-container mt-4">
              <h4 className="mb-3">Non-Compliant</h4>
              <div className="badge-inline-form border shadow mx-auto">
                <div className="bg-black py-4 px-3 text-white text-uppercase">
                  <Input
                    classes={classes.compliantHeader}
                    name="nonCompliantHeader"
                    formik={formik}
                    rows="6"
                    maxLength="15"
                    placeholder={t('Header Text')}
                    value={formik.values.nonCompliantHeader}
                  />
                </div>
                <div className="badge-image-preview mt-5">
                  <div className="position-absolute d-flex justify-content-center mt-4">
                    <div className="mt-3">
                      {showBadgeImageNonCompliantText && <h4 className="text-white mb-3">Add your badge image</h4>}
                      {
                        formik.values.virtualDisplayNonCompliantImage
                          ? <div className="uploaded btn btn-primary mr-3 align-self-center">
                            PNG
                            <a className="edit text-primary ml-2" onClick={handleOpenvirtualDisplayNonCompliantImageImageRef}>
                              <i className="far fa-pencil-alt" aria-hidden="true"></i>
                              <span className="sr-only">Edit</span>
                            </a>
                            <a className="edit text-danger ml-2" onClick={()=>removeImage('virtualDisplayNonCompliantImage')}>
                              <i className="far fa-trash-alt" aria-hidden="true"></i>
                              <span className="sr-only">Delete</span>
                            </a>
                          </div>
                          : <button type="button" className="btn btn-primary mb-3 mr-3 align-self-center" onClick={handleOpenvirtualDisplayNonCompliantImageImageRef}>Upload PNG</button>
                      }
                      {
                        formik.values.smartDisplayNonCompliantImage
                          ? <div className="uploaded btn btn-primary mr-3 align-self-center">
                            BMP
                            <a className="edit text-primary ml-2" onClick={handleOpensmartDisplayNonCompliantImageRef}>
                              <i className="far fa-pencil-alt" aria-hidden="true"></i>
                              <span className="sr-only">Edit</span>
                            </a>
                            <a className="edit text-danger ml-2" onClick={()=>removeImage('smartDisplayNonCompliantImage')}>
                              <i className="far fa-trash-alt" aria-hidden="true"></i>
                              <span className="sr-only">Delete</span>
                            </a>
                          </div>
                          : <button type="button" className="btn btn-primary mb-3 mr-3 align-self-center" onClick={handleOpensmartDisplayNonCompliantImageRef}>Upload BMP</button>
                      }
                      {showBadgeImageNonCompliantText && <p className="text-white small">At least 520×520px in PNG format. Must have<br/> transparent background and only white content.</p>}
                    </div>

                  </div>

                  <img src="../assets/img/badge-template-x.png" className="badge-icon position-absolute"/>
                  <img src={formik.values.virtualDisplayNonCompliantImage ? URL.createObjectURL(formik.values.virtualDisplayNonCompliantImage) : '../assets/img/badge-template-large.png'} className="badge-image"/>
                  
                  <input
                    type="file"
                    accept="image/png"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={virtualDisplayNonCompliantImageImageRef}
                    name='virtualDisplayNonCompliantImage'
                    onChange={handleImageChange}
                    data-target="file-input"
                  />
                  <input
                    type="file"
                    accept="image/bmp"
                    capture="user"
                    style={{ display: 'none' }}
                    ref={smartDisplayNonCompliantImageRef}
                    name='smartDisplayNonCompliantImage'
                    onChange={handleImageChange}
                    data-target="file-input"
                  />
                </div>
                <div className="my-4 px-3">
                  <Input
                    classes={classes.eventCompletionTextInput}
                    name="eventCompletionText"
                    formik={formik}
                    rows="6"
                    maxLength="25"
                    placeholder={t('Event Completed On Text')}
                    value={formik.values.eventCompletionText}
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
                  <ErrorMessage
                    formik={formik}
                    name="footer"
                    className="validation-error-message"
                  />
                  <h4 className="fade-50 mb-0">Confidence #: 11111</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 pt-4 border-top">
        <div className="col-12 p-0 text-right">
          <Button className="mr-3" variant="outline-secondary"><Trans>Cancel</Trans></Button>
          <Button type="submit" variant="primary"><Trans>Create Template</Trans></Button>
        </div>
      </div>
    </form>
  );
};

Form.displayName = 'NewTemplateForm';

export default Form;
