import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm, Input } from 'react-form-dynamic';


const LinkModal = ({
  onClose,
  onUpdate,
  onDelete,
  show,
  linkData
}) => {
  const { t } = useTranslation();

  const fields = [
    {
      name: 'taskLink',
      label: t('Task link'),
      initialValue: linkData.taskLink,
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'test',
          params: ['test-url', t('Enter valid Url.'), (url = '') => {
            return (/^((((http(s)?):\/\/)|([www.]|[WWW.]))?(?!\.)([a-zA-Z0-9-]*)(\.[a-zA-Z0-9-]*){0,2}\.([a-z]{1,3})(\.[a-z]{1,3})?)(\/([a-zA-Z0-9.#%?= :&_-]*)){0,6}(\?[a-zA-Z0-9%= :&+]*)?$/).test(url);
          }]
        },
      ],
    },
    {
      name: 'taskLinkText',
      label: t('Link text'),
      initialValue: linkData.taskLinkText,
      validations: [
        {
          rule: 'required',
        }
      ],
    },
  ];

  const onSubmit = (values) => {
    onUpdate({ ...values });
  };

  const handleOnClose = () => {
    onClose();
  };

  const formik = useForm({ fields, onSubmit });

  React.useEffect(() => {
    formik.setValues(linkData);
    formik.validateForm();
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleOnClose} centered scrollable={true}>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="text-primary far fa-link" /> <Trans i18nKey="external_link" defaults="External Link"/>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="form-group">
                <label className="text-secondary mb-1">Link</label>
                <Input
                  formik={formik}
                  classes={{ input: 'form-control' }}
                  placeholder={t('Enter Link')}
                  name="taskLink"
                  maxLength="1000"
                  value={formik.values.taskLink}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="text-secondary mb-1">Text</label>
              <Input
                formik={formik}
                classes={{ input: 'form-control' }}
                placeholder={t('Enter Text')}
                name="taskLinkText"
                maxLength="1000"
                value={formik.values.taskLinkText}
                autoComplete="off"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={() => onDelete(linkData)}>
              <Trans i18nKey="delete_link" defaults="Delete Link"/>
            </Button>
            <Button variant="outline-secondary" onClick={handleOnClose}>
              <Trans i18nKey="cancel" />
            </Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid || formik.isSubmitting} style={{ minWidth: 72 }}>
              <Trans i18nKey="save" />
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

LinkModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  show: PropTypes.bool,
  linkData: PropTypes.object,
};

LinkModal.defaultProps = {
  onUpdate: () => {},
  onClose: () => {},
  onDelete: () => {},
  linkData: {},
};

LinkModal.displayName = 'LocationDetailsLinkModal';
export default LinkModal;
