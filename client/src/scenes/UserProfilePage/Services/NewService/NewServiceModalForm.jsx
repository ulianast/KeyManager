import React from 'react';
import PropTypes from 'prop-types';
import Dialog, {
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import SmartTable from '../../../../components/SmartTable/SmartTable';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import ErrorStatus from '../../../../components/ErrorStatus/ErrorStatus';
import Dropzone from 'react-dropzone';
import Notifications from '../../../../components/NotificationMessage/Notification';

import './styles.css';

class NewServiceModalForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
	    open: false,
     // errors: props.errors
	  };

	  this.handleOpen = this.handleOpen.bind(this);
	  this.handleClose = this.handleClose.bind(this);
	}  

  handleOpen = () => {
    // this.props.errors.name = '';
    // this.props.errors.components = '';
    // this.props.errors.summary = '';
    this.setState({open: true});
  };

  handleClose = () => {
    this.closeModal();
    this.props.onClose();
  };

  closeModal = () => {
    this.setState({open: false});
  }

  handleFormSubmit = () => {
    this.props.onFormSubmit(this.closeModal);
  };

  // componentWillReceiveProps(nextProps) {
  //   //console.log(nextProps.errors);
  //   this.setState({
  //     errors: nextProps.errors,
  //     service: nextProps.service,
  //     licences: nextProps.licences
  //   });
  // }

  render() {
    const tableHeaders = [
      //{ id: 'id', numeric: true, label: 'Id in DB' },
      { id: 'name', numeric: false, label: 'Лицензия' },
      { id: 'price', numeric: true, label: 'Цена' },
      { id: 'keysCount', numeric: true, label: 'Доступные ключи на данный момент' },  
    ];

    const {service, onChange, errors, licences, onImageSelected, status } = this.props;
    const {open} = this.state;

    return (
      <div>
        <Button variant="raised" onClick={this.handleOpen} color="primary">
          Создать сервис
        </Button>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="new-service-dialog-title"
        >
          <DialogTitle id="new-service-dialog-title">Создание нового сервиса</DialogTitle>
          <ErrorStatus error={errors.summary}/>
          <DialogContent>
            <FormControl aria-describedby="name" className="service-name">
              <InputLabel htmlFor="name">Название сервиса</InputLabel>
              <Input 
                id="name" 
                value={service.name} 
                onChange={onChange} 
                type="text" 
                name="name"
              />
              {errors.name && <FormHelperText className="" error id="name-error-text">{errors.name}</FormHelperText>}
            </FormControl>
            <div className="field-line">
              <SmartTable
                columnHeaders={tableHeaders}
                data={licences}
                selected={service.components}
                isSelectable={true}
                disableToolbar={true}
              />
              {errors.components && <FormHelperText className="" error id="components-error-text">{errors.components}</FormHelperText>}
            </div>
            <Dropzone 
              accept=".jpg,.png"
              multiple={false}
              className="dropzone"
              onDrop={(files) => onImageSelected(files)}>
                {service.img ? <img src={service.img.preview} /> : <div>Выберите изображение</div>}                
            </Dropzone>
            {errors.img && <FormHelperText className="" error id="img-error-text">{errors.img}</FormHelperText>}
            
          </DialogContent>
          
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Отмена
            </Button>
            <Button onClick={this.handleFormSubmit} color="primary" variant="raised">
              Создать
            </Button>
          </DialogActions>
        </Dialog>
        <Notifications status={status}/>
      </div>
    );
  }
}

NewServiceModalForm.propTypes = {
  // onSubmit: PropTypes.func.isRequired,
  onImageSelected: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
  licences: PropTypes.arrayOf(PropTypes.object),
  status: PropTypes.object
};


export default NewServiceModalForm;