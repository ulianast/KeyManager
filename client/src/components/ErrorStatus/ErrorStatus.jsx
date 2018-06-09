import React from 'react'; 
import PropTypes from 'prop-types';
import './styles.css';

class ErrorStatus extends React.Component{
  render(){
    const {error} = this.props;
    return(
      <div>
        {error && <p className="error-message">{error}</p>}
      </div>
    ); 
  }
}

ErrorStatus.propTypes = {
  error : PropTypes.string
}

export default ErrorStatus;
