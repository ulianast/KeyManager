import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import './styles.css';

const styles = theme => ({
  // container: {
  //   display: 'flex',
  //   flexWrap: 'wrap',
  // },
  // textField: {
  //   marginLeft: theme.spacing.unit,
  //   marginRight: theme.spacing.unit,
  //   width: 200,
  // },
  // menu: {
  //   width: 200,
  // },
});

const LoginForm = ({
  classes,
  onSubmit,
  onChange,
  errors,
  user
}) => (
  <Card className="service-login-form">
    <form action="/" onSubmit={onSubmit} className={classes.container}>

      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <h2 className="card-heading">Войти в Сервисный кабинет</h2>

      <div className={classes.textField}>
        <FormControl aria-describedby="username" className="login-username">
          <InputLabel htmlFor="username">Логин</InputLabel>
          <Input 
            id="username" 
            value={user.username} 
            onChange={onChange} 
            type="text" 
            name="username"
          />
          {errors.username && <FormHelperText className="" error id="username-error-text">{errors.username}</FormHelperText>}
        </FormControl>
      </div>

      <div className={classes.textField}>
        <FormControl aria-describedby="password" className="login-password">
          <InputLabel htmlFor="password">Пароль</InputLabel>
          <Input 
            id="password" 
            value={user.password} 
            onChange={onChange} 
            type="password" 
            name="password"
          />
          {errors.password && <FormHelperText className="" error id="password-error-text">{errors.password}</FormHelperText>}
        </FormControl>
      </div>

      <div className="button-line">
        <Button variant="raised" type="submit" color="primary">
          Войти
        </Button>
      </div>
    </form>
  </Card>
);

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginForm);
