import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';


import EditZoneModal from './edit-zone-modal';
import ConfirmDeleteModal from './confirm-delete-modal';


const Zone = ({
  zone,
  index,
  onRemove,
  onUpdate,
  zoneTypes,
  zonesCount,
  DragHandle,
  ...other
}) => {
  const { t } = useTranslation();
  const [edit, setEdit] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleEditLabelClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setEdit(true);
  };

  const handleLabelSave = (values) => {
    const z = { ...zone };
    z.label = values.label;
    z.type = values.type;
    onUpdate(z, index);
  };

  const onZoneSave = (values) => {
    setEdit(false);
    handleLabelSave(values);
  };

  return (
    <>
      <div className="list-group-item list-group-item-action pl-3 pr-2 d-flex justify-content-between align-items-center" {...other}>
        <DragHandle><img data-target="drag-handle" src="/assets/img/drag-handle.png" className="handle mr-3" width="17" /></DragHandle>

        <div className="w-100">
          <p className="text-primary mb-2">
            <small>
              <Trans i18nKey="zone" /> <span className="zonenumber">{index}</span>
            </small>
          </p>
          <h6 className="mb-2"><small className="text-muted">
            <Trans i18nKey="type_wcol" /></small> {zone.type} <small className="text-muted"></small>
          </h6>
          <h6 className="mb-0">
            <small className="text-muted">
              <Trans i18nKey="label_withcol" />
            </small>
            {' '}
            {zone.label && `${zone.label} `}
          </h6>
        </div>

        <div className="text-right">
          <button
            className="btn text-primary"
            data-target="edit-label-link"
            role="button"
            title={t('edit')}
            onClick={handleEditLabelClick}>
            <i className="far fa-pencil-alt" aria-hidden="true"></i>
          </button>
          <button
            className="btn text-danger"
            role="button"
            title={t('remove')}
            onClick={() => setShowDeleteModal(true)}>
            <i className="fas fa-times-circle" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      {edit && (
        <EditZoneModal
          show
          onClose={() => setEdit(false)}
          onUpdate={onZoneSave}
          zone={zone}
          handleLabelSave={handleLabelSave}
          zoneTypes={zoneTypes}
        />
      )}

      <ConfirmDeleteModal
        show={showDeleteModal}
        canDelete={zonesCount > 1}
        onConfirm={onRemove}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

Zone.propTypes = {
  zone: PropTypes.shape({
    type: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  zoneTypes: PropTypes.array.isRequired,
  zonesCount: PropTypes.number.isRequired,
  DragHandle: PropTypes.any.isRequired,
};
Zone.displayName = 'LocationsConfigureZonesZone';
export default Zone;
