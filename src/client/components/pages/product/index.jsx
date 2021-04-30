import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import { useActionDispatch } from '../../../hooks';
import { getStandardObject, postConfidenceObject } from '../../../redux/actions/object';
import ProductDetails from './product-details';

const OBJECT_TEMPLATE = 'template';
const OBJECT_LOCATIONS = 'locations';

const Product = () => {
  const { t } = useTranslation();
  useTitle(t('Product'));
 
  const { templateId } = useParams();

  const [template, setTemplate] = React.useState({});
  const [noAvailableWorkspaces, setNoAvailableWorkspaces] = React.useState(false);

  const getReferenceTemplate = useActionDispatch(getStandardObject(OBJECT_TEMPLATE, undefined, 'template', '/reference'));
  const getUsersAvailableWorkspaces = useActionDispatch(postConfidenceObject(OBJECT_LOCATIONS, 'v2'));

  const locationType = useSelector(state => state.locationType?.data);

  const getTemplate = async () => {
    if (templateId) {
      const response = await getReferenceTemplate(templateId);
      setTemplate(response);
    }
  };

  const getAvailableWorkspaces = async () => {
    if (locationType) {
      const res = await getUsersAvailableWorkspaces({
        locationType: locationType,
        start: 0,
        limit: 10
      });
      setNoAvailableWorkspaces(res?.numberOfLocations === 0);
    }
  };

  React.useMemo(() => {
    getTemplate();
  }, [templateId]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  React.useMemo(() => {
    getAvailableWorkspaces();
  },[locationType]);

  return (
    <Layout>
      <div className="content-wrapper">
        <ProductDetails template={template} noAvailableWorkspaces={noAvailableWorkspaces} />
      </div>
    </Layout>
  );
};
    
Product.displayName = 'ProductDetails';
export default Product;
