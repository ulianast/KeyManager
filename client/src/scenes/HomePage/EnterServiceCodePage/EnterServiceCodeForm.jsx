import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import ErrorStatus from '../../../components/ErrorStatus/ErrorStatus';
import './styles.css';

class EnterServiceCodeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: props.error,
      code: [
        { val : '', ref : React.createRef() },
        { val : '', ref : React.createRef() },
        { val : '', ref : React.createRef() },
        { val : '', ref : React.createRef() },
      ]   
    };

    this.onActivationButtonClick = this.onActivationButtonClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let index = event.target.name;
    const {code} = this.state;
    const value = event.target.value.trim().replace(/[\W_]/g, '');
    let valueSubs = _.toUpper(value);

    while (index < 4 && (valueSubs.length > 0 || value.length === 0)) {
      const endIndex = valueSubs.length <= 4 ? valueSubs.length : 4;
      code[index].val = valueSubs.substring(0, endIndex);
      index++;

      if (endIndex === 4 && index !== 4) {
        code[index].ref.focus();
      }

      valueSubs = valueSubs.substring(endIndex, valueSubs.length);
    }
    
    this.setState({
      code : code
    });
  }

  componentDidMount() {
    const {code} = this.state;
    // autofocus the input on mount
    if (code && code.length && code[0].ref) code[0].ref.focus();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      error: nextProps.error
    })
  }

  onActivationButtonClick() {
    const {code} = this.state;
    const {onFormSubmit} = this.props;

    const fullCode = `${code[0].val}${code[1].val}${code[2].val}${code[3].val}`;
    
    if (fullCode.length === 16) {
      this.setState({
        error : ''
      });

      onFormSubmit(fullCode);
    }
    else {
      this.setState({
        error : 'Код активации должен содержать 16 символов'
      });
    }
  }

  render() {
    const {code, error} = this.state;

    return (
      <div>
        <ErrorStatus error={error} />
        <div className='code-block'>
          <div className='header-text'> 
            <span>Активация сервисного пакета</span>
          </div>
          <div className='code-line'>
            {code.map((element, index) => {
              return (
                <input
                  key={index}
                  type='text'
                  value={element.val}
                  name={index.toString()}
                  className='code-part'
                  onChange={this.handleChange}
                  ref={input => (element.ref = input)}
                />
              )
            })
          }
            
          </div>
          <Button className='activation-button' variant="raised" color="secondary" onClick={this.onActivationButtonClick}>
            Активировать
          </Button>
        </div>
      </div>
    )
  }
}

EnterServiceCodeForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired
}

export default EnterServiceCodeForm;