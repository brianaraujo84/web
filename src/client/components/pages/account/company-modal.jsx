import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input, ErrorMessage } from 'react-form-dynamic';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Autocomplete } from '../../shared/geo';

const styles = {
  modalBody: {
    overflow: 'initial',
  }
};

const CompanyModal = ({
  show,
  company,
  onClose,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [addressObj, setAddressObj] = React.useState({});
  const geolocation = useSelector(state => state.geolocation.location);
  const { companyName, address = {}, companyId } = company;
  const {
    addressLine1 = '',
    addressLine2 = '',
    city = '',
    state = '',
    zip = '',
  } = address;
  const companyAddress = `${addressLine1}, ${city}, ${state} ${zip}`;
  const companyAddress2 = addressLine2;

  const fields = [
    {
      name: 'companyAddress2',
      label: t('Unit (optional)'),
      initialValue: companyAddress2,
    },
    {
      name: 'companyName',
      label: t('Company Name'),
      initialValue: companyName,
      validations: [
        {
          rule: 'required',
          params: [' '],
        },
      ],
    },
    {
      name: 'companyAddress',
      label: t('Company Address'),
      initialValue: companyAddress,
      validations: [
        {
          rule: 'required',
          params: [' '],
        },
        {
          rule: 'test',
          params: ['test-zip', t('postal_code_reqd'), () => {
            return !!addressObj.zip;
          }]
        },
      ],
    },
  ];

  const handleAddressChange = (company, addr) => {
    const companyAddress = addr.address ? `${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}` : '';
    setAddressObj(addr);
    formik.setFieldTouched('companyAddress', true);
    formik.setFieldValue('companyAddress', companyAddress);
    formik.setFieldTouched('companyAddress2', true);
    formik.setFieldValue('companyAddress2', addr.address2 || '');
  };

  const handleSubmit = (data) => {
    const company = {
      companyId,
      companyName: data.companyName,
      address: {
        addressLine1: addressObj.address,
        addressLine2: data.companyAddress2,
        city: addressObj.city,
        zip: addressObj.zip,
        state: addressObj.state,
        country: addressObj.country,
      }
    };
    onUpdate(company);
  };

  const formik = useForm({ fields, onSubmit: handleSubmit });

  React.useEffect(() => {
    const addr = {
      address: address.addressLine1,
      address2: address.addressLine2,
      city: address.city,
      zip: address.zip,
      state: address.state,
      country: address.country,
    };
    setAddressObj(addr);
    formik.validateForm();
  }, []);

  return (
    <>

      <Modal show={show} onHide={onClose} centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <Trans>Edit Company Details</Trans>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
            <Form.Group controlId="inputCompany">
              <Form.Label className="sr-only"><Trans>Company Name</Trans></Form.Label>
              <Input
                showError={false}
                name="companyName"
                formik={formik}
                placeholder={t('Company Name')}
                classes={{ input: 'form-control' }}
                data-target="input-business-name"
                autoComplete="off"
              />
            </Form.Group>
            <Row>
              <Col md={9}>
                <div className="form-group">
                  <label className="sr-only"><Trans i18nKey="Company Address" /></label>
                  <Autocomplete
                    ac="new-search2"
                    initialValue={formik.values.companyAddress}
                    idPrefix="compAddr"
                    placeholder={t('Company Address')}
                    onSelect={handleAddressChange}
                    geolocation={geolocation}
                    className="form-control"
                    types={['address']}
                    isAddress
                    showError={false}
                    data-target="autocomplete-company"
                  />
                  <ErrorMessage
                    formik={formik}
                    name="companyAddress"
                    className="error-message"
                  />
                </div>
              </Col>
              <Col md={3} className="pl-md-0">
                <Form.Group controlId="inputCompanyAddress2">
                  <Form.Label className="sr-only"><Trans>Unit (optional)</Trans></Form.Label>
                  <Input
                    showError={false}
                    name="companyAddress2"
                    formik={formik}
                    placeholder={t('Unit')}
                    classes={{ input: 'form-control' }}
                    data-target="input-companyAddress2"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" onClick={onClose} type="button">
              <Trans>Cancel</Trans>
            </Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              <Trans>Update</Trans>
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

    </>
  );
};
CompanyModal.displayName = 'CompanyModal';
CompanyModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  company: PropTypes.shape({
    companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    companyName: PropTypes.string,
    address: PropTypes.shape({
      addressLine1: PropTypes.string,
      addressLine2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
      country: PropTypes.string,
    })
  }).isRequired
};
export default CompanyModal;
