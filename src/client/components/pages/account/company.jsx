import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useActionDispatch } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { updateCompany, getProfileData } from '../../../redux/actions/profile';
import CompanyModal from './company-modal';


const Company = () => {
  const { t } = useTranslation();
  const [editable, setEditable] = React.useState(false);
  const toast = useActionDispatch(addToast);
  const loadUser = useActionDispatch(getProfileData);

  const profile = useSelector(state => state.profile.data);
  const {
    isOwner,
    company = {},
  } = profile;
  const { companyName, address = {} } = company;

  const {
    addressLine1 = '',
    addressLine2 = '',
    city = '',
    state = '',
    zip = '',
  } = address;
  const companyAddress = `${addressLine1}, ${city}, ${state} ${zip}`;
  const companyAddress2 = addressLine2;

  const changeCompany = useActionDispatch(updateCompany);

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setEditable(true);
  };

  const handleUpdate = async (company) => {
    try {
      await changeCompany(company);
      loadUser();
      toast(t('Company updated!'));
    } catch (e) {
      toast(t('Update failed!'));
    }
    setEditable(false);
  };

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 pb-2">
          <p className="lead mb-3">
            <Trans>
              Company
            </Trans>
            {' '}
            {
              isOwner && !editable && (
                <a href="#" onClick={handleEdit} data-target="edit-link">
                  <i className="far fa-pencil-alt" aria-hidden="true" /> <span className="sr-only"><Trans>Edit Company</Trans></span>
                </a>
              )
            }
          </p>
          <Form.Group controlId="inputCompany">
            <Form.Label className="sr-only"><Trans>Company Name</Trans></Form.Label>
            <Form.Control
              name="companyName"
              placeholder={t('Company Name')}
              autoComplete="new-companyName"
              value={companyName}
              disabled
            />
          </Form.Group>
          <Row>
            <Col className='col-9'>
              <Form.Group controlId="inputCompanyAddress">
                <Form.Label className="sr-only"><Trans>Company Address</Trans></Form.Label>
                <Form.Control
                  name="companyAddress"
                  placeholder={t('Company Address')}
                  autoComplete="new-companyAddress"
                  value={companyAddress}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col className="col-3 pl-0">
              <Form.Group controlId="inputCompanyAddress2">
                <Form.Label className="sr-only"><Trans>Unit (optional)</Trans></Form.Label>
                <Form.Control
                  name="companyAddress2"
                  placeholder={t('Unit')}
                  autoComplete="new-companyAddress2"
                  value={companyAddress2}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

        </div>
      </div>
      <CompanyModal
        show={editable}
        onClose={() => setEditable(false)}
        onUpdate={handleUpdate}
        company={company}
      />
    </>
  );
};
Company.displayName = 'Company';
export default Company;
