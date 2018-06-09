import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

import './styles.css';

const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

const AddXlsx = ({onFileSelected}) => (
  <div>
    <Button
      color="primary"
      variant="raised"
      className="export-button"
    >
      Загрузить .xlsx
      <input type="file" accept=".xls,.xlsx" className='export-input' onChange={onFileSelected}/>
    </Button>
  </div>
);

AddXlsx.propTypes = {
  onFileSelected: PropTypes.func.isRequired
};

export default AddXlsx;