import React from 'react';
import PropTypes from 'prop-types';
import { classnames, ErrorMessage } from 'react-form-dynamic';


export const SelectGroup = ({
  inputRef,
  formik,
  name,
  onChange,
  onBlur,
  options,
  placeholder,
  inline,
  showError,
  classes,
  styles,
  prepend,
  append,
  label,
  invalid,
  ...other
}) => {
  const handleChange = (event) => {
    formik.handleChange(event);
    if (onChange) {
      onChange(event);
    }
  };

  const handleBlur = (event) => {
    formik.handleBlur(event);
    if (onBlur) {
      onBlur(event);
    }
  };

  const opts = [...options];

  if (placeholder) {
    opts.unshift({
      label: placeholder,
      value: '',
    });
  }

  const isError = invalid || (!!formik.touched[name] && !!formik.errors[name]);

  return (
    <>
      <div
        style={{
          ...(inline && {
            display: 'inline'
          }),
          ...styles.container,
        }}
        className={classnames([
          classes.container,
          isError && (classes.containerError || 'error')
        ])}
      >
        {
          !!prepend && prepend
        }
        {!!label && <label className={classes.label}>{label}</label>}
        <select
          style={{
            ...styles.select,
          }}
          name={name}
          {...formik.getFieldProps(name)}
          onChange={handleChange}
          onBlur={handleBlur}
          className={classnames([
            classes.select,
            isError && (classes.inputError || 'error')
          ])}
          ref={inputRef}
          {...other}
        >
          {
            opts.map((o, i) => {
              return Array.isArray(o.options) ? (
                <optgroup key={i} label={o.label}>
                  {o?.options?.map((og, ig) => (
                    <option
                      key={ig}
                      value={og.value}
                      style={{
                        ...styles.option,
                      }}
                      className={classes.option}
                    >
                      {og.label}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option
                  key={i}
                  value={o.value}
                  style={{
                    ...styles.option,
                  }}
                  className={classes.option}
                >
                  {o.label}
                </option>
              );
            })
          }
        </select>
        {
          !!append && append
        }
        {showError &&
          <ErrorMessage
            formik={formik}
            name={name}
            className={classes.error}
            style={styles.error}
          />
        }
      </div>
    </>
  );
};

SelectGroup.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  invalid: PropTypes.bool,
  inline: PropTypes.bool.isRequired,
  showError: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  styles: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]).isRequired,
    label: PropTypes.string.isRequired,
  })),
  prepend: PropTypes.node,
  append: PropTypes.node,
  label: PropTypes.string,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
};
SelectGroup.defaultProps = {
  onChange: () => { },
  onBlur: () => { },
  options: [],
  placeholder: '',
  showError: true,
  inline: false,
  styles: {},
  classes: {},
  prepend: null,
  append: null,
  label: null,
  inputRef: null,
  invalid: false,
};
SelectGroup.displayName = 'SelectGroup';

export default React.forwardRef((props, ref) => (
  <SelectGroup inputRef={ref} {...props} />
));
