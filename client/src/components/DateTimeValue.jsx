import React from 'react'
import PropTypes from 'prop-types';
import moment from 'moment';

class DateTime extends React.PureComponent {

  render() {
    const {val} = this.props;
    
    return(
      <p {...this.props}>
        { 
          (val &&  moment(val.isValid)) ?                 
          new Intl.DateTimeFormat('ru-RU', { 
              day: '2-digit',
              month: '2-digit',
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit',
            }).format(new Date(val)) :
          val
        }
      </p>
    );
  }
}

DateTime.propTypes = {
  val : PropTypes.string
}
export default DateTime;