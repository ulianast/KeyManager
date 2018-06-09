import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

class PercentageCircle extends React.PureComponent {
  render() {
    return(
      <div className="c100 big">
        <span>
          {this.props.val}
        </span>
      </div>
    )
  }
}

PercentageCircle.propTypes = {
  val: PropTypes.number.isRequired,
}

export default PercentageCircle;