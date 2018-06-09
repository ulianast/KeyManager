import React from "react";
import PropTypes from "prop-types";
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';

import './styles.css';

class TabHeader extends React.Component{
  render(){
    const {tabText} = this.props;

    return(
      <Toolbar className="tab-toolbar">
        <Typography variant="title" color="inherit">
          {tabText}
        </Typography>
      </Toolbar>
    )
  }
}

TabHeader.propTypes = {
  tabText : PropTypes.string.isRequired 
}

export default TabHeader;