import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import Button from 'react-bootstrap/Button';


const DescriptionEditor = ({
  onDiscard,
  onSave,
  onChange,
  editedDescription,
}) => {
  const { t } = useTranslation();
  const reactQuillRef = React.useRef();

  return (
    <>
      <div id='toolbar'>
        <select className='ql-header' onChange={e => e.persist()}>
          <option defaultValue />
          <option value='3' />
        </select>
        <button className='ql-bold' />
        <button className='ql-italic' />
        <button className='ql-underline' />
        <button className='ql-strike' />
        <span className='ql-formats'>
          <button type='button' className='ql-list' value='ordered' />	
          <button type='button' className='ql-list' value='bullet' />
        </span>
        <ReactQuill
          placeholder={t('Subtitle / Notes / Description / Other')}
          ref={reactQuillRef}
          value={editedDescription ? editedDescription : ''}
          data-target='textarea-description'
          name='taskDescription'
          onChange={onChange}
          maxLength='3000'
          modules={DescriptionEditor.modules}
          formats={DescriptionEditor.formats}
          theme={'snow'}
          style={{ backgroundColor: 'white' }}
          // onFocus={() => desFocused(true)}
          // onBlur={() => desFocused(false)}
          // ref={inputDescRef}
        />
      </div>
      <div className="text-right actions">
        <Button
          type="button"
          className="task-c-button p-1 btn rounded"
          data-target="button-show-description"
          variant="outline-primary"
          onClick={onDiscard}
        >
          <i className="far fa-times" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="discard" /></span>
        </Button>
        <Button
          type="button"
          variant="outline-primary"
          disabled={editedDescription?.length < 5}
          onClick={onSave}
          className="task-c-button p-1 ml-2 btn rounded btn btn-outline-primary"
          data-target="button-toggle-save"
        >
          <i className="fas fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="save" /></span>
        </Button>
      </div>
    </>
  );
};

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
DescriptionEditor.modules = {
  toolbar: {
    container: '#toolbar',
  },
  clipboard: {
    matchVisual: false,
  }
};

/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
DescriptionEditor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color'
];

DescriptionEditor.propTypes = {
  onDiscard: PropTypes.func,
  onSave: PropTypes.func,
  onChange: PropTypes.func,
  editedDescription: PropTypes.string,
  inputDescRef: PropTypes.object,
  desFocused: PropTypes.func,
};

DescriptionEditor.defaultProps = {};

DescriptionEditor.displayName = 'DescriptionEditor';
export default DescriptionEditor;
