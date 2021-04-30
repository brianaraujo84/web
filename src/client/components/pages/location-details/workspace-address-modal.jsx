import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import axios from 'axios';
import _ from 'lodash';
import variables from '../../../../server/variables';
import { convertDMS } from '../../../utils/convertDMS';

const CloseIcon = styled.i`
    position: absolute;
    color: #fff;
    right: 0;
    top: -36px;
`;

const MapImg = styled.img`
  width: 100%;
`;

const ModalBody = styled(Modal.Body)`
  padding: 0;
`;

const Content = styled.div`
  padding: 1rem;
`;

const WorkspaceAddressModal = ({ show, onCancel, address, onShowEditLocationModal }) => {
  const [dms, setDms] = React.useState();

  const formatedAddress = React.useMemo(() => {
    if (address && address.addressLine1 && address.city && address.state) {
      return {
        addressLine1:address.addressLine1.replace(/\s+/g, '+'),
        city: address.city.replace(/\s+/g, '+'),
        state: address.state.replace(/\s+/g, '+')
      };   
    }
    return '';
  }, [address]);

  const googleMapsApiUrl = React.useMemo(() => {
    if (formatedAddress) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${formatedAddress.addressLine1},${formatedAddress.city},${formatedAddress.state}&zoom=16&scale=false&size=640x480&maptype=roadmap&key=${variables.google_static_maps_api_key}&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${formatedAddress.addressLine1},${formatedAddress.city},${formatedAddress.state}`;
    }
    return '';
  }, [formatedAddress]);

  React.useEffect(() => {
    const getGeocode = async() => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formatedAddress.addressLine1},+${formatedAddress.city},+${formatedAddress.state}&key=${variables.google_api_key}`;

      try{
        const response = await axios.request({
          url: url,
          method: 'get'
        });

        const location = _.get(response, 'data.results.0.geometry.location');
        if(location) {
          const dms = convertDMS(location.lat, location.lng);
          setDms(dms);
        }
      } catch(e) {
        setDms('');
      }

    };
    
    if(formatedAddress){
      getGeocode();
    }
  }, [formatedAddress]);

  return (
    <Modal show={show} onHide={onCancel} centered>
      <CloseIcon className="fal fa-times fa-2x" onClick={onCancel}></CloseIcon>

      <Modal.Header>
        <Modal.Title>
          <Trans>Workspace Address</Trans>
        </Modal.Title>
      </Modal.Header>

      <ModalBody>
        <MapImg src={googleMapsApiUrl} id="wp-address" alt={address.addressLine1} />
        <Content>
          <p className="mb-0">
            <i className="fas fa-map-marker-alt text-primary fa-sm mr-1"></i>
            {`${address.addressLine1}, ${address.city}, ${address.state} ${address.zip}`}
            <i className="far fa-pencil-alt text-primary ml-1" data-target="edit-icon" onClick={onShowEditLocationModal}></i>
          </p>
          <div className="text-secondary">
            {dms}
          </div>
        </Content>
      </ModalBody>
    </Modal>
  );
};

WorkspaceAddressModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  onShowEditLocationModal: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

WorkspaceAddressModal.defaultProps = {
  show: false,
};

WorkspaceAddressModal.displayName = 'WorkspaceAddressModal';

export default WorkspaceAddressModal;
