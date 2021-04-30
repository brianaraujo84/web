import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

let image;
const maxWidth = 800;

const CropModal = ({
  onClose,
  onUpdate,
  crop: cropProp,
  square,
  photo,
}) => {
  const [imgUrl, setImgUrl] = React.useState(null);
  const [croppedImage, setCroppedImage] = React.useState(null);
  const [crop, setCrop] = React.useState({});

  const handleSave = () => {
    onUpdate(croppedImage);
  };

  const onImageLoaded = (img) => {
    image = img;
  };

  const getContextBlob = (crop) => {
    const canvas = document.createElement('canvas');
    const aspect = crop.aspect || crop.width / crop.height;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const width = Math.min(maxWidth, crop.width * scaleX, crop.height * scaleY);
    canvas.width = width;
    canvas.height = width / aspect;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.width * scaleY / aspect,
      0,
      0,
      width,
      width / aspect
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject();
          return;
        }
        blob.name = 'profile.jpg';
        resolve(blob);
      }, 'image/jpeg', 0.85);
    });
  };

  const onCropComplete = async (crop) => {
    const img = await getContextBlob(crop);
    setCroppedImage(img);
  };

  const onCropChange = (crop) => {

    setCrop(crop);
  };

  React.useEffect(() => {
    setImgUrl(URL.createObjectURL(photo));
    return () => {
      URL.revokeObjectURL(imgUrl);
    };
  }, [photo]);

  React.useEffect(() => {
    if (cropProp) {
      setCrop(cropProp);
    } else if (square) {
      setCrop({
        unit: '%',
        width: 80,
        aspect: 1,
      });
    } else {
      setCrop({
        unit: '%',
        width: 90,
        aspect: 32 / 15,
      });
    }
  }, []);

  return (
    <>
      {
        !!imgUrl && (
          <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
              <Modal.Title as="h5">
                <i className="text-primary fal fa-crop" /> <Trans>Crop Image</Trans>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div id="image-crop" className="text-center" >
                <ReactCrop
                  src={imgUrl}
                  crop={crop}
                  ruleOfThirds
                  onImageLoaded={onImageLoaded}
                  onComplete={onCropComplete}
                  onChange={onCropChange}
                  data-target="react-crop"
                  locked
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={onClose} data-target="cancel-button">
                <Trans>Add Different Picture</Trans>
              </Button>
              <Button variant="primary" type="submit" onClick={handleSave} data-target="submit-button">
                <Trans>Save</Trans>
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }
    </>
  );
};

CropModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  photo: PropTypes.object.isRequired,
  crop: PropTypes.object,
  square: PropTypes.bool,
};

CropModal.defaultProps = {
  crop: null,
  square: false,
};

CropModal.displayName = 'CropModal';
export default CropModal;
