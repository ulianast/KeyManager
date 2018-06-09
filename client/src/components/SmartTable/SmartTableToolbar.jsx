import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';




const SmartTableToolbar = props => {
  // const { numSelected} = props;

  return (
    <Toolbar>
      <div>
        {props.numSelected > 0 && (
          <Typography color="inherit" variant="subheading">
            {props.numSelected} элементов выбрано
          </Typography> 
        )}
        {!props.numSelected && props.title && (
          <Typography variant="title">{props.title}</Typography>
        )}
      </div>
    </Toolbar>
  );
};

SmartTableToolbar.propTypes = {
  // classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

export default SmartTableToolbar;