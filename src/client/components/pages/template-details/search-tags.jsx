import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';

const SearchTags = ({ formik, name, onChange, onSave }) => {
  const [tags, setTags] = React.useState([]);
  const [isTagEdit, setIsTagEdit] = React.useState(null);

  React.useEffect(()=>{
    setTags(formik.values[name].split(', '));
  }, [formik.values[name]]);

  const onTagChange = (event) => {
    const {name, value} = event.target;
    tags[parseInt(name)] = value || 'default';
    setTags(tags);
    onChange(tags);
  };

  const handleDiscard = () => {
    setIsTagEdit(null);
  };

  const handleSave = () => {
    setIsTagEdit(null);
    formik.setFieldValue(name, tags.join(', '));
    onSave && onSave();
  };

  return (
    <>
      <label className="text-secondary"><Trans>Search tags</Trans></label>
      <div className="row">
        {tags && tags.map((tag, index)=>(
          <div key={index} className={index % 2 === 0 ? 'px-3' : 'p-0'}>
            {
              isTagEdit !== index 
                ?<span className="template-detail-text badge badge-secondary mr-1 d-inline-block" onClick={()=>setIsTagEdit(index)}>{tag}</span>
                :<div className="template-detail-edit">
                  <input className="form-control" placeholder="Tag 1" name={index} defaultValue={tag} onChange={onTagChange}/>
                  <div className="buttons text-right mt-2">
                    <button className="btn btn-sm btn-outline-secondary discard mr-1" onClick={handleDiscard}>Discard</button>
                    <button className="btn btn-sm btn-primary text-white save" onClick={handleSave}>Save</button>
                  </div>
                </div>
            }
          </div>
        ))}
      </div>
    </>
  );
};

SearchTags.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
};

SearchTags.defaultProps = {
  onChange: () => {},
  onSave: () => {},
};

SearchTags.displayName = 'SearchTags';

export default SearchTags;
