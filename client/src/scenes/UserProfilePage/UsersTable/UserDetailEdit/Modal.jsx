import React from 'react';
import UserEditContainer from './Container';
import PropTypes from 'prop-types';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import ErrorStatus from '../../../../components/ErrorStatus/ErrorStatus';
import Notifications from '../../../../components/NotificationMessage/Notification';
import { CREATE_MODE } from './constants';

class UserDetailEditModal extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      errors: {
        summary: props.error
      }
    };
  }  

  onSubmit = () => {
    const { user, onFormSubmit, mode } = this.props;
    const validationResult = validateForm(user, mode);

    if ( ! validationResult.success) {
      this.setState({
        errors: validationResult.errors
      });
    }
    else {
      onFormSubmit();
    }
  }

  onClose = () => {   
    this.props.onClose();
    this.setState({errors: {}});
    console.log(this.state.errors);
  }

  render() {

    const { status, user, modalHeader, modalSubmitLabel, onFormSubmit, open, error, mode } = this.props;
    const { errors } = this.state;

    return (
      <div>
        
        <Dialog
          open={open}
          onClose={this.onClose}
          aria-labelledby="new-service-dialog-title"
        >
          <DialogTitle id="new-service-dialog-title">{modalHeader}</DialogTitle>
          <ErrorStatus error={error ? error : errors.summary}/>
          <DialogContent>
            <UserEditContainer user={user} errors={errors} mode={mode}/>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={this.onClose} color="primary">
              Отмена
            </Button>
            <Button onClick={this.onSubmit} color="primary" variant="raised">
              {modalSubmitLabel}
            </Button>
          </DialogActions>
        </Dialog>
        <Notifications status={status}/>
      </div>
    ) 
  }
}

UserDetailEditModal.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  status: PropTypes.object,
  modalHeader: PropTypes.string.isRequired,
  modalSubmitLabel: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
};


/**
 * Validate the form
 *
 * @param {object} payload - the user object passed from the form
 * @returns {object} The result of validation. Object contains a boolean validation result {success} and
 *                   errors object {errors}.
 */
function validateForm(payload, mode) {
  const errors = {};
  let isFormValid = true;

  if (payload) {
    if ( mode === CREATE_MODE || payload.password) {
      if (typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Пароль должен содержать минимум 8 символов';
      }

      if (typeof payload.repeatPassword !== 'string' || payload.repeatPassword !== payload.password) {
        isFormValid = false;
        errors.repeatPassword = 'Пароли не совпадают';
      }
    }

    if (typeof payload.username !== 'string' || payload.username.trim().length === 0) {
      isFormValid = false;
      errors.username = 'Пожалуйста введите логин';
    }

    if (typeof payload.fullname !== 'string' || payload.fullname.trim().length === 0) {
      isFormValid = false;
      errors.fullname = 'Пожалуйста введите ФИО';
    }

    if (typeof payload.role !== 'string' || payload.role.trim().length === 0) {
      isFormValid = false;
      errors.role = 'Пожалуйста введите роль';
    }

    if (!payload.shops || !payload.shops.length  || payload.shops.length === 0) {
      if (payload.role !== 'vendor') {
        isFormValid = false;
        errors.shops = 'Пожалуйста выберите торговую точку';
      }
    }

    if (payload.shops && payload.shops.length > 1 && payload.role === 'admin') {
      isFormValid = false;
      errors.shops = 'Для пользователя с ролью "Администратор сети" должна быть выбрана лишь одна сеть';
    }
  }
  else {
    isFormValid = false;
  }

  if (!isFormValid) {
    errors.summary = 'В форме есть ошибки. Проверьте правильность заполнения.';
  }

  return {
    success: isFormValid,
    errors
  };
}

export default UserDetailEditModal
