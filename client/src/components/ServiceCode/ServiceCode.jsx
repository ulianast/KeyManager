import React from 'react'
import PropTypes from 'prop-types';
import './styles.css';

class ServiceCode extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      formattedCode : this.props.serviceCode
    };
  }  
  componentWillMount() {
    const {formattedCode} = this.state;

    if (formattedCode.length && formattedCode.length === 16) {
      const part1 = formattedCode.substring(0,4);
      const part2 = formattedCode.substring(4,8);
      const part3 = formattedCode.substring(8,12);
      const part4 = formattedCode.substring(12,16);

      const dashFormattedCode = `${part1}-${part2}-${part3}-${part4}`;

      this.setState({
        formattedCode : dashFormattedCode
      });
    }
  }

  render() {
    const {formattedCode} = this.state;
    const {className} = this.props;
    
    return (
      <p className={className ? className : 'service-code'}>
        {formattedCode}
      </p>
    )
  }
}

ServiceCode.propTypes = {
  serviceCode : PropTypes.string.isRequired,
  className: PropTypes.string
}
export default ServiceCode;