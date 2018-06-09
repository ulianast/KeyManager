import React from 'react';
import PropTypes from 'prop-types';
import Dialog, {
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import ServiceCode from '../../../../../components/ServiceCode/ServiceCode';

class GenerateCodeModal extends React.Component {

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     open: false,
  //    // errors: props.errors
  //   };

  //   this.handleClose = this.handleClose.bind(this);
  // }  

  // handleClose = () => {
  //   this.setState({open: false});
  // };

  render() {
    // const {open} = this.state;
    const {onGeneratePdf, code, open, handleClose} = this.props;

    return(
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="service-code-dialog-title"
        >
        <DialogTitle id="service-code-dialog-title">Код сервисного пакета</DialogTitle>
        <DialogContent>
          <ServiceCode serviceCode={code}/>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Закрыть
          </Button>
          <Button onClick={onGeneratePdf} color="primary" variant="raised">
            Сгененрировать PDF
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

GenerateCodeModal.propTypes = {
  open : PropTypes.bool.isRequired,
  code : PropTypes.string.isRequired,
  onGeneratePdf : PropTypes.func.isRequired,
  handleClose : PropTypes.func.isRequired
} 

export default GenerateCodeModal;